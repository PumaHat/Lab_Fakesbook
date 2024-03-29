"use strict"

let urldom = new URL(document.location);
urldom.port = "8001";
window.dominio = urldom.origin;

function dereaccionar(e){
    let xhrobj = new XMLHttpRequest();
    let pid = e.target.parentNode.parentNode.dataset.id;

    xhrobj.open("POST", window.dominio+"/reaccion_borrar/"+pid);
    xhrobj.withCredentials = true;
    xhrobj.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhrobj.addEventListener("readystatechange", () => {
        if (xhrobj.readyState == 4){
            if (xhrobj.status == 204){
                let val = ["👍", "💜", "🥰", "😅", "😮", "😢", "😡", "🙄"].indexOf(e.target.textContent)+1;
                let elemval = document.querySelector('.publicacion[data-id="'+pid+'"] .reacciones dd:nth-of-type('+val.toString()+')');
                elemval.textContent = parseInt(elemval.textContent) - 1;
                let btn = elemval.parentNode.nextElementSibling;
                btn.classList.add("material-symbols-outlined");
                btn.textContent = "mood";
                btn.title = "Reaccionar";
            } else alert("Error al desreaccionar");
        }
    });
    xhrobj.send();
}

function reaccionar(e){
    let val = 0;
    switch (e.target.parentNode.id){
        case "reacc-gusto":
            val = 1;
            break;
        case "reacc-encanto":
            val = 2;
            break;
        case "reacc-empatia":
            val = 3;
            break;
        case "reacc-risa":
            val = 4;
            break;
        case "reacc-asombro":
            val = 5;
            break;
        case "reacc-tristeza":
            val = 6;
            break;
        case "reacc-enojo":
            val = 7;
            break;
        case "reacc-aburrimiento":
            val = 8;
            break;
    }
    let xhrobj = new XMLHttpRequest();
    let pid = e.target.parentNode.parentNode.dataset.id;
    xhrobj.open("POST", window.dominio+"/reaccion_crear/"+pid);
    xhrobj.withCredentials = true;
    xhrobj.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhrobj.addEventListener("readystatechange", () => {
        if (xhrobj.readyState == 4){
            if (xhrobj.status == 201){
                let elemval = document.querySelector('.publicacion[data-id="'+pid+'"] .reacciones dd:nth-of-type('+val.toString()+')');
                elemval.textContent = parseInt(elemval.textContent) + 1;
                let btn = elemval.parentNode.nextElementSibling;
                btn.classList.remove("material-symbols-outlined");
                btn.textContent = elemval.previousElementSibling.textContent;
                btn.title = "Quitar reacción";
                e.target.parentNode.parentNode.classList.remove('mostrado');
            } else alert("Error al reaccionar");
        }
    });
    xhrobj.send("tipo="+val.toString());
}

function mostrarReaccion(e){
    if (e.target.classList.contains("material-symbols-outlined")){
        let medidas = e.target.getBoundingClientRect();
        let lista = document.getElementById('emoji-lista');
        lista.dataset.id = e.target.parentNode.parentNode.dataset.id;
        lista.style.setProperty('left', (medidas.x + window.scrollX - medidas.width/2).toFixed().toString() + 'px');
        lista.style.setProperty('top', (medidas.y + window.scrollY - medidas.height/2).toFixed().toString() + 'px');
        lista.classList.add('mostrado');
    } else {
        dereaccionar(e);
    }
}

function borrarComentario(e){
    if (e.target.textContent == "delete"){
        // Entar a modo borrar
        let pid = e.target.parentNode.dataset.id;
        let xhrobj = new XMLHttpRequest();
        xhrobj.open("POST", window.dominio+"/comentario_borrar/"+pid);
        xhrobj.withCredentials = true;
        xhrobj.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xhrobj.addEventListener("readystatechange", () => {
            if (xhrobj.readyState == 4){
                if (xhrobj.status == 204)
                    e.target.parentNode.parentNode.removeChild(e.target.parentNode);
                else alert("Error al borrar un comentario");
            }
        });
        xhrobj.send("texto="+encodeURIComponent(e.target.previousElementSibling.value));

    } else {
        // Entrar a modo cancelar edición
        e.target.textContent = "delete";
        e.target.previousElementSibling.textContent = "edit";
        let c = e.target.previousElementSibling.previousElementSibling;
        c.textContent = c.dataset.prev;
        c.contentEditable = false;
    }
}

function editarComentario(e){
    if (e.target.textContent == "edit"){
        // Entrar a modo edición
        e.target.textContent = "save";
        e.target.nextElementSibling.textContent = "cancel";
        let c = e.target.previousElementSibling;
        c.dataset.prev = c.textContent;
        c.contentEditable = true;
        c.focus();
    } else {
        // Entrar a modo guardado
        let pid = e.target.parentNode.dataset.id;
        let xhrobj = new XMLHttpRequest();
        xhrobj.open("POST", window.dominio+"/comentario_editar/"+pid);
        xhrobj.withCredentials = true;
        xhrobj.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xhrobj.addEventListener("readystatechange", () => {
            if (xhrobj.readyState == 4){
                if (xhrobj.status == 204){
                    e.target.textContent = "edit";
                    e.target.nextElementSibling.textContent = "delete";
                    e.target.previousElementSibling.contentEditable = false;
                } else {
                    alert("Error al editar un comentario");
                    e.target.previousElementSibling.focus();
                }
            }
        });
        let c = e.target.previousElementSibling;
        c.textContent = c.innerHTML.replaceAll("<br>", "\n");
        xhrobj.send("texto="+encodeURIComponent(e.target.previousElementSibling.textContent));
    }
}

function crearComentario(e){
    let pid = e.target.parentNode.parentNode.parentNode.dataset.id;
    let xhrobj = new XMLHttpRequest();
    xhrobj.open("POST", window.dominio+"/comentario_crear/"+pid);
    xhrobj.withCredentials = true;
    xhrobj.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhrobj.addEventListener("readystatechange", () => {
        if (xhrobj.readyState == 4){
            if (xhrobj.status == 201){
                e.target.parentNode.parentNode.appendChild(dibujarComentario(JSON.parse(xhrobj.response)));
                e.target.previousElementSibling.value = null;
            } else alert("Error al crear un comentario");
        }
    });
    xhrobj.send("texto="+encodeURIComponent(e.target.previousElementSibling.value));
}

function dibujarComentario(obj){
    let com = document.createElement("article");
    com.className = "comentario";
    com.dataset.id = obj.id;
    let img = document.createElement("img");
    img.src = window.dominio + "/usuario_descargar/" + obj.usuario_id;
    let nom = document.createElement("span");
    nom.textContent = obj.usuario;
    let p = document.createElement("span");
    p.textContent = obj.texto;
    let edit = document.createElement("span");
    edit.className = "material-symbols-outlined";
    edit.textContent = "edit";
    edit.addEventListener("click", editarComentario);
    let borr = document.createElement("span");
    borr.className = "material-symbols-outlined";
    borr.textContent = "delete";
    borr.addEventListener("click", borrarComentario);
    if (parseInt(localStorage.getItem("usuario")) != obj.usuario_id){
        edit.hidden = true;
        borr.hidden = true;
    }
    com.append(img, nom, p, edit, borr);
    return com;
}

