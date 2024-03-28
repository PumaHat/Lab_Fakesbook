"use strict"

let urldom = new URL(document.location);
urldom.port = "8001";
window.dominio = urldom.origin;

function reaccionar(event){}

function crearComentario(event){}

function dibujarComentario(obj){
    let com = document.createElement("article");
    com.className = "comentario";
    let img = document.createElement("img");
    img.src = "#";
    let p = document.createElement("p");
    p.textContent = "#";
    let reacc = document.createElement("button");
    reacc.textContent = "";
}

function dibujarPublicacion(obj){
    let publi = document.createElement("article");
    publi.className = "publicacion";
    let header = document.createElement("header");
    let img = document.createElement("img");
    img.src = "#";
    img.className = "foto_pub";
    let input = document.createElement("input");
    input.setAttribute("type", "file");
    input.hidden = true;
    let h4 = document.createElement("h4");
    h4.textContent = "#";
    let time = (new Date()).toLocaleString();
    header.append(img, input, h4, time);
    let contenido = document.createElement("div");
    contenido.className = "pub_contenido";
    let contenidoElems = [];
    let contenidoP = document.createElement("p");
    //
    contenidoElems.append(contenidoP);
    //for (let i = 0; )
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
    //for (let i = 0; )
    // comentarios.append(...comentariosElems);
    publi.append(header, contenido, comentarios);
}

function rellenarTarjeta(){
    let idu = localStorage.getItem('usuario');
    let tarjeta = document.getElementById("perfil");
    let srcimg = window.dominio + "/usuario_descargar/" + idu + "?" + (new Date()).toISOString();
    document.getElementById("foto_p").src = srcimg;
    document.getElementById("edit_foto_p").src = srcimg;
    document.querySelector("#nueva_pub .foto_pub").src = srcimg;
    xhrobj = new XMLHttpRequest();
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
}

window.addEventListener("popstate", cambiarPagina);

document.addEventListener("DOMContentLoaded", _ => {
    window.xhrobj = null;
    let nomusu = localStorage.getItem("usuario");
    if (nomusu){
        rellenarTarjeta();
        history.pushState(null, null, "#principal");
    } else history.pushState(null, null, "#sesion");
    cambiarPagina();

    /* Eventos de botones */
    document.getElementById("inicio_sesion").addEventListener("click", (e) => {
        xhrobj = new XMLHttpRequest();
        xhrobj.open("POST", window.dominio+"/sesion_iniciar");
        xhrobj.withCredentials = true;
        xhrobj.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xhrobj.addEventListener("readystatechange", () => {
            if (xhrobj.readyState == 4){
                if (xhrobj.status == 201){
                    let obj = JSON.parse(xhrobj.response);
                    history.pushState(null, null, "#principal");
                    cambiarPagina();
                    localStorage.setItem("usuario", obj.id);
                    rellenarTarjeta();
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
        xhrobj = new XMLHttpRequest();
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

    document.getElementById("buscar-amigos").addEventListener("click", _ => {});

    document.getElementById("cerrar-sesion").addEventListener("click", (e) => {
        xhrobj = new XMLHttpRequest();
        xhrobj.open("POST", window.dominio+"/sesion_cerrar");
        xhrobj.withCredentials = true;
        xhrobj.addEventListener("readystatechange", () => {
            if (xhrobj.readyState == 4){
                if (xhrobj.status == 200){
                    vaciarTarjeta();
                    localStorage.removeItem("usuario");
                    location.href = "#sesion";
                } else alert("Error al cerrar sesión");
            }
        });
        xhrobj.send();
    });

    document.getElementById("btn_editar_perfil").addEventListener("click", (e) => {
        location.href = "#editarperfil";
    });
    document.getElementById("enviaredit").addEventListener("click", (e) => {
        let idu = localStorage.getItem('usuario');
        xhrobj = new XMLHttpRequest();
        xhrobj.open("POST", window.dominio+"/usuario_editar/"+idu);
        xhrobj.withCredentials = true;
        xhrobj.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xhrobj.addEventListener("readystatechange", () => {
            if (xhrobj.readyState == 4){
                if (xhrobj.status == 204){
                    rellenarTarjeta();
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
        xhrobj = new XMLHttpRequest();
        xhrobj.open("POST", window.dominio+"/usuario_subir/"+idu);
        xhrobj.withCredentials = true;
        xhrobj.addEventListener("readystatechange", () => {
            if (xhrobj.readyState == 4){
                if (xhrobj.status == 204){
                    rellenarTarjeta();
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
});
