from django.conf import settings
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.http import JsonResponse, HttpResponse

from usuarios.models import Perfil
from publicaciones.models import Publicacion, Comentario, Reaccion

def publicacion_listar(request):
    obj = []
    try:
        publicaciones = Publicacion.objects.all().order_by('-fecha')
    except:
        return HttpResponse(status=400)
    for p in publicaciones:
        obj.append({
            'id': p.pk,
            'texto': p.texto,
            'usuario': p.usuario.username,
            'archivo': p.archivo,
            'fecha': p.fecha,
            'reacciones': p.reacciones
        })
    return JsonResponse(obj, status=200, safe=False)

def publicacion_crear(request):
    if not request.user:
        return HttpResponse(status=401)
    try:
        nuevo = Publicacion()
        nuevo.texto = request.POST['texto']
        nuevo.usuario = request.user
        nuevo.full_clean()
        nuevo.save()
        return HttpResponse(status=201)
    except:
        return HttpResponse(status=400)

def publicacion_ver(request, **kwargs):
    try:
        publicacion = Publicacion.objects.get(pk=kwargs['int'])
    except:
        return HttpResponse(status=400)
    obj = {
        'id': p.pk,
        'texto': p.texto,
        'usuario': p.usuario.username,
        'archivo': p.archivo,
        'fecha': p.fecha,
        'reacciones': p.reacciones
    }
    return JsonResponse(obj, status=200)

def publicacion_descargar(request, **kwargs):
    try:
        arch = open(os.path.join(settings.MEDIA_POSTS_ROOT, str(kwargs['int'])), "rb")
        return HttpResponse(arch.read(), status=200, content_type='application/octet-stream')
    except Exception as e:
        return HttpResponse(status=500)

def publicacion_subir(request, **kwargs):
    if not request.user:
        return HttpResponse(status=401)
    if not request.method == 'POST':
        return HttpResponse(status=405)
    try:
        publicacion = Publicacion.objects.get(pk=kwargs['int'])
    except:
        return HttpResponse(status=400)
    if not request.user.pk == publicacion.perfil.usuario.pk:
        return HttpResponse(status=403)
    try:
        publicacion.archivo = True
        publicacion.save()
        data=request.FILES['archivo']
        with open(os.path.join(settings.MEDIA_POSTS_ROOT, str(nuevo.pk)), "wb") as f:
            for chunk in data.chunks():
                f.write(chunk)
        return HttpResponse(status=200)
    except:
        return HttpResponse(status=500)

def publicacion_editar(request, **kwargs):
    if not request.user:
        return HttpResponse(status=401)
    try:
        publicacion = Publicacion.objects.get(pk=kwargs['int'])
    except:
        return HttpResponse(status=400)
    if not request.user.pk == publicacion.perfil.usuario.pk:
        return HttpResponse(status=403)
    if 'texto' in request.POST:
        publicacion.texto = request.POST['texto']

    publicacion.full_clean()
    publicacion.save()

def publicacion_borrar(request, **kwargs):
    try:
        publicacion = Publicacion.objects.get(pk=kwargs['int'])
    except:
        return HttpResponse(status=400)
    try:
        publicacion.delete()
        archivo = os.path.join(settings.MEDIA_POSTS_ROOT, str(publicacion.pk))
        if os.path.exists(archivo):
            os.unlink(archivo)
    except:
        return HttpResponse(status=500)
    return HttpResponse(status=204)

def comentario_listar(request, **kwargs):
    obj = []
    try:
        comentarios = Comentario.objects.filter(publicacion_id=kwargs['int']).order_by('~fecha')
    except:
        return HttpResponse(status=400)
    for c in comentarios:
        obj.append({
            'id': c.pk,
            'texto': c.texto,
            'usuario': c.usuario.username,
            'fecha': c.fecha,
        })
    return JsonResponse(obj, status=200, safe=False)

def comentario_crear(request, **kwargs):
    if not request.user:
        return HttpResponse(status=401)
    try:
        nuevo = Comentario()
        nuevo.texto = request.POST['texto']
        nuevo.usuario = request.user
        nuevo.publicacion_id = kwargs['int']
        nuevo.full_clean()
        nuevo.save()
        return HttpResponse(status=201)
    except:
        return HttpResponse(status=400)

def comentario_editar(request, **kwargs):
    if not request.user:
        return HttpResponse(status=401)
    try:
        comentario = Comentario.objects.get(pk=kwargs['int'])
    except:
        return HttpResponse(status=400)
    if not request.user.pk == comentario.perfil.usuario.pk:
        return HttpResponse(status=403)
    if 'texto' in request.POST:
        comentario.texto = request.POST['texto']

    comentario.full_clean()
    comentario.save()

def comentario_borrar(request, **kwargs):
    try:
        comentario = Comentario.objects.get(pk=kwargs['int'])
    except:
        return HttpResponse(status=400)
    try:
        comentario.delete()
    except:
        return HttpResponse(status=500)
    return HttpResponse(status=204)

def reaccion_listar(request, **kwargs):
    obj = []
    try:
        reacciones = Reacciones.objects.filter(publicacion_id=kwargs['int'])
    except:
        return HttpResponse(status=400)
    for r in reacciones:
        obj.append({
            'id': r.pk,
            'tipo': r.tipo,
            'usuario': r.usuario.username,
        })
    return JsonResponse(obj, status=200, safe=False)

def reaccion_crear(request, **kwargs):
    if not request.user:
        return HttpResponse(status=401)
    try:
        nuevo = Reaccion()
        nuevo.tipo = request.POST['tipo']
        nuevo.usuario = request.user
        nuevo.publicacion_id = kwargs['int']
        nuevo.full_clean()
        nuevo.save()
        return HttpResponse(status=201)
    except:
        return HttpResponse(status=400)

def reaccion_borrar(request, **kwargs):
    try:
        reaccion = Reaccion.objects.get(pk=kwargs['int'])
    except:
        return HttpResponse(status=400)
    try:
        reaccion.delete()
    except:
        return HttpResponse(status=500)
    return HttpResponse(status=204)
