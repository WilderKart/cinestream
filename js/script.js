
// Elementos del DOM
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
const searchButton = document.getElementById('search-button');
const searchInput = document.getElementById('search-input');
const youtubePlayer = document.getElementById('youtube-player');
const featuredMoviesContainer = document.getElementById('featured-movies');
const newReleasesContainer = document.getElementById('new-releases');

// Menú hamburguesa para móviles
hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
});



const getPeliculasDestacadas = async () => {
    try {
        const response = await fetch('http://localhost:3000/api/peliculas/recomendadas');
        if (!response.ok) {
            throw new Error(`Error en la petición: ${response.status} ${response.statusText}`)
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error al obtener películas destacadas:', error);
    };
};

const getPeliculasLanzamientos = async () => {
    try {
        const response = await fetch('http://localhost:3000/api/peliculas/lanzamientos');
        if (!response.ok) {
            throw new Error(`Error en la petición: ${response.status} ${response.statusText}`)
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error al obtener películas destacadas:', error);
    };
};

// Cargar películas en las secciones
async function loadMovies() {
    const peliDestacadas = await getPeliculasDestacadas();
    const peliLanzamientos = await getPeliculasLanzamientos();
    // Películas destacadas
    peliDestacadas.forEach(movie => {
        featuredMoviesContainer.appendChild(createMovieCard(movie));
    });

    // Nuevos lanzamientos
    peliLanzamientos.lanzamientos.forEach(movie => {
        newReleasesContainer.appendChild(createMovieCard(movie));
    });

    // Sacar ID del la URL del trailer para reproducirlo
    function getYouTubeId(url) {
        // Soporta URLs como https://www.youtube.com/watch?v=ID o https://youtu.be/ID
        const regExp = /(?:youtube\.com\/.*v=|youtu\.be\/)([^&?/]+)/;
        const match = url.match(regExp);
        return match ? match[1] : url; // Si no es URL, asume que ya es el ID
    }

    // Configurar eventos para los botones de tráiler
    document.querySelectorAll('.play-trailer').forEach(button => {
        debugger;
        button.addEventListener('click', (e) => {
            debugger;
            const rawId = e.target.getAttribute('data-id') || e.target.parentElement.getAttribute('data-id');
            const videoId = getYouTubeId(rawId);
            console.log(videoId);
            youtubePlayer.src = `https://www.youtube.com/embed/${videoId}?autoplay=1`;

            // Desplazar hasta el reproductor
            document.querySelector('.player-section').scrollIntoView({
                behavior: 'smooth'
            });
        });
    });
}

// Función para generar estrellas según la calificación (0-10)
function getStars(rating) {
    const starsTotal = 5;
    const filledStars = Math.round((rating / 10) * starsTotal);
    let starsHtml = '';
    for (let i = 1; i <= starsTotal; i++) {
        starsHtml += i <= filledStars
            ? '<i class="fas fa-star" style="color:gold"></i>'
            : '<i class="far fa-star" style="color:gold"></i>';
    }
    return starsHtml;
}

// Crear tarjeta de película
function createMovieCard(movie) {
    const card = document.createElement('div');
    card.className = 'movie-card fade-in';
    card.innerHTML = `
        <div class="movie-poster">
            <img src="${movie.poster_url}" alt="${movie.titulo_espanol}">
            <div class="card-overlay">
                <button class="play-trailer" data-id="${movie.trailer_url}"><i class="fas fa-play"></i> Ver Tráiler</button>
                <button class="more-info" data-movie='${JSON.stringify(movie).replace(/'/g, "&apos;")}'><i class="fas fa-info-circle"></i> Más información</button>
            </div>
        </div>
        <div class="card-info">
            <h3>${movie.titulo_espanol}</h3>
            <div class="movie-meta">
                <span class="rating">${getStars(movie.calificacion)} ${movie.calificacion}/10</span>
            </div>
        </div>
    `;
    return card;
}

// Mostrar modal con información detallada --------------
document.addEventListener('click', function (e) {
    if (e.target.closest('.more-info')) {
        const btn = e.target.closest('.more-info');
        const movie = JSON.parse(btn.getAttribute('data-movie').replace(/&apos;/g, "'"));
        showMovieModal(movie);
    }
    if (e.target.classList.contains('close-modal') || e.target.classList.contains('modal')) {
        closeMovieModal();
    }
});

function showMovieModal(movie) {
    const modal = document.getElementById('movie-modal');
    const details = document.getElementById('modal-details');
    details.innerHTML = `
        <img src="${movie.poster_url}" alt="${movie.titulo_espanol}">
        <h2>${movie.titulo_espanol}</h2>
        <div class="movie-meta">
            <span><i class="fas fa-calendar"></i> ${movie.fecha_estreno || ''}</span>
            <span><i class="fas fa-star"></i> ${movie.calificacion}/10</span>
            <span><i class="fas fa-film"></i> ${(movie.generos || []).map(g => g.nombre).join(', ')}</span>
        </div>
        <p>${movie.descripcion || 'Sinopsis no disponible.'}</p>
        <div class="movie-meta">
            <span><strong>Director:</strong> ${movie.director || 'Desconocido'}</span>
        </div>
        <div class="movie-meta">
            <span><strong>Reparto:</strong> ${(movie.reparto || []).join(', ')}</span>
        </div>
        <div class="movie-meta">
            <span><strong>Clasificación:</strong> ${movie.clasificacion || 'N/A'}</span>
        </div>
    `;
    modal.style.display = 'block';
};

function closeMovieModal() {
    document.getElementById('movie-modal').style.display = 'none';
}

// Cerrar modal con ESC
document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeMovieModal();
});

// Búsqueda de películas
searchButton.addEventListener('click', () => {
    const searchTerm = searchInput.value.trim().toLowerCase();
    if (searchTerm) {
        // En una implementación real, aquí se haría fetch a la API
        alert(`Búsqueda realizada: ${searchTerm}\nEsta funcionalidad se conectaría a una API real en producción.`);
    } else {
        alert('Por favor ingresa un término de búsqueda');
    }
});

// Permitir búsqueda con Enter
searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        searchButton.click();
    }
});

// Animación al hacer scroll
const observerOptions = {
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observar elementos que deben aparecer al hacer scroll
document.querySelectorAll('.movie-card').forEach(card => {
    observer.observe(card);
});

// Cargar películas cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', loadMovies);