from django.contrib.auth.models import User
from django.db import models

class Perfil(models.Model):
    class Generos(models.IntegerChoices):
        MASCULINO = 1
        FEMENINO = 2
        OTRO = 0

    usuario = models.OneToOneField(User, on_delete=models.CASCADE)
    genero = models.IntegerField(choices=Generos)
    genero_otro = models.CharField(max_length=32, default=None, null=True, blank=True)
    biografia = models.CharField(max_length=4096, default=None, null=True, blank=True)
    estado = models.CharField(max_length=256, default=None, null=True, blank=True)
    fotografia = models.BooleanField(default=False)
