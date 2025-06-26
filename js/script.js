console.log("Hola Mundo");
const API_URL = "https://retoolapi.dev/RcO6RU/data";
const container = document.getElementById('cards-container');

async function CargarJuegos() {
    try {
        const res = await fetch(API_URL); 
        const data = await res.json(); 
        CargarTarjetas(data); 
    } catch (err) {
        console.error('Error al cargar los datos', err);
        container.innerHTML = '<p>Error al cargar los juegos</p>'; 
    }
}

function CargarTarjetas(juegos) {
    container.innerHTML = '';
    if (juegos.length === 0) {
        container.innerHTML = "<p>No hay juegos registrados</p>";
        return; 
    }
    juegos.forEach(juego => {
        container.innerHTML += `
        <article style="background-color: #121212; color: white;">
        <img src="${juego.imagen }" alt="${juego.titulo}" style="width: 25%; border-radius: 0.5rem;">
        <h3>${juego.titulo}</h3>
        <p><strong>${juego.precio}</strong></p>
        <p>Género: ${juego.genero}</p>
        <button class="contrast">Agregar al carrito</button>
        </article>
        `;
    });
}

window.addEventListener('DOMContentLoaded', CargarJuegos);




