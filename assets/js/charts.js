/* =====================================
   CHARTS.JS AVANZADO
   FARMACIAS BIENESTAR
===================================== */

let chartDiario;
let chartMensual;
let chartMedicamentos;
let chartLocalidades;
let chartAbasto;

/* =====================================
   ESPERAR DATOS
===================================== */

const espera = setInterval(() => {

    if(window.dashboardData){

        clearInterval(espera);

        generarGraficas();

    }

},500);

/* =====================================
   GENERAR TODO
===================================== */

function generarGraficas(){

    graficaDiaria();

    graficaMensual();

    graficaMedicamentos();

    graficaLocalidades();

    graficaAbasto();

}

/* =====================================
   FECHA SEGURA
===================================== */

function convertirFecha(fechaTexto){

    if(!fechaTexto) return null;

    try{

        const partes = fechaTexto.split("/");

        if(partes.length === 3){

            const dia = partes[0];
            const mes = partes[1];
            const anio = partes[2];

            return new Date(
                anio,
                mes - 1,
                dia
            );

        }

        return new Date(fechaTexto);

    }
    catch{

        return null;

    }

}

/* =====================================
   TENDENCIA DIARIA
===================================== */

function graficaDiaria(){

    const conteo = {};

    window.dashboardData.datos.forEach(item=>{

        const fecha =
        item["(15) fecha de entrega del medicamento"];

        if(!fecha) return;

        conteo[fecha] =
        (conteo[fecha] || 0) + 1;

    });

    const fechas =
    Object.keys(conteo)
    .sort((a,b)=>{

        return convertirFecha(a)-
        convertirFecha(b);

    })
    .slice(-30);

    const valores =
    fechas.map(f=>conteo[f]);

    chartDiario =
    new Chart(

        document.getElementById(
            "grafDiario"
        ),

        {

            type:"line",

            data:{

                labels:fechas,

                datasets:[{

                    label:"Medicamentos surtidos",

                    data:valores,

                    tension:.3,

                    fill:true,

                    borderWidth:3

                }]

            },

            options:{

                responsive:true,

                plugins:{

                    legend:{
                        display:true
                    }

                }

            }

        }

    );

}

/* =====================================
   TENDENCIA MENSUAL
===================================== */

function graficaMensual(){

    const conteo = {};

    window.dashboardData.datos.forEach(item=>{

        const fechaTexto =
        item["(15) fecha de entrega del medicamento"];

        const fecha =
        convertirFecha(fechaTexto);

        if(!fecha) return;

        const clave =

        fecha.getFullYear()
        + "-"
        +
        String(
            fecha.getMonth()+1
        ).padStart(2,"0");

        conteo[clave] =
        (conteo[clave] || 0)+1;

    });

    const meses =
    Object.keys(conteo).sort();

    const valores =
    meses.map(m=>conteo[m]);

    chartMensual =
    new Chart(

        document.getElementById(
            "grafMensual"
        ),

        {

            type:"bar",

            data:{

                labels:meses,

                datasets:[{

                    label:"Surtimiento mensual",

                    data:valores

                }]

            },

            options:{

                responsive:true

            }

        }

    );

}

/* =====================================
   TOP MEDICAMENTOS
===================================== */

function graficaMedicamentos(){

    const datos =

    Object.entries(
        window.dashboardData
        .conteoMedicamentos
    )

    .sort((a,b)=>b[1]-a[1])

    .slice(0,10);

    chartMedicamentos =
    new Chart(

        document.getElementById(
            "grafMedicamentos"
        ),

        {

            type:"bar",

            data:{

                labels:
                datos.map(x=>x[0]),

                datasets:[{

                    label:"Solicitudes",

                    data:
                    datos.map(x=>x[1])

                }]

            },

            options:{

                indexAxis:"y",

                responsive:true

            }

        }

    );

}

/* =====================================
   TOP LOCALIDADES
===================================== */

function graficaLocalidades(){

    const datos =

    Object.entries(
        window.dashboardData
        .conteoLocalidades
    )

    .sort((a,b)=>b[1]-a[1])

    .slice(0,10);

    chartLocalidades =
    new Chart(

        document.getElementById(
            "grafLocalidades"
        ),

        {

            type:"bar",

            data:{

                labels:
                datos.map(x=>x[0]),

                datasets:[{

                    label:"Demandas",

                    data:
                    datos.map(x=>x[1])

                }]

            },

            options:{

                indexAxis:"y",

                responsive:true

            }

        }

    );

}

/* =====================================
   ABASTECIMIENTO
===================================== */

function graficaAbasto(){

    const indice =
    window.dashboardData
    .indiceAbastecimiento;

    chartAbasto =
    new Chart(

        document.getElementById(
            "grafAbasto"
        ),

        {

            type:"doughnut",

            data:{

                labels:[

                    "Abastecido",
                    "Escasez"

                ],

                datasets:[{

                    data:[

                        indice,
                        100 - indice

                    ]

                }]

            },

            options:{

                responsive:true,

                cutout:"70%"

            }

        }

    );

}