"""
URL configuration for phct project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.urls import path

from publicaciones.views import *
from usuarios.views import *

urlpatterns = [
    path('sesion_ver', sesion_ver),
    path('sesion_iniciar', sesion_iniciar),
    path('sesion_cerrar', sesion_cerrar),
    path('usuario_listar', usuario_listar),
    path('usuario_crear', usuario_crear),
    path('usuario_ver/<int>', usuario_ver),
    path('usuario_descargar/<int>', usuario_descargar),
    path('usuario_subir/<int>', usuario_subir),
    path('usuario_editar/<int>', usuario_editar),
    path('publicacion_listar', publicacion_listar),
    path('publicacion_crear', publicacion_crear),
    path('publicacion_ver/<int>', publicacion_ver),
    path('publicacion_descargar/<int>', publicacion_descargar),
    path('publicacion_subir/<int>', publicacion_subir),
    path('publicacion_editar/<int>', publicacion_editar),
    path('publicacion_borrar/<int>', publicacion_borrar),
    path('comentario_listar/<int>', comentario_listar),
    path('comentario_crear/<int>', comentario_crear),
    path('comentario_editar/<int>', comentario_editar),
    path('comentario_borrar/<int>', comentario_borrar),
    path('reaccion_listar/<int>', reaccion_listar),
    path('reaccion_crear/<int>', reaccion_crear),
    path('reaccion_borrar/<int>', reaccion_borrar)
]


