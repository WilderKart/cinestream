const apiDestacadas = "https://cinestream-backend.onrender.com/api/peliculas/recomendadas";

let cachePeliculasDestacadas = [];

// Obtener referencias a los elementos
const featuredMoviesContainer = document.getElementById("featured-movies");
const searchInput = document.getElementById("search-input");
const searchButton = document.getElementById("search-button");

// Función para crear una tarjeta de película destacada
function createMovieCard(movie) {
    const card = document.createElement("div");
    card.className = "movie-card fade-in";

    card.innerHTML = `
    <div class="movie-poster">
      <img src="${movie.poster_url || 'img/poster-placeholder.png'}" alt="${movie.titulo_espanol}">
      <div class="card-overlay">
        <button class="play-trailer" data-id="${movie.trailer_url}">
          <i class="fas fa-play"></i> Ver Tráiler
        </button>
        <button class="details-btn" data-id="${movie._id}">
          <i class="fas fa-info-circle"></i> Detalles
        </button>
      </div>
    </div>
    <div class="card-info">
      <h3>${movie.titulo_espanol}</h3>
      <div class="movie-meta">
        <span><i class="fas fa-calendar"></i> ${new Date(movie.fecha_estreno).getFullYear()}</span>
        <span class="rating"><i class="fas fa-star"></i> ${movie.calificacion}/10</span>
      </div>
      <div class="movie-meta">
        <span>${movie.generos.map(g => g.nombre).join(', ')}</span>
      </div>
    </div>
  `;
    return card;
}

// Función para obtener y mostrar las películas destacadas
async function loadFeaturedMovies() {
    const loader = document.getElementById("featured-loader");

    try {
        if (loader) loader.style.display = "flex";
        featuredMoviesContainer.style.display = "none";

        const response = await fetch(apiDestacadas);
        if (!response.ok) throw new Error("No se pudo obtener las películas destacadas");
        const movies = await response.json();

        cachePeliculasDestacadas = movies;

        mostrarPeliculas(movies);

        if (loader) loader.style.display = "none";
        featuredMoviesContainer.style.display = "grid";

    } catch (error) {
        if (loader) loader.style.display = "none";
        featuredMoviesContainer.style.display = "block";
        featuredMoviesContainer.innerHTML = "<p>Error al cargar las películas destacadas.</p>";
        console.error(error);
    }
}

// Función que imprime películas y asigna eventos
function mostrarPeliculas(lista) {
    featuredMoviesContainer.innerHTML = "";

    if (lista.length === 0) {
        featuredMoviesContainer.innerHTML = "<p>No se encontraron resultados.</p>";
        return;
    }

    lista.forEach((movie) => {
        featuredMoviesContainer.appendChild(createMovieCard(movie));
    });

    document.querySelectorAll(".play-trailer").forEach(button => {
        button.addEventListener("click", (e) => {
            const rawId =
                e.target.getAttribute("data-id") ||
                e.target.parentElement.getAttribute("data-id");
            const videoId = getYouTubeId(rawId);
            showTrailerModal(videoId);
        });
    });

    document.querySelectorAll(".details-btn").forEach(button => {
        button.addEventListener("click", (e) => {
            const movieId = e.currentTarget.getAttribute("data-id");
            showMovieDetails(movieId);
        });
    });
}

// Búsqueda de películas destacadas
function filtrarDestacadas() {
    const searchTerm = searchInput.value.trim().toLowerCase();

    const filtradas = cachePeliculasDestacadas.filter((pelicula) =>
        pelicula.titulo_espanol.toLowerCase().includes(searchTerm)
    );

    mostrarPeliculas(filtradas);
}

// Extrae el ID de YouTube desde una URL
function getYouTubeId(url) {
    const regExp = /(?:youtube\.com\/.*v=|youtu\.be\/)([^&?/]+)/;
    const match = url.match(regExp);
    return match ? match[1] : url;
}

// Muestra el modal del tráiler
function showTrailerModal(videoId) {
    const modal = document.getElementById("trailer-modal");
    const iframe = document.getElementById("modal-youtube-player");
    iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
    modal.style.display = "flex";
}

// Cierra el modal del tráiler
document.addEventListener("DOMContentLoaded", () => {
    loadFeaturedMovies();

    const modal = document.getElementById("trailer-modal");
    if (modal) {
        modal.addEventListener("click", (e) => {
            if (e.target === modal || e.target.classList.contains("close-trailer-modal")) {
                modal.style.display = "none";
                document.getElementById("modal-youtube-player").src = "";
            }
        });
    }

    // Eventos de búsqueda
    searchInput.addEventListener("input", filtrarDestacadas);
    searchButton.addEventListener("click", filtrarDestacadas);
    searchInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
            filtrarDestacadas();
        }
    });
});

// Muestra detalles (puedes personalizarla)
function showMovieDetails(movieId) {
    alert("Mostrar detalles de la película con ID: " + movieId);
}
