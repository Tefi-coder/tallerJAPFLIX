let peliculasArray = [];
const buscarInput = document.getElementById('inputBuscar');
const botonBuscar = document.getElementById('btnBuscar');
let offcanvasElement = null; 

// Cargar datos de las películas
document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch('https://japceibal.github.io/japflix_api/movies-data.json');
        peliculasArray = await response.json();
        console.log('Películas cargadas:', peliculasArray);
    } catch (error) {
        console.error('Error al cargar películas:', error);
    }
});

// Buscar películas y mostrarlas
botonBuscar.addEventListener('click', () => {
    let buscarTerm = buscarInput.value.toLowerCase();
    if (!buscarTerm) return;

    let resultados = peliculasArray.filter(peli => 
        peli.title.toLowerCase().includes(buscarTerm) || 
        peli.genres.some(genre => genre.name.toLowerCase().includes(buscarTerm)) ||
        peli.tagline.toLowerCase().includes(buscarTerm) || 
        peli.overview.toLowerCase().includes(buscarTerm)
    );
    mostrarPeliculas(resultados);  
});

// Mostrar lista
function mostrarPeliculas(resultados) {
    let lista = document.getElementById('lista');
    lista.innerHTML = ''; 

    resultados.forEach(peli => {
        let li = document.createElement('li');
        li.classList.add('list-group-item');

        let title = document.createElement('h5');
        title.textContent = peli.title;
        let tagline = document.createElement('p');
        tagline.textContent = peli.tagline;

        let rating = puntuacionEstrella(peli.vote_average);

        li.append(title, tagline, rating);
        li.addEventListener('click', () => mostrarDetallesPelicula(peli)); 

        lista.appendChild(li); 
    });
}

// Mostrar estrellas segun la calificacion
function puntuacionEstrella(voteAverage) {
    let estrellas = document.createElement('div');
    estrellas.className = 'star-rating';
    
    let estrellasCount = Math.round(voteAverage / 2);
    for (let i = 0; i < 5; i++) {
        let estrella = document.createElement('span');
        estrella.classList.add('fa', 'fa-star', i < estrellasCount ? 'checked' : 'unchecked');
        estrellas.appendChild(estrella);
    }
    
    return estrellas;
}

// Crear Offcanvas  y mostrar detalles de película
function crearOffcanvas() {
    offcanvasElement = document.createElement('div'); 
    offcanvasElement.className = 'offcanvas offcanvas-top';
    offcanvasElement.id = 'detallePeli';
    document.body.appendChild(offcanvasElement);
}

function mostrarDetallesPelicula(peli) {
    if (!offcanvasElement) crearOffcanvas();

    offcanvasElement.innerHTML = `
        <div class="offcanvas-header">
            <h5 class="offcanvas-title">${peli.title}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="offcanvas"></button>
        </div>
        <div class="offcanvas-body">
            <p>${peli.overview}</p>
            <p><strong>Géneros:</strong> ${peli.genres.map(genre => genre.name).join(', ')}</p>
            <button class="btn btn-outline-secondary" type="button" data-bs-toggle="dropdown">
                Más detalles
            </button>
            <ul class="dropdown-menu">
                <li>Año: ${peli.release_date.split('-')[0]}</li>
                <li>Duración: ${peli.runtime} minutos</li>
                <li>Presupuesto: $${peli.budget.toLocaleString()}</li>
                <li>Ingresos: $${peli.revenue.toLocaleString()}</li>
            </ul>
        </div>
    `;

    let detallePeli = new bootstrap.Offcanvas(offcanvasElement);
    detallePeli.show();
}
