const URL = "http://localhost:3000/paises";

let datos = [];
let pagina = 0;
let ordenActual = "";
let ascendente = true;

async function cargarPaises(){

try{

const res = await fetch(URL);

const data = await res.json();

if(!res.ok){

mostrarMensaje(data.error || "Error al obtener países","error");
return;

}

datos = data;

pagina = 0;

mostrar();

mostrarMensaje("Datos cargados correctamente","ok");

}catch(error){

mostrarMensaje("Error de conexión con el servidor","error");

}

}

function mostrar(){

const limite = parseInt(document.getElementById("limite").value);

const inicio = pagina * limite;

const fin = inicio + limite;

const bloque = datos.slice(inicio, fin);

const tbody = document.querySelector("#tabla tbody");

tbody.innerHTML = "";

bloque.forEach(pais => {

const fila = `
<tr>
<td>${pais.nombre}</td>
<td>${pais.continente}</td>
<td>${pais.poblacion}</td>
<td>${pais.pib_2019}</td>
<td>${pais.pib_2020}</td>
</tr>
`;

tbody.innerHTML += fila;

});

}

function siguiente(){

const limite = parseInt(document.getElementById("limite").value);

if((pagina+1)*limite >= datos.length){

mostrarMensaje("No hay más registros","error");

return;

}

pagina++;

mostrar();

}


function anterior(){

if(pagina === 0){

mostrarMensaje("Ya estás en la primera página","error");

return;

}

pagina--;

mostrar();

}

function ordenar(columna){

if(ordenActual === columna){

ascendente = !ascendente;

}else{

ordenActual = columna;

ascendente = true;

}

datos.sort((a,b)=>{

if(a[columna] < b[columna]) return ascendente ? -1 : 1;
if(a[columna] > b[columna]) return ascendente ? 1 : -1;
return 0;

});

pagina = 0;

mostrar();

}

async function agregarPais(){

const nombre = document.getElementById("nombre").value;
const continente = document.getElementById("continente").value;
const poblacion = document.getElementById("poblacion").value;
const pib_2019 = document.getElementById("pib2019").value;
const pib_2020 = document.getElementById("pib2020").value;

try{

const res = await fetch(URL,{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify({
nombre,
continente,
poblacion,
pib_2019,
pib_2020
})
});

const data = await res.json();

if(!res.ok){

mostrarMensaje(data.error || "Error al agregar país","error");

}else{

mostrarMensaje(data.mensaje || "País agregado correctamente","ok");

cargarPaises();

limpiarFormulario();

}

}catch(error){

mostrarMensaje("Error de conexión con el servidor","error");

}

}


async function eliminarPais(){

const nombre = document.getElementById("nombreEliminar").value;

if(!confirm(`¿Seguro que quieres eliminar ${nombre}?`)){

return;

}

try{

const res = await fetch(`${URL}/${nombre}`,{
method:"DELETE"
});

const data = await res.json();

if(!res.ok){

mostrarMensaje(data.error || "Error al eliminar país","error");

}else{

mostrarMensaje(data.mensaje || "País eliminado correctamente","ok");

cargarPaises();

document.getElementById("nombreEliminar").value="";

}

}catch(error){

mostrarMensaje("Error de conexión con el servidor","error");

}

}

function mostrarMensaje(texto, tipo="ok"){

const div = document.getElementById("mensaje");

div.innerText = texto;

div.className = "";

if(tipo === "ok"){
div.classList.add("mensaje-ok");
}else{
div.classList.add("mensaje-error");
}

}

function limpiarFormulario(){

document.getElementById("nombre").value="";
document.getElementById("continente").value="";
document.getElementById("poblacion").value="";
document.getElementById("pib2019").value="";
document.getElementById("pib2020").value="";

}