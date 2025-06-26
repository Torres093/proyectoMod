//API 
const API_URL = "https://retoolapi.dev/RcO6RU/data"

//imagenBB
const IMG_API_URL = "https://api.imgbb.com/1/upload?key=8c59c3ffef056cf3b1c4115911576c33"

const form = document.getElementById('juegoForm'); 
const tituloEL = document.getElementById('titulo'); 
const precioEL = document.getElementById('precio');
const generoEL = document.getElementById('genero');
const idEL = document.getElementById('juego-id');
const imagenFileEl = document.getElementById('imagen-file'); 
const imagenUrlEl = document.getElementById('imagen-url');
const cancelBtn = document.getElementById('btn-cancel'); 
const submitBtn = document.getElementById('btn-submit'); 
const tbody = document.getElementById('juegos-tbody'); 

async function CargarJuegos() {
    const res = await fetch(API_URL); 
    const data = await res.json();
    CargarTabla(data); 
}

function CargarTabla(juegos){
    tbody.innerHTML=''; 
    juegos.forEach(juego => {
        tbody.innerHTML += `
        <tr>
            <td><img src="${juego.imagen}" alt="Foto de ${juego.titulo}"/></td>
            <td>${juego.titulo}</td>
            <td>${juego.precio}</td>
            <td>
            <button onclick="CargarParaEditar('${juego.id}')">Editar</button>
            <button onclick="BorrarJuego('${juego.id}')">Eliminar</button>
            </td>
        </tr>
        
        `;
    });
}

window.addEventListener('DOMContentLoaded', CargarJuegos);

async function BorrarJuego(id) {
    const confirmacion = confirm('¿Eliminar este juego?');

    if(confirmacion){
        await fetch (`${API_URL}/${id}`, { method: 'DELETE'})
            CargarJuegos();
            alert("El registro fue eliminado")
    }else{
        alert("Se cancelo la accion");
        return;
    }
}

async function CargarParaEditar(id) {
   const res = await fetch (`${API_URL}/${id}`);
   const p = await res.json(); 

   tituloEL.value = p.titulo
   generoEL.value = p.genero; 
   precioEL.value = p.precio; 
   imagenUrlEl.value = p.imagen; 
   imagenFileEl.value = ''; 
   idEL.value = p.id; 

   submitBtn.textContent = 'Actualizar'; 
   cancelBtn.hidden = false; 
}

cancelBtn.addEventListener('click', () => {
    form.reset(); 
    idEL.value = ''; 
    submitBtn.textContent = 'Agregar'; 
    cancelBtn.hidden = true; 
}); 

async function subirImagen(file) {
    const fd = new FormData(); 
    fd.append('image', file); 
    const res = await fetch(IMG_API_URL, {method: 'POST', body: fd}); 
    const obj = await res.json(); 
    return obj.data.url; 
}

form.addEventListener('submit', async (e) => {
    e.preventDefault(); 
    let imageUrl = imagenUrlEl.value; 

    if(imagenFileEl.isDefaultNamespace.length > 0) {
        imageUrl = await subirImagen(imagenFileEl.files[0]); 
    }
    const payload = {
        titulo : tituloEL.value, 
        genero : generoEL.value, 
        precio : precioEL.value, 
        imagen : imageUrl, 
    }; 

    if(idEL.value){
        await fetch (`${API_URL}/${idEL.value}`, {
            method: 'PUT', 
            headers: {'Content-Type': 'application/json'}, 
            body: JSON.stringify(payload)
        }); 
        alert("Registro Chamaqueado")
    }else{
        await fetch(API_URL, {
            method: 'POST', 
            headers: { 'Content-Type': 'application/json' }, 
            body: JSON.stringify(payload)
        })
    }
    form.reset(); 
    cancelBtn.hidden = true; 
    submitBtn.textContent = "Agregar"; 
    idEL.value = ""; 
    CargarJuegos(); 
});