function dibujarPublicacion(obj){
    let publi = document.createElement("article");
    publi.className = "publicacion";
    publi.dataset.id = obj.id;
    let header = document.createElement("header");
    let img = document.createElement("img");
    img.src = window.dominio + "/usuario_descargar/" + obj.usuario_id;
    img.className = "foto_pub";
    let input = document.createElement("input");
    input.setAttribute("type", "file");
    input.hidden = true;
    let h4 = document.createElement("h4");
    h4.textContent = obj.usuario;
    let time = document.createElement("time");
    time.textContent = (new Date(obj.fecha)).toLocaleString();
    header.append(img, input, h4, time);
    let contenido = document.createElement("div");
    contenido.className = "pub_contenido";
    let contenidoP = document.createElement("p");
    contenidoP.textContent = obj.texto
    contenido.appendChild(contenidoP);
    if (obj.archivo){
        let archivo = document.createElement("img");
        archivo.src = window.dominio + "/publicacion_descargar/" + obj.id;
        contenido.appendChild(archivo);
    }
    let reacciones = document.createElement("div");
    reacciones.className = "reacciones";
    let lreacc = document.createElement("dl");
    let emociones = ["👍", "💜", "🥰", "😅", "😮", "😢", "😡", "🙄"];
    for (let r of emociones){
        let lreacc_s = document.createElement("dt");
        lreacc_s.textContent = r;
        let lreacc_c = document.createElement("dd");
        lreacc_c.textContent = "0";
        lreacc.append(lreacc_s, lreacc_c);
    }
    let reaccbtn = document.createElement("span");
    reaccbtn.className = "material-symbols-outlined";
    reaccbtn.textContent = "mood";
    reaccbtn.title = "Reaccionar";
    reaccbtn.addEventListener("click", mostrarReaccion);
    reacciones.append(lreacc, reaccbtn);
    let xhrobj = new XMLHttpRequest();
    xhrobj.open("GET", window.dominio+"/reaccion_listar/"+obj.id);
    xhrobj.addEventListener("readystatechange", () => {
        if (xhrobj.readyState == 4){
            if (xhrobj.status == 200){
                for (let u of JSON.parse(xhrobj.response)){
                    let nodo = lreacc.children[1+2*(u.tipo-1)];
                    nodo.textContent = parseInt(nodo.textContent)+1;
                    if (localStorage.getItem("nombreusuario") == u.usuario){
                        reaccbtn.classList.remove("material-symbols-outlined");
                        reaccbtn.textContent = emociones[u.tipo-1];
                        reaccbtn.title = "Quitar reacción";
                    }
                }
            } else alert("Error al obtener el listado de reacciones");
        }
    });
    xhrobj.send();
    let comentarios = document.createElement("div");
    comentarios.className = "comentarios";
    let comentarios_crear = document.createElement("div");
    comentarios_crear.className = "comentarios_crear";
    let textArea = document.createElement("textarea");
    textArea.name = "comm";
    textArea.placeholder = "Comentario";
    let btnComentar = document.createElement("button");
    btnComentar.textContent = "Comentar";
    btnComentar.addEventListener("click", crearComentario);
    comentarios_crear.append(textArea, btnComentar);
    comentarios.append(comentarios_crear);
    let xhrobj2 = new XMLHttpRequest();
    xhrobj2.open("GET", window.dominio+"/comentario_listar/"+obj.id);
    xhrobj2.addEventListener("readystatechange", () => {
        if (xhrobj2.readyState == 4){
            if (xhrobj2.status == 200){
                for (let u of JSON.parse(xhrobj2.response)){
                    comentarios.appendChild(dibujarComentario(u));
                }
            } else alert("Error al obtener el listado de comentarios");
        }
    });
    xhrobj2.send();
    publi.append(header, contenido, reacciones, comentarios);
    return publi;
}

