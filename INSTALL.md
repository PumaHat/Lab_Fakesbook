# Instalación

Primero, clona el repositorio en tu equipo: `git clone https://github.com/PumaHat/Lab_Fakesbook.git`.

Después, crea un archivo de entorno (`.env`, así, sin nombre de archivo, solo la extensión) en el directorio , y escribe lo siguiente:

```
PHCT_SECRET_KEY={llave}
PHCT_ALLOWED_HOSTS=localhost
```

Escribe una contraseña segura en donde dice `{llave}`. El valor de `PHCT_ALLOWED_HOSTS` déjalo igual, a menos que quieras usar un dominio en específico para servir este laboratorio.

Por último, usa Docker Compose para servir el proyecto: `docker compose up -d`.

Podrás acceder a él desde http://localhost:8000/.
