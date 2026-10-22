# Reservas de visitas CAPEST: puesta en marcha

Piezas:
- `schema.sql`: tablas y funciones en PostgreSQL (`fn_slots`, `fn_crear_reserva`). La lógica de cupos vive en la base de datos.
- `n8n-1-horarios.json`, `n8n-2-reservar.json`, `n8n-3-panel.json`: los 3 workflows para importar en n8n.
- `../index.html`: formulario de reserva en 3 pasos (sección Contacto).
- `../panel/index.html`: panel del dueño, se publica en `/panel/`.

Probado: el SQL contra PostgreSQL 16 real (incluye 6 reservas simultáneas sobre un bloque de capacidad 2: solo 2 pasan), el código de los nodos Code contra esa base, y el formulario y el panel en navegador. NO probado: la importación de los JSON en tu n8n ni el envío por Evolution API. Revisa cada workflow después de importarlo.

## 1. Base de datos
En la consola de PostgreSQL de Easypanel:
```sql
CREATE DATABASE capest;
CREATE USER capest_user WITH PASSWORD 'USAR_UNA_CLAVE_LARGA';
GRANT ALL ON DATABASE capest TO capest_user;
\c capest
\i schema.sql        -- o pegar el contenido del archivo
GRANT ALL ON ALL TABLES IN SCHEMA public TO capest_user;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO capest_user;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO capest_user;
```
El schema carga un horario de ejemplo: lunes a sábado, bloques Mañana 09:00-13:00 y Tarde 14:00-18:00, 2 cupos por bloque. Confirmar con el cliente y ajustar en las tablas `bloques` y `negocios` (anticipación mínima y días máximos).

## 2. n8n
1. Crear la credencial Postgres `CAPEST DB` (host interno del servicio, base `capest`, usuario `capest_user`).
2. Importar los 3 JSON (Workflows > Import from file). En cada nodo Postgres elegir esa credencial.
3. `CAPEST - Panel de administración`: en el nodo "Autenticar y preparar" cambiar `CAMBIAR_CLAVE_ADMIN` por una clave larga. Mientras no se cambie, el panel rechaza todo.
4. `CAPEST - Reservar visita`: en el nodo "Avisar a CAPEST por WhatsApp" reemplazar URL de Evolution, instancia y apikey. El nodo no bloquea la reserva si falla.
5. Activar los 3 workflows. Si n8n duplica `webhookId`, regenerar cambiando el path y volviendo a ponerlo.
6. Probar:
```bash
curl -X POST https://TU-N8N/webhook/capest-slots -H 'Content-Type: application/json' -d '{"slug":"capest","dias":7}'
```

## 3. Conectar la web y el panel
- `index.html`: en `CAPEST_CONFIG.reservas` poner `apiUrl: "https://TU-N8N/webhook"`. Con `apiUrl` vacío funciona en modo demostración (no guarda nada). Para pasar a real, además poner `demo: false`.
- `panel/index.html`: poner la misma URL en `var API = ''`.
- Si el navegador bloquea las llamadas (CORS), revisar que el webhook tenga `Allowed Origins` y, para el panel, que acepte el header `x-admin-key`.

## 4. Volver a la versión sin reservas
- Rápido: `reservas: { enabled: false ... }` en `CAPEST_CONFIG`. La web vuelve al formulario simple por WhatsApp.
- Completo: el commit `c256c48` de la rama `claude/quirky-gates-dsghkk` es la versión anterior a las reservas (`git checkout c256c48 -- capest`).

## Límites conocidos
- La confirmación es manual: el cliente queda "pendiente" y CAPEST confirma por WhatsApp. El cliente escribe primero por WhatsApp (botón del paso final), para no depender de mensajes automáticos hacia él.
- No hay reprogramación ni cancelación por el cliente, ni recordatorios automáticos.
- La clave del panel es una clave compartida, no usuarios individuales.