function rellenarTarjeta(){
    let idu = localStorage.getItem('usuario');
    let tarjeta = document.getElementById("perfil");
    let srcimg = window.dominio + "/usuario_descargar/" + idu + "?" + (new Date()).toISOString();
    document.getElementById("foto_p").src = srcimg;
    document.getElementById("edit_foto_p").src = srcimg;
    document.querySelector("#nueva_pub .foto_pub").src = srcimg;
    let xhrobj = new XMLHttpRequest();
    xhrobj.open("GET", window.dominio+"/usuario_ver/"+idu);
    xhrobj.addEventListener("readystatechange", () => {
        if (xhrobj.readyState == 4){
            if (xhrobj.status == 200){
                let obj = JSON.parse(xhrobj.response);
                tarjeta.querySelector("#info h3").textContent = obj.usuario;
                tarjeta.querySelector("#genero span").textContent = (obj.genero==1)?"Masculino":(obj.genero==2)?"Femenino":obj.genero;
                tarjeta.querySelector("#bio span").textContent = obj.biografia;
                tarjeta.querySelector("#est span").textContent = obj.estado;

                document.getElementById("editnomusu").value = obj.usuario;
                document.getElementById("editcorreo").value = "";
                document.getElementById("editpass").value = "";
                if (obj.genero == 1){
                    document.getElementById("editgenero").value = "masc";
                    document.getElementById("editgenerootro").value = "";
                } else if (obj.genero == 2){
                    document.getElementById("editgenero").value = "fem";
                    document.getElementById("editgenerootro").value = "";
                } else {
                    document.getElementById("editgenero").value = "otro";
                    document.getElementById("editgenerootro").value = obj.genero;
                }
                document.getElementById("editbio").value = obj.biografia;
                document.getElementById("editestado").value = obj.estado;
            } else alert("Error al consultar datos de usuario");
        }
    });
    xhrobj.send();
}

function vaciarTarjeta(){
    let tarjeta = document.getElementById("perfil");
    document.getElementById("foto_p").src = null;
    document.getElementById("edit_foto_p").src = null;
    tarjeta.querySelector("#info h3").textContent = "";
    tarjeta.querySelector("#genero span").textContent = "";
    tarjeta.querySelector("#bio span").textContent = "";
    tarjeta.querySelector("#est span").textContent = "";
}

function cambiarPagina(){
    let pagina = location.hash.substring(1);
    let p = document.getElementById("p_"+pagina);
    console.log("Cambiando a página "+pagina);
    if (p){
        let ant = document.querySelector("body>article:not([hidden])")
        if (ant) ant.hidden = true;
        p.hidden = false;
    } else console.error(pagina + " no existe!");
    if (pagina=="principal"){
        rellenarTarjeta();
        let ult = document.getElementById("nueva_pub").nextElementSibling;
        while (ult){
            let nuevoUlt = ult.nextElementSibling;
            ult.parentNode.removeChild(ult);
            ult = nuevoUlt;
        }
        ult = document.getElementById("nueva_pub").parentNode;
        let xhrobj = new XMLHttpRequest();
        xhrobj.open("GET", window.dominio+"/publicacion_listar");
        xhrobj.addEventListener("readystatechange", () => {
            if (xhrobj.readyState == 4){
                if (xhrobj.status == 200){
                    for (let u of JSON.parse(xhrobj.response)){
                        ult.appendChild(dibujarPublicacion(u));
                    }
                } else alert("Error al obtener el listado de publicaciones");
            }
        });
        xhrobj.send();
    }
}

window.addEventListener("popstate", cambiarPagina);

