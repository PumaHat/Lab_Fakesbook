FROM python:alpine

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

COPY requirements.txt /srv/
COPY src /srv/phct
RUN pip3 install -r /srv/requirements.txt
WORKDIR /srv/phct
RUN python3 manage.py makemigrations usuarios publicaciones
RUN python3 manage.py migrate

EXPOSE 8001/tcp

CMD ["python3", "manage.py", "runserver", "0.0.0.0:8001"]
