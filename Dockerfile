# Dockerfile en la raíz para que Easypanel construya el sitio CAPEST sin configurar "Build path".
FROM nginx:1.27-alpine
COPY capest/nginx.conf /etc/nginx/conf.d/default.conf
COPY capest/index.html capest/robots.txt capest/sitemap.xml /usr/share/nginx/html/
COPY capest/assets/ /usr/share/nginx/html/assets/
COPY capest/panel/ /usr/share/nginx/html/panel/
EXPOSE 80
HEALTHCHECK --interval=30s --timeout=3s CMD wget -qO- http://127.0.0.1/health || exit 1
CMD ["nginx", "-g", "daemon off;"]
