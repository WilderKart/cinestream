// Elementos del DOM
const hamburger = document.querySelector(".hamburger");
const navLinks = document.querySelector(".nav-links");
const searchButton = document.getElementById("search-button");
const searchInput = document.getElementById("search-input");
const youtubePlayer = document.getElementById("youtube-player");
const featuredMoviesContainer = document.getElementById("featured-movies");
const newReleasesContainer = document.getElementById("new-releases");

// Reproductor principal
// Aquí se cargará dinámicamente la película aleatoria
const API_ALEATORIA =
  "https://cinestream-backend.onrender.com/api/peliculas/aleatoria";

document.addEventListener("DOMContentLoaded", async () => {
  try {
    const res = await fetch(API_ALEATORIA);
    const pelicula = await res.json();

    // Obtener ID de YouTube
    const trailerUrl = new URL(pelicula.trailer_url);
    const videoId = trailerUrl.searchParams.get("v");

    if (!videoId) {
      console.warn("No se pudo obtener el ID del video de YouTube");
      return;
    }

    // Convertir arrays a strings legibles
    const actores = pelicula.actores.map((a) => a.nombre).join(", ");
    const directores = pelicula.directores.map((d) => d.nombre).join(", ");
    const companias = pelicula.companias.map((c) => c.nombre).join(", ");
    const generos = pelicula.generos.map((g) => g.nombre).join(", ");
    const idiomas = pelicula.idiomas.map((i) => i.nombre).join(", ");

    // Contenedor donde se inyectará el HTML
    const contenedor = document.getElementById("pelicula-aleatoria-container");

    contenedor.innerHTML = `
      <div class="video-container">
        <iframe
          id="youtube-player"
          src="https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&rel=0&controls=1"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen>
        </iframe>
      </div>
      
      <div class="movie-info">
        <div>
          <h3>${pelicula.titulo_espanol}</h3>
          <div class="movie-meta">
            <span><i class="fas fa-calendar"></i> ${new Date(
              pelicula.fecha_estreno
            ).getFullYear()}</span>
            <span><i class="fas fa-clock"></i> ${
              pelicula.duracion_minutos
            } min</span>
            <span><i class="fas fa-star"></i> ${pelicula.calificacion}/10</span>
          </div>
          <p>${pelicula.sinopsis}</p>
        </div>
        
        <div class="movie-details">
          <h4>Detalles</h4>
          <div class="movie-meta"><strong>Género:</strong> ${generos}</div>
          <div class="movie-meta"><strong>Director:</strong> ${directores}</div>
          <div class="movie-meta"><strong>Reparto:</strong> ${actores}</div>
          <div class="movie-meta"><strong>Idiomas:</strong> ${idiomas}</div>
          <div class="movie-meta"><strong>Compañías:</strong> ${companias}</div>
          <div class="movie-meta"><strong>Clasificación:</strong> ${
            pelicula.clasificacion || "No especificada"
          }</div>
          <div class="movie-meta"><strong>País de estreno:</strong> ${
            pelicula.pais_estreno
          }</div>
        </div>
      </div>
    `;
  } catch (err) {
    console.error("Error al cargar película aleatoria:", err);
  }
});
// Menú hamburguesa para móviles
hamburger.addEventListener("click", () => {
  navLinks.classList.toggle("active");
});

