FROM lipanski/docker-static-website:latest

COPY src/cliente .

EXPOSE 8000/tcp

CMD ["/busybox", "httpd", "-f", "-v", "-p", "8000", "-c", "httpd.conf"]
