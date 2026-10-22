-- CAPEST: sistema de reservas de visitas. PostgreSQL 14+.
-- Ejecutar en una base de datos propia (ej. `capest`) con un usuario dedicado.
-- Todas las tablas llevan org_id para poder reutilizar el sistema con otros negocios.

CREATE TABLE IF NOT EXISTS negocios (
  org_id                  VARCHAR(50) PRIMARY KEY,
  slug                    VARCHAR(60) UNIQUE NOT NULL,
  nombre                  VARCHAR(120) NOT NULL,
  activo                  BOOLEAN NOT NULL DEFAULT TRUE,
  zona_horaria            VARCHAR(60) NOT NULL DEFAULT 'America/Santiago',
  min_anticipacion_horas  INT NOT NULL DEFAULT 12,   -- no se puede reservar con menos anticipación
  max_dias                INT NOT NULL DEFAULT 30,   -- hasta cuántos días adelante se reserva
  max_pendientes_telefono INT NOT NULL DEFAULT 3,    -- anti-abuso: reservas activas por teléfono en 24 h
  created_at              TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Bloques de atención por día de la semana (0 = domingo ... 6 = sábado) y su capacidad.
CREATE TABLE IF NOT EXISTS bloques (
  id          SERIAL PRIMARY KEY,
  org_id      VARCHAR(50) NOT NULL REFERENCES negocios(org_id) ON DELETE CASCADE,
  bloque_id   VARCHAR(30) NOT NULL,           -- 'manana', 'tarde'
  etiqueta    VARCHAR(60) NOT NULL,           -- 'Mañana'
  dia_semana  SMALLINT NOT NULL CHECK (dia_semana BETWEEN 0 AND 6),
  hora_desde  TIME NOT NULL,
  hora_hasta  TIME NOT NULL,
  capacidad   INT NOT NULL DEFAULT 1 CHECK (capacidad >= 0),
  activo      BOOLEAN NOT NULL DEFAULT TRUE,
  UNIQUE (org_id, bloque_id, dia_semana)
);

-- Días u horarios no disponibles (feriados, vacaciones). bloque_id NULL = todo el día.
CREATE TABLE IF NOT EXISTS bloqueos (
  id         SERIAL PRIMARY KEY,
  org_id     VARCHAR(50) NOT NULL REFERENCES negocios(org_id) ON DELETE CASCADE,
  fecha      DATE NOT NULL,
  bloque_id  VARCHAR(30),
  motivo     VARCHAR(200),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_bloqueos_org_fecha ON bloqueos (org_id, fecha);

CREATE TABLE IF NOT EXISTS reservas (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id            VARCHAR(50) NOT NULL REFERENCES negocios(org_id) ON DELETE CASCADE,
  codigo            VARCHAR(12) NOT NULL UNIQUE,
  nombre            VARCHAR(120) NOT NULL,
  telefono          VARCHAR(20)  NOT NULL,
  email             VARCHAR(120),
  tipo_propiedad    VARCHAR(20)  NOT NULL DEFAULT 'otro'
                    CHECK (tipo_propiedad IN ('hogar','empresa','oficina','comercio','otro')),
  plaga             VARCHAR(60)  NOT NULL,
  comuna            VARCHAR(80)  NOT NULL,
  direccion         VARCHAR(200) NOT NULL,
  frecuencia        VARCHAR(20)  NOT NULL DEFAULT 'puntual'
                    CHECK (frecuencia IN ('puntual','mensual','trimestral')),
  mensaje           VARCHAR(600),
  fecha             DATE NOT NULL,
  bloque_id         VARCHAR(30) NOT NULL,
  estado            VARCHAR(20) NOT NULL DEFAULT 'pendiente'
                    CHECK (estado IN ('pendiente','confirmada','realizada','cancelada')),
  origen            VARCHAR(30) NOT NULL DEFAULT 'website',
  notas_internas    VARCHAR(600),
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_reservas_org_fecha  ON reservas (org_id, fecha, bloque_id);
CREATE INDEX IF NOT EXISTS idx_reservas_org_tel    ON reservas (org_id, telefono, created_at);

-- Horarios disponibles: una fila por día y bloque con cupos libres.
CREATE OR REPLACE FUNCTION fn_slots(p_slug TEXT, p_desde DATE DEFAULT NULL, p_dias INT DEFAULT 14)
RETURNS TABLE (fecha TEXT, bloque_id TEXT, etiqueta TEXT, hora_desde TEXT, hora_hasta TEXT, cupos INT)
LANGUAGE plpgsql STABLE AS $$
DECLARE
  n negocios%ROWTYPE;
  ahora TIMESTAMP;
  desde DATE;
BEGIN
  SELECT * INTO n FROM negocios WHERE slug = p_slug AND activo;
  IF NOT FOUND THEN RETURN; END IF;
  ahora := now() AT TIME ZONE n.zona_horaria;
  desde := GREATEST(COALESCE(p_desde, ahora::date), ahora::date);
  p_dias := LEAST(GREATEST(COALESCE(p_dias, 14), 1), 60);

  RETURN QUERY
  SELECT to_char(d.f, 'YYYY-MM-DD'),
         b.bloque_id::text,
         b.etiqueta::text,
         to_char(b.hora_desde, 'HH24:MI'),
         to_char(b.hora_hasta, 'HH24:MI'),
         (b.capacidad - COALESCE(u.usados, 0))::int
  FROM generate_series(desde, desde + (p_dias - 1), interval '1 day') AS d(f)
  JOIN bloques b
    ON b.org_id = n.org_id AND b.activo AND b.dia_semana = EXTRACT(DOW FROM d.f)::int
  LEFT JOIN LATERAL (
    SELECT count(*)::int AS usados FROM reservas r
    WHERE r.org_id = n.org_id AND r.fecha = d.f::date AND r.bloque_id = b.bloque_id
      AND r.estado IN ('pendiente','confirmada')
  ) u ON TRUE
  WHERE d.f::date <= ahora::date + n.max_dias
    AND (d.f::date + b.hora_desde) >= ahora + make_interval(hours => n.min_anticipacion_horas)
    AND b.capacidad - COALESCE(u.usados, 0) > 0
    AND NOT EXISTS (
      SELECT 1 FROM bloqueos x
      WHERE x.org_id = n.org_id AND x.fecha = d.f::date AND (x.bloque_id IS NULL OR x.bloque_id = b.bloque_id)
    )
  ORDER BY 1, b.hora_desde;
END $$;

-- Crea una reserva. Nunca lanza errores hacia afuera: devuelve {ok:false,error:'...'}.
-- El bloqueo por (negocio, fecha, bloque) evita que dos personas tomen el último cupo a la vez.
CREATE OR REPLACE FUNCTION fn_crear_reserva(p_slug TEXT, p JSONB)
RETURNS JSONB
LANGUAGE plpgsql AS $$
DECLARE
  n negocios%ROWTYPE;
  b bloques%ROWTYPE;
  ahora TIMESTAMP;
  v_fecha DATE;
  v_bloque TEXT := NULLIF(trim(p->>'block'), '');
  v_tel TEXT := regexp_replace(COALESCE(p->>'phone',''), '[^0-9+]', '', 'g');
  v_nombre TEXT := left(trim(COALESCE(p->>'name','')), 120);
  v_comuna TEXT := left(trim(COALESCE(p->>'commune','')), 80);
  v_dir TEXT := left(trim(COALESCE(p->>'address','')), 200);
  v_plaga TEXT := left(trim(COALESCE(p->>'pestType','')), 60);
  v_prop TEXT := COALESCE(NULLIF(p->>'propertyType',''), 'otro');
  v_freq TEXT := COALESCE(NULLIF(p->>'serviceFrequency',''), 'puntual');
  v_email TEXT := left(trim(COALESCE(p->>'email','')), 120);
  v_msg TEXT := left(trim(COALESCE(p->>'message','')), 600);
  v_usados INT;
  v_recientes INT;
  v_codigo TEXT;
  v_id UUID;
BEGIN
  SELECT * INTO n FROM negocios WHERE slug = p_slug AND activo;
  IF NOT FOUND THEN RETURN jsonb_build_object('ok', false, 'error', 'negocio_no_encontrado'); END IF;

  BEGIN v_fecha := (p->>'date')::date; EXCEPTION WHEN others THEN
    RETURN jsonb_build_object('ok', false, 'error', 'fecha_invalida'); END;

  IF length(v_nombre) < 2 OR length(v_comuna) < 2 OR length(v_dir) < 5 OR length(v_plaga) < 2
     OR length(regexp_replace(v_tel, '\D', '', 'g')) NOT BETWEEN 8 AND 12
     OR v_bloque IS NULL
     OR v_prop NOT IN ('hogar','empresa','oficina','comercio','otro')
     OR v_freq NOT IN ('puntual','mensual','trimestral')
     OR (v_email <> '' AND v_email !~ '^[^@\s]+@[^@\s]+\.[^@\s]+$') THEN
    RETURN jsonb_build_object('ok', false, 'error', 'datos_invalidos');
  END IF;

  ahora := now() AT TIME ZONE n.zona_horaria;

  PERFORM pg_advisory_xact_lock(hashtext(n.org_id || v_fecha::text || v_bloque));

  SELECT count(*) INTO v_recientes FROM reservas
   WHERE org_id = n.org_id AND telefono = v_tel AND estado IN ('pendiente','confirmada')
     AND created_at > now() - interval '24 hours';
  IF v_recientes >= n.max_pendientes_telefono THEN
    RETURN jsonb_build_object('ok', false, 'error', 'demasiadas_solicitudes');
  END IF;

  SELECT * INTO b FROM bloques
   WHERE org_id = n.org_id AND bloque_id = v_bloque AND activo AND dia_semana = EXTRACT(DOW FROM v_fecha)::int;
  IF NOT FOUND
     OR (v_fecha + b.hora_desde) < ahora + make_interval(hours => n.min_anticipacion_horas)
     OR v_fecha > ahora::date + n.max_dias
     OR EXISTS (SELECT 1 FROM bloqueos x WHERE x.org_id = n.org_id AND x.fecha = v_fecha
                AND (x.bloque_id IS NULL OR x.bloque_id = v_bloque)) THEN
    RETURN jsonb_build_object('ok', false, 'error', 'bloque_no_disponible');
  END IF;

  SELECT count(*) INTO v_usados FROM reservas
   WHERE org_id = n.org_id AND fecha = v_fecha AND bloque_id = v_bloque AND estado IN ('pendiente','confirmada');
  IF v_usados >= b.capacidad THEN
    RETURN jsonb_build_object('ok', false, 'error', 'bloque_lleno');
  END IF;

  LOOP
    v_codigo := 'CP-' || upper(substr(translate(md5(random()::text || clock_timestamp()::text), '01lio', 'ABCDE'), 1, 5));
    EXIT WHEN NOT EXISTS (SELECT 1 FROM reservas WHERE codigo = v_codigo);
  END LOOP;

  INSERT INTO reservas (org_id, codigo, nombre, telefono, email, tipo_propiedad, plaga, comuna, direccion,
                        frecuencia, mensaje, fecha, bloque_id, origen)
  VALUES (n.org_id, v_codigo, v_nombre, v_tel, NULLIF(v_email,''), v_prop, v_plaga, v_comuna, v_dir,
          v_freq, NULLIF(v_msg,''), v_fecha, v_bloque, left(COALESCE(NULLIF(p->>'source',''), 'website'), 30))
  RETURNING id INTO v_id;

  RETURN jsonb_build_object('ok', true, 'data', jsonb_build_object(
    'id', v_id, 'codigo', v_codigo, 'fecha', v_fecha, 'bloque', v_bloque, 'etiqueta', b.etiqueta,
    'hora_desde', to_char(b.hora_desde,'HH24:MI'), 'hora_hasta', to_char(b.hora_hasta,'HH24:MI'),
    'estado', 'pendiente', 'nombre', v_nombre, 'telefono', v_tel, 'comuna', v_comuna,
    'direccion', v_dir, 'plaga', v_plaga));
END $$;

-- Datos iniciales de CAPEST. CONFIRMAR días, horarios y capacidad con el cliente.
INSERT INTO negocios (org_id, slug, nombre) VALUES ('capest', 'capest', 'CAPEST')
ON CONFLICT (org_id) DO NOTHING;

INSERT INTO bloques (org_id, bloque_id, etiqueta, dia_semana, hora_desde, hora_hasta, capacidad)
SELECT 'capest', v.id, v.etq, d.dia, v.desde::time, v.hasta::time, 2
FROM (VALUES ('manana','Mañana','09:00','13:00'), ('tarde','Tarde','14:00','18:00')) AS v(id, etq, desde, hasta)
CROSS JOIN (VALUES (1),(2),(3),(4),(5),(6)) AS d(dia)
ON CONFLICT (org_id, bloque_id, dia_semana) DO NOTHING;
