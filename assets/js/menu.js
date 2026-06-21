/* ======================================
MENU LATERAL - FARMACIAS BIENESTAR
====================================== */

const sidebar = document.getElementById("sidebar");
const fondo = document.getElementById("fondo");

/* ======================================
ABRIR MENU
====================================== */

function abrirMenu(){

if(sidebar){
    sidebar.classList.add("activo");
}

if(fondo){
    fondo.classList.add("activo");
}

}

/* ======================================
CERRAR MENU
====================================== */

function cerrarMenu(){

if(sidebar){
    sidebar.classList.remove("activo");
}

if(fondo){
    fondo.classList.remove("activo");
}

}

/* ======================================
CERRAR CON ESC
====================================== */

document.addEventListener("keydown",(e)=>{

if(e.key==="Escape"){

    cerrarMenu();

}

});

/* ======================================
CERRAR AL DAR CLICK EN EL FONDO
====================================== */

if(fondo){

fondo.addEventListener("click",()=>{

    cerrarMenu();

});

}

/* ======================================
CERRAR AL DAR CLICK EN UNA OPCION
====================================== */

document.querySelectorAll(".sidebar a").forEach(enlace=>{

enlace.addEventListener("click",()=>{

    cerrarMenu();

});

});

/* ======================================
RESALTAR PAGINA ACTUAL
====================================== */

document.addEventListener("DOMContentLoaded",()=>{

const paginaActual =
window.location.pathname.split("/").pop();

document
.querySelectorAll(".sidebar a")
.forEach(link=>{

    const href = link.getAttribute("href");

    if(href === paginaActual){

        link.style.background = "#ffffff";
        link.style.color = "#611232";
        link.style.fontWeight = "600";

    }

});

});

/* ======================================
MENU RESPONSIVE AUTOMATICO
====================================== */

window.addEventListener("resize",()=>{

if(window.innerWidth > 992){

    cerrarMenu();

}

});

/* ======================================
EFECTO SUAVE
====================================== */

document.addEventListener("DOMContentLoaded",()=>{

if(sidebar){

    sidebar.style.transition =
    "all .35s ease";

}

});
