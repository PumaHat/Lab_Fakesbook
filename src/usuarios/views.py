from django.conf import settings
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.http import JsonResponse, HttpResponse

from io import StringIO
import os

from usuarios.models import Perfil

def sesion_ver(request):
    obj = {}
    if request.user:
         obj['usuario'] = request.user.username
    return JsonResponse(obj, status=200, safe=False)

def sesion_iniciar(request):
    try:
        usuario = authenticate(username=request.POST['usuario'], password=request.POST['contrasena'])
        if usuario:
            login(request, usuario)
            return JsonResponse({'id': usuario.id, 'usuario': usuario.username}, status=201)
        else:
            return HttpResponse(status=403)
    except:
        return HttpResponse(status=400)

def sesion_cerrar(request):
    logout(request)
    return HttpResponse(status=200)

def usuario_listar(request):
    obj = []
    try:
        usuarios = Perfil.objects.all()
    except:
        return HttpResponse(status=400)
    for u in usuarios:
        obj.append({
            'id': u.pk,
            'usuario': u.usuario.username,
            'genero': u.genero or u.genero_otro,
            'biografia': u.biografia,
            'estado': u.estado,
            'fotografia': u.fotografia
        })
    return JsonResponse(obj, status=200, safe=False)

def usuario_crear(request):
    try:
        nuevo = User()
        nuevo.username = request.POST['usuario']
        nuevo.email = request.POST['email']
        nuevo.set_password(request.POST['contrasena'])
        nuevo.full_clean()
        nuevo_p = Perfil()
        nuevo_p.genero = request.POST.get('genero', 0)
        nuevo_p.genero_otro = request.POST.get('genero_otro')
        nuevo_p.biografia = request.POST.get('biografia')
        nuevo_p.estado = request.POST.get('estado')
        nuevo.save()
        nuevo_p.usuario = nuevo
        nuevo_p.full_clean()
        nuevo_p.save()
        return HttpResponse(status=201)
    except Exception as e:
        print(e.error_dict)
        return HttpResponse(status=400)

def usuario_ver(request, **kwargs):
    try:
        u = Perfil.objects.get(pk=kwargs['int'])
    except:
        return HttpResponse(status=400)
    obj = {
        'id': u.pk,
        'usuario': u.usuario.username,
        'email': u.usuario.email,
        'genero': u.genero or u.genero_otro,
        'biografia': u.biografia,
        'estado': u.estado,
        'fotografia': u.fotografia
    }
    return JsonResponse(obj, status=200)

def usuario_descargar(request, **kwargs):
    try:
        arch = open(os.path.join(settings.MEDIA_PROFILE_ROOT, str(kwargs['int'])), "rb")
        return HttpResponse(arch.read(), status=200, content_type='application/octet-stream')
    except Exception as e:
        arch = StringIO('<?xml version="1.0"?>\n<svg xmlns="http://www.w3.org/2000/svg" width="340" height="340">\n<path fill="#fff" d="m169,.5a169,169 0 1,0 2,0zm0,86a76,76 0 1\n1-2,0zM57,287q27-35 67-35h92q40,0 67,35a164,164 0 0,1-226,0"/>\n</svg>')
        return HttpResponse(arch.read(), status=200, content_type='image/svg+xml')

def usuario_subir(request, **kwargs):
    if not request.user:
        return HttpResponse(status=401)
    if not request.method == 'POST':
        return HttpResponse(status=405)
    try:
        usuario = Perfil.objects.get(pk=kwargs['int'])
    except:
        return HttpResponse(status=400)
    if not request.user.pk == perfil.pk:
        return HttpResponse(status=403)
    try:
        usuario.fotografia = True
        usuario.save()
        data=request.FILES['archivo']
        with open(os.path.join(settings.MEDIA_PROFILE_ROOT, str(usuario.pk)), "wb") as f:
            for chunk in data.chunks():
                f.write(chunk)
        return HttpResponse(status=200)
    except:
        return HttpResponse(status=500)

def usuario_editar(request, **kwargs):
    if not request.user:
        return HttpResponse(status=401)
    if not request.user.pk == int(kwargs['int']):
        return HttpResponse(status=403)
    try:
        perfil = Perfil.objects.get(pk=kwargs['int'])
    except:
        return HttpResponse(status=400)
    if 'usuario' in request.POST:
        perfil.usuario.username = request.POST['usuario']
    if 'email' in request.POST:
        perfil.usuario.email = request.POST['email']
    if 'contrasena' in request.POST:
        perfil.usuario.set_password(request.POST['contrasena'])
    if 'genero' in request.POST:
        perfil.genero = request.POST['genero']
    if 'genero_otro' in request.POST:
        perfil.genero_otro = request.POST['genero_otro']
    if 'biografia' in request.POST:
        perfil.biografia = request.POST['biografia']
    if 'estado' in request.POST:
        perfil.estado = request.POST['estado']

    try:
        perfil.full_clean()
        perfil.usuario.full_clean()
        perfil.usuario.save()
        perfil.save()
        return HttpResponse(status=204)
    except:
        return HttpResponse(status=420)
