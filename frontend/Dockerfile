FROM nginx:alpine

# Copiar arquivos do frontend para o diretório padrão do Nginx
COPY index.html /usr/share/nginx/html/
COPY app.js /usr/share/nginx/html/
COPY styles.css /usr/share/nginx/html/

# Expor a porta 80
EXPOSE 80

# O Nginx já inicia automaticamente com a imagem base
CMD ["nginx", "-g", "daemon off;"]