const getPeliculasDestacadas = async () => {
  try {
    const response = await fetch(
      "https://cinestream-backend.onrender.com/api/peliculas/recomendadas"
    );
    if (!response.ok) {
      throw new Error(
        `Error en la petición: ${response.status} ${response.statusText}`
      );
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error al obtener películas destacadas:", error);
  }
};

const getPeliculasLanzamientos = async () => {
  try {
    const response = await fetch(
      "https://cinestream-backend.onrender.com/api/peliculas/lanzamientos"
    );
    if (!response.ok) {
      throw new Error(
        `Error en la petición: ${response.status} ${response.statusText}`
      );
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error al obtener películas destacadas:", error);
  }
};

// Cargar películas en las secciones
async function loadMovies() {
  const peliDestacadas = await getPeliculasDestacadas();
  const peliLanzamientos = await getPeliculasLanzamientos();
  // Películas destacadas
  peliDestacadas.forEach((movie) => {
    featuredMoviesContainer.appendChild(createMovieCard(movie));
  });

  // Nuevos lanzamientos
  peliLanzamientos.lanzamientos.forEach((movie) => {
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
  document.querySelectorAll(".play-trailer").forEach((button) => {
    button.addEventListener("click", (e) => {
      const rawId =
        e.target.getAttribute("data-id") ||
        e.target.parentElement.getAttribute("data-id");
      const videoId = getYouTubeId(rawId);

      // Mostrar modal de tráiler
      const modal = document.getElementById("trailer-modal");
      const iframe = document.getElementById("modal-youtube-player");
      iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
      modal.style.display = "flex";
    });
  });
}

// Función para generar estrellas según la calificación (0-10)
function getStars(rating) {
  const starsTotal = 5;
  const filledStars = Math.round((rating / 10) * starsTotal);
  let starsHtml = "";
  for (let i = 1; i <= starsTotal; i++) {
    starsHtml +=
      i <= filledStars
        ? '<i class="fas fa-star" style="color:gold"></i>'
        : '<i class="far fa-star" style="color:gold"></i>';
  }
  return starsHtml;
}

// Crear tarjeta de película
function createMovieCard(movie) {
  const card = document.createElement("div");
  card.className = "movie-card fade-in";
  card.innerHTML = `
        <div class="movie-poster">
            <img src="${movie.poster_url}" alt="${movie.titulo_espanol}">
            <div class="card-overlay">
                <button class="play-trailer" data-id="${
                  movie.trailer_url
                }"><i class="fas fa-play"></i> Ver Tráiler</button>
                <button class="more-info" data-movie='${JSON.stringify(
                  movie
                ).replace(
                  /'/g,
                  "&apos;"
                )}'><i class="fas fa-info-circle"></i> Más información</button>
            </div>
        </div>
        <div class="card-info">
            <h3>${movie.titulo_espanol}</h3>
            <div class="movie-meta">
                <span class="rating">${getStars(movie.calificacion)} ${
    movie.calificacion
  }/10</span>
            </div>
        </div>
    `;
  return card;
}

// Mostrar modal con información detallada --------------
document.addEventListener("click", function (e) {
  if (e.target.closest(".more-info")) {
    const btn = e.target.closest(".more-info");
    const movie = JSON.parse(
      btn.getAttribute("data-movie").replace(/&apos;/g, "'")
    );
    showMovieModal(movie);
  }
  if (
    e.target.classList.contains("close-modal") ||
    e.target.classList.contains("modal")
  ) {
    closeMovieModal();
  }
});

function showMovieModal(movie) {
  const modal = document.getElementById("movie-modal");
  const details = document.getElementById("modal-details");

  const actores = movie.actores.map((a) => a.nombre).join(", ");
  const directores = movie.directores.map((d) => d.nombre).join(", ");
  const companias = movie.companias.map((c) => c.nombre).join(", ");
  const generos = movie.generos.map((g) => g.nombre).join(", ");
  const idiomas = movie.idiomas.map((i) => i.nombre).join(", ");

  details.innerHTML = `
        <img src="${movie.poster_url}" alt="${movie.titulo_espanol}">
        <h2>${movie.titulo_espanol}</h2>
        <div class="movie-meta">
            <span><i class="fas fa-calendar"></i> ${
              formatFecha(movie.fecha_estreno) || ""
            }</span>
            <span><i class="fas fa-star"></i> ${movie.calificacion}/10</span>
            <span><i class="fas fa-film"></i> ${(movie.generos || [])
              .map((g) => g.nombre)
              .join(", ")}</span>
        </div>
        <p>${movie.descripcion || "Sinopsis:"}  ${movie.sinopsis}</p>
        <div class="movie-meta">
            <span><strong>Director:</strong> ${
              directores || "Desconocido"
            }</span>
        </div>
        <div class="movie-meta">
            <span><strong>Reparto:</strong> ${actores || "Desconocido"}</span>
        </div>
          <div class="movie-meta">
            <span><strong>Compañias:</strong> ${
              companias || "Desconocido"
            }</span>
        </div>
         <div class="movie-meta">
            <span><strong>Generos::</strong> ${generos || "Desconocido"}</span>
        </div>
         <div class="movie-meta">
            <span><strong>Idiomas:</strong> ${idiomas || "Desconocido"}</span>
        </div> `;
  modal.style.display = "block";
}

function closeMovieModal() {
  document.getElementById("movie-modal").style.display = "none";
}

// Cerrar modal con ESC
document.addEventListener("keydown", function (e) {
  if (e.key === "Escape") closeMovieModal();
});

// Búsqueda de películas
searchButton.addEventListener("click", () => {
  const searchTerm = searchInput.value.trim().toLowerCase();
  if (searchTerm) {
    // En una implementación real, aquí se haría fetch a la API
    alert(
      `Búsqueda realizada: ${searchTerm}\nEsta funcionalidad se conectaría a una API real en producción.`
    );
  } else {
    alert("Por favor ingresa un término de búsqueda");
  }
});

// Permitir búsqueda con Enter
searchInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    searchButton.click();
  }
});

// Animación al hacer scroll
const observerOptions = {
  threshold: 0.1,
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("fade-in");
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

// Observar elementos que deben aparecer al hacer scroll
document.querySelectorAll(".movie-card").forEach((card) => {
  observer.observe(card);
});

function formatFecha(fecha) {
  if (!fecha) return "";
  const date = new Date(fecha);
  const dia = String(date.getDate()).padStart(2, "0");
  const mes = String(date.getMonth() + 1).padStart(2, "0"); // Mes es 0-based
  const anio = date.getFullYear();
  return `${dia}/${mes}/${anio}`;
}

// Cargar películas cuando el DOM esté listo
document.addEventListener("DOMContentLoaded", loadMovies);

// Cerrar modal de tráiler al hacer clic en la "X" o fuera del contenido
document.getElementById('trailer-modal').addEventListener('click', (e) => {
  const modal = document.getElementById('trailer-modal');
  const iframe = document.getElementById('modal-youtube-player');

  // Si clic fuera del contenido o en la "X"
  if (e.target.id === 'trailer-modal' || e.target.classList.contains('close-trailer-modal')) {
    iframe.src = ''; // Detener video
    modal.style.display = 'none';
  }
});
