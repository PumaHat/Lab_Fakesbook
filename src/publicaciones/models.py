from django.db import models

from usuarios.models import Perfil

class Publicacion(models.Model):
    texto = models.CharField(max_length=2048)
    usuario = models.ForeignKey(Perfil, on_delete=models.CASCADE)
    archivo = models.BooleanField(default=False)
    fecha = models.DateTimeField(auto_now=True)

    @property
    def reacciones(self):
        lista = [0, 0, 0, 0, 0, 0, 0, 0]
        for r in Reaccion.objects.filter(publicacion_id=self.pk):
            lista[r.tipo - 1] += 1
        return lista

class Comentario(models.Model):
    texto = models.CharField(max_length=2048)
    usuario = models.ForeignKey(Perfil, on_delete=models.CASCADE)
    publicacion = models.ForeignKey(Publicacion, on_delete=models.CASCADE)
    fecha = models.DateTimeField(auto_now=True)

class Reaccion(models.Model):
    class TipoReaccion(models.IntegerChoices):
        GUSTO = 1
        ENCANTO = 2
        EMPATIA = 3
        RISA = 4
        ASOMBRO = 5
        TRISTEZA = 6
        ENOJO = 7
        ABURRIMIENTO = 8

    tipo = models.IntegerField(choices=TipoReaccion)
    usuario = models.ForeignKey(Perfil, on_delete=models.CASCADE)
    publicacion = models.ForeignKey(Publicacion, on_delete=models.CASCADE)

