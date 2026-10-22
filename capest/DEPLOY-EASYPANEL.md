# Despliegue de CAPEST en Easypanel

Sitio estático (Nginx). No necesita base de datos ni variables de entorno.

## Opción A: usar este repositorio (rápido)
Repositorio `plantillaweb`, rama `claude/quirky-gates-dsghkk`, carpeta `capest/`.
1. Easypanel > proyecto nuevo `capest` > **Servicio > App**.
2. **Source > GitHub**: repositorio `plantillaweb`, rama `claude/quirky-gates-dsghkk`.
3. **Build**: tipo *Dockerfile*, **Build path** `/capest`, archivo `Dockerfile`.
4. **Domains**: agregar el dominio temporal de Easypanel, puerto de destino **80**.
5. **Deploy**. Cada `git push` a esa rama se puede redesplegar (activar Auto Deploy en la app).

## Opción B: repositorio propio (recomendado a largo plazo)
1. Crear en GitHub un repositorio vacío, por ejemplo `capest-web`.
2. Copiar el contenido de `capest/` a la raíz del repositorio nuevo y subirlo a `main`.
3. En Easypanel: Source > GitHub > `capest-web`, rama `main`, Build path `/`.

## Antes de conectar el dominio definitivo
- Quitar la línea `X-Robots-Tag` de `nginx.conf` (hoy impide que Google indexe el dominio temporal).
- Reemplazar `dominio-por-confirmar.cl` en `index.html` (canonical, og:image, JSON-LD), `robots.txt` y `sitemap.xml`.
- Completar `CAPEST_CONFIG` al final de `index.html` con los datos confirmados por CAPEST.
- Conectar el formulario: crear un Webhook en n8n y pegar su URL en `webhookUrl`.
- Activar HTTPS desde Easypanel (Let's Encrypt) al agregar el dominio.
