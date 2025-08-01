const apiLanzamientos = "https://cinestream-backend.onrender.com/api/peliculas/lanzamientos";

let cacheNuevosLanzamientos = [];

const featuredMoviesContainer = document.getElementById("featured-movies");
const searchInput = document.getElementById("search-input");
const searchButton = document.getElementById("search-button");

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

function mostrarPeliculas(lista) {
  featuredMoviesContainer.innerHTML = "";

  if (lista.length === 0) {
    featuredMoviesContainer.innerHTML = "<p>No se encontraron resultados.</p>";
    return;
  }

  lista.forEach(movie => {
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

async function loadFeaturedMovies() {
  const loader = document.getElementById("featured-loader");

  try {
    if (loader) loader.style.display = "flex";
    featuredMoviesContainer.style.display = "none";

    const cached = localStorage.getItem("lanzamientosCache");
    const cachedTime = localStorage.getItem("lanzamientosCacheTime");
    const now = Date.now();

    if (cached && cachedTime && (now - cachedTime) < 5 * 60 * 1000) {
      // Usar caché si tiene menos de 5 minutos
      cacheNuevosLanzamientos = JSON.parse(cached);
      mostrarPeliculas(cacheNuevosLanzamientos);
    } else {
      // Obtener desde la API
      const response = await fetch(apiLanzamientos);
      if (!response.ok) throw new Error("No se pudo obtener los lanzamientos");
      const data = await response.json();

      cacheNuevosLanzamientos = data.lanzamientos;

      // Guardar en localStorage
      localStorage.setItem("lanzamientosCache", JSON.stringify(cacheNuevosLanzamientos));
      localStorage.setItem("lanzamientosCacheTime", now.toString());

      mostrarPeliculas(cacheNuevosLanzamientos);
    }

    if (loader) loader.style.display = "none";
    featuredMoviesContainer.style.display = "grid";

  } catch (error) {
    if (loader) loader.style.display = "none";
    featuredMoviesContainer.style.display = "block";
    featuredMoviesContainer.innerHTML = "<p>Error al cargar las películas.</p>";
    console.error("Error al cargar los lanzamientos:", error);
  }
}


function filtrarLanzamientos() {
  const searchTerm = searchInput.value.trim().toLowerCase();

  if (!searchTerm) {
    mostrarPeliculas(cacheNuevosLanzamientos);
    return;
  }

  const filtradas = cacheNuevosLanzamientos.filter(pelicula => {
    const titulo = pelicula.titulo_espanol.toLowerCase();
    const generos = pelicula.generos.map(g => g.nombre.toLowerCase()).join(", ");
    const anio = new Date(pelicula.fecha_estreno).getFullYear().toString();

    return (
      titulo.includes(searchTerm) ||
      generos.includes(searchTerm) ||
      anio.includes(searchTerm)
    );
  });

  mostrarPeliculas(filtradas);
}

function getYouTubeId(url) {
  const regExp = /(?:youtube\.com\/.*v=|youtu\.be\/)([^&?/]+)/;
  const match = url.match(regExp);
  return match ? match[1] : url;
}

function showTrailerModal(videoId) {
  const modal = document.getElementById("trailer-modal");
  const iframe = document.getElementById("modal-youtube-player");
  iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
  modal.style.display = "flex";
}

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

  if (searchInput && searchButton) {
    searchInput.addEventListener("input", filtrarLanzamientos);
    searchButton.addEventListener("click", filtrarLanzamientos);
    searchInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        filtrarLanzamientos();
      }
    });
  }
});

function showMovieDetails(movieId) {
  alert("Mostrar detalles de la película con ID: " + movieId);
}
