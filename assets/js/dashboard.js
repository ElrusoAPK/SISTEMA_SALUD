/* =====================================
DASHBOARD FARMACIAS BIENESTAR
ADAPTADO A TU CSV REAL
===================================== */

let datos = [];

document.addEventListener("DOMContentLoaded", () => {


mostrarFecha();
cargarCSV();


});

function mostrarFecha(){


const fecha = new Date();

document.getElementById("fechaActual").textContent =
fecha.toLocaleDateString("es-MX",{
    year:"numeric",
    month:"long",
    day:"numeric"
});


}

function cargarCSV(){


Papa.parse(
    "data/FORMATO FARMACIAS BIENESTAR VALLE DE CHALCO(2).csv",
    {

        download:true,
        header:true,
        delimiter:";",
        skipEmptyLines:true,

        transformHeader:(header)=>{

            return header
            .trim()
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g,"");

        },

        complete:(resultado)=>{

            datos = resultado.data;

            procesarDashboard();

        }

    }

);


}

function procesarDashboard(){

const totalRegistros = datos.length;

const pacientes = [
    ...new Set(
        datos.map(item =>
            (
                (item["(9) apellido paterno del derechohabiente"] || "") +
                " " +
                (item["(9) apellido materno del derechohabiente"] || "") +
                " " +
                (item["(9) nombre del derechohabiente"] || "")
            ).trim()
        )
    )
];

const totalPacientes = pacientes.length;

const medicamentosUnicos = [
    ...new Set(
        datos.map(
            item => item["(16) denominacion generica"] || "Sin dato"
        )
    )
];

const totalMedicamentos = medicamentosUnicos.length;

const localidadesUnicas = [
    ...new Set(
        datos.map(
            item => item["(5) localidad"] || "Sin dato"
        )
    )
];

const totalLocalidades = localidadesUnicas.length;

document.getElementById("totalRegistros").textContent =
totalRegistros;

document.getElementById("totalPacientes").textContent =
totalPacientes;

document.getElementById("totalMedicamentos").textContent =
totalMedicamentos;

document.getElementById("totalLocalidades").textContent =
totalLocalidades;

const conteoMedicamentos = {};

datos.forEach(item=>{

    const medicamento =
    item["(16) denominacion generica"] ||
    "Sin dato";

    conteoMedicamentos[medicamento] =
    (conteoMedicamentos[medicamento] || 0) + 1;

});

const conteoLocalidades = {};

datos.forEach(item=>{

    const localidad =
    item["(5) localidad"] ||
    "Sin dato";

    conteoLocalidades[localidad] =
    (conteoLocalidades[localidad] || 0) + 1;

});

let topMedicamento = "";
let totalSolicitudes = 0;

Object.entries(conteoMedicamentos)
.forEach(([med,total])=>{

    if(total > totalSolicitudes){

        topMedicamento = med;
        totalSolicitudes = total;

    }

});

document.getElementById("topMedicamento").textContent =
topMedicamento;

document.getElementById("totalSolicitudes").textContent =
totalSolicitudes;

let zonaMayor = "";
let maxZona = 0;

Object.entries(conteoLocalidades)
.forEach(([loc,total])=>{

    if(total > maxZona){

        zonaMayor = loc;
        maxZona = total;

    }

});

document.getElementById("zonaMayorDemanda").textContent =
zonaMayor;

const medicamentosEscasos =
Object.values(conteoMedicamentos)
.filter(x=>x < 20)
.length;

const medicamentosCriticos =
Object.values(conteoMedicamentos)
.filter(x=>x < 10)
.length;

document.getElementById("medicamentosEscasos").textContent =
medicamentosEscasos;

document.getElementById("medicamentosCriticos").textContent =
medicamentosCriticos;

let indiceAbastecimiento = 100;

if(totalMedicamentos > 0){

    indiceAbastecimiento = Math.round(
        (
            (totalMedicamentos - medicamentosEscasos)/
            totalMedicamentos
        ) * 100
    );

}

document.getElementById("indiceAbastecimiento").textContent =
indiceAbastecimiento + "%";

let nivel = "BAJO";
let clase = "badge bg-success";

if(indiceAbastecimiento < 90){

    nivel = "MEDIO";
    clase = "badge bg-warning";

}

if(indiceAbastecimiento < 70){

    nivel = "ALTO";
    clase = "badge bg-danger";

}

const badge =
document.getElementById("nivelRiesgo");

badge.textContent = nivel;
badge.className = clase;

document.getElementById("listaHallazgos").innerHTML = `
    <li class="list-group-item">
        Registros analizados:
        <strong>${totalRegistros}</strong>
    </li>

    <li class="list-group-item">
        Medicamento más solicitado:
        <strong>${topMedicamento}</strong>
    </li>

    <li class="list-group-item">
        Zona de mayor demanda:
        <strong>${zonaMayor}</strong>
    </li>

    <li class="list-group-item">
        Índice de abastecimiento:
        <strong>${indiceAbastecimiento}%</strong>
    </li>

    <li class="list-group-item">
        Nivel de riesgo:
        <strong>${nivel}</strong>
    </li>
`;

window.dashboardData = {

    datos,
    conteoMedicamentos,
    conteoLocalidades,
    indiceAbastecimiento

};

}