document.addEventListener("DOMContentLoaded", _ => {
    let nomusu = localStorage.getItem("usuario");
    if (nomusu) history.pushState(null, null, "#principal");
    else history.pushState(null, null, "#sesion");
    cambiarPagina();

    /* Eventos de botones */
    document.getElementById("inicio_sesion").addEventListener("click", (e) => {
        let xhrobj = new XMLHttpRequest();
        xhrobj.open("POST", window.dominio+"/sesion_iniciar");
        xhrobj.withCredentials = true;
        xhrobj.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xhrobj.addEventListener("readystatechange", () => {
            if (xhrobj.readyState == 4){
                if (xhrobj.status == 201){
                    let obj = JSON.parse(xhrobj.response);
                    localStorage.setItem("usuario", obj.id);
                    localStorage.setItem("nombreusuario", obj.usuario);
                    history.pushState(null, null, "#principal");
                    cambiarPagina();
                } else if (xhrobj.status == 403) alert("Credenciales incorrectas");
                else alert("Error al iniciar sesión");
            }
        });
        xhrobj.send("usuario="+encodeURIComponent(document.getElementById("user").value)+"&contrasena="+encodeURIComponent(document.getElementById("password").value));
    });

    document.getElementById("registrar_usuario").addEventListener("click", (e) => {
        history.pushState(null, null, "#registrar");
        cambiarPagina();
    });

    document.getElementById("enviaregistro").addEventListener("click", (e) => {
        let xhrobj = new XMLHttpRequest();
        xhrobj.open("POST", window.dominio+"/usuario_crear");
        xhrobj.withCredentials = true;
        xhrobj.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xhrobj.addEventListener("readystatechange", () => {
            if (xhrobj.readyState == 4){
                if (xhrobj.status == 201){
                    history.pushState(null, null, "#sesion");
                    cambiarPagina();
                } else alert("Error al crear nuevo usuario");
            }
        });
        xhrobj.send("usuario="+encodeURIComponent(document.getElementById("regnomusu").value)+"&email="+encodeURIComponent(document.getElementById("regcorreo").value)+"&contrasena="+encodeURIComponent(document.getElementById("regpass").value));
    });

    document.getElementById("inicio").addEventListener("click", _ => {
        location.href = "#inicio";
        document.querySelector("body>header").scrollIntoView();
    });

    document.getElementById("nueva-pub").addEventListener("click", _ => document.getElementById("nueva").focus() );

    document.getElementById("buscar-amigos").addEventListener("click", _ => {
        location.href = "#listaramigos";
        let lista = document.querySelector("#p_listaramigos ul");
        let xhrobj = new XMLHttpRequest();
        xhrobj.open("GET", window.dominio+"/usuario_listar");
        xhrobj.addEventListener("readystatechange", () => {
            if (xhrobj.readyState == 4){
                if (xhrobj.status == 200){
                    lista.textContent = "";
                    for (let u of JSON.parse(xhrobj.response)){
                        let li = document.createElement("li");
                        let img = document.createElement("img");
                        img.src = window.dominio + "/usuario_descargar/" + u.id;
                        let usu = document.createElement("p");
                        usu.textContent = u.usuario;
                        let edo = document.createElement("p");
                        edo.textContent = u.estado;
                        li.append(img, usu, edo);
                        lista.appendChild(li);
                    }
                } else alert("Error al obtener el listado de usuarios");
            }
        });
        xhrobj.send();
    });

    document.getElementById("cerrar-sesion").addEventListener("click", _ => {
        let xhrobj = new XMLHttpRequest();
        xhrobj.open("POST", window.dominio+"/sesion_cerrar");
        xhrobj.withCredentials = true;
        xhrobj.addEventListener("readystatechange", () => {
            if (xhrobj.readyState == 4){
                if (xhrobj.status == 200){
                    vaciarTarjeta();
                    localStorage.removeItem("usuario");
                    localStorage.removeItem("nombreusuario");
                    location.href = "#sesion";
                } else alert("Error al cerrar sesión");
            }
        });
        xhrobj.send();
    });

    document.getElementById("informacion").addEventListener("click", _ => {
        location.href = "https://github.com/PumaHat/Lab_Fakesbook";
    });

    document.getElementById("publicar").addEventListener("click", (e) => {
        let idu = localStorage.getItem('usuario');
        let xhrobj = new XMLHttpRequest();
        xhrobj.open("POST", window.dominio+"/publicacion_crear");
        xhrobj.withCredentials = true;
        xhrobj.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xhrobj.addEventListener("readystatechange", () => {
            if (xhrobj.readyState == 4){
                if (xhrobj.status == 201){
                    let obj = JSON.parse(xhrobj.response);
                    let archivos = document.getElementById("nueva_archivo");
                    if (archivos.files.length){
                        const formData = new FormData();
                        formData.append("archivo", archivos.files[0]);
                        let xhrobj2 = new XMLHttpRequest();
                        xhrobj2.open("POST", window.dominio+"/publicacion_subir/"+obj.id);
                        xhrobj2.withCredentials = true;
                        xhrobj2.addEventListener("readystatechange", () => {
                            if (xhrobj2.readyState == 4){
                                if (xhrobj2.status == 200) location.reload();
                                else alert("Error al subir la foto de la publicación");
                            }
                        });
                        xhrobj2.send(formData);
                        archivos.value = null;
                    } else location.reload();
                    document.getElementById("nueva").value = null;
                } else alert("Error al crear una publicación");
            }
        });
        xhrobj.send("texto="+encodeURIComponent(document.getElementById("nueva").value));
    });

    document.getElementById("btn_editar_perfil").addEventListener("click", (e) => {
        location.href = "#editarperfil";
    });
    document.getElementById("enviaredit").addEventListener("click", (e) => {
        let idu = localStorage.getItem('usuario');
        let xhrobj = new XMLHttpRequest();
        xhrobj.open("POST", window.dominio+"/usuario_editar/"+idu);
        xhrobj.withCredentials = true;
        xhrobj.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xhrobj.addEventListener("readystatechange", () => {
            if (xhrobj.readyState == 4){
                if (xhrobj.status == 204){
                    location.href = "#principal";
                    window.nomusuCamb = undefined;
                    window.correoCamb = undefined;
                    window.passCamb = undefined;
                    window.generoCamb = undefined;
                    window.generootroCamb = undefined;
                    window.bioCamb = undefined;
                    window.estadoCamb = undefined;
                } else alert("Error al editar el perfil");
            }
        });
        let params = "";
        if (window.nomusuCamb) params += "usuario="+encodeURIComponent(document.getElementById("editnomusu").value)+"&";
        if (window.correoCamb) params += "email="+encodeURIComponent(document.getElementById("editcorreo").value)+"&";
        if (window.passCamb) params += "contrasena="+encodeURIComponent(document.getElementById("editpass").value)+"&";
        let vGen = document.getElementById("editgenero").value;
        if (window.generoCamb){
            if (vGen == "masc") params += "genero=1&";
            else if (vGen == "fem") params += "genero=2&";
            else params += "genero=0&";
        }
        if (window.generootroCamb) params += "genero_otro="+encodeURIComponent(document.getElementById("editgenerootro").value)+"&";
        if (window.bioCamb) params += "biografia="+encodeURIComponent(document.getElementById("editbio").value)+"&";
        if (window.estadoCamb) params += "estado="+encodeURIComponent(document.getElementById("editestado").value)+"&";
        if (params.length) xhrobj.send(params.substring(0, params.length-1));
    });

    document.getElementById("nuevo_foto_p").addEventListener("change", (e) => {
        let idu = localStorage.getItem('usuario');
        const formData = new FormData();
        formData.append("archivo", e.target.files[0]);
        let xhrobj = new XMLHttpRequest();
        xhrobj.open("POST", window.dominio+"/usuario_subir/"+idu);
        xhrobj.withCredentials = true;
        xhrobj.addEventListener("readystatechange", () => {
            if (xhrobj.readyState == 4){
                if (xhrobj.status == 204){
                    location.href = "#principal";
                } else alert("Error al cambiar la foto de perfil");
            }
        });
        xhrobj.send(formData);
    });
    document.getElementById("editnomusu").addEventListener("change", (e) => { window.nomusuCamb = true; });
    document.getElementById("editcorreo").addEventListener("change", (e) => { window.correoCamb = true; });
    document.getElementById("editpass").addEventListener("change", (e) => { window.passCamb = true; });
    document.getElementById("editgenero").addEventListener("change", (e) => { window.generoCamb = true; });
    document.getElementById("editgenerootro").addEventListener("change", (e) => { window.generootroCamb = true; });
    document.getElementById("editbio").addEventListener("change", (e) => { window.bioCamb = true; });
    document.getElementById("editestado").addEventListener("change", (e) => { window.estadoCamb = true; });

    for (let i of document.getElementById("emoji-lista").children){
        i.addEventListener("click", reaccionar);
    }
});
