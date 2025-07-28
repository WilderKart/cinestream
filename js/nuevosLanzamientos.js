const API_LANZAMIENTOS = "http://localhost:3000/api/peliculas/lanzamientos";

document.addEventListener("DOMContentLoaded", async () => {
  try {
    const res = await fetch(API_LANZAMIENTOS);
    if (!res.ok) throw new Error("Error en la respuesta de la API");

    const data = await res.json();
    console.log("Respuesta de lanzamientos:", data);

    // Extraer el arreglo de películas correctamente desde `data.lanzamientos`
    const lanzamientos = Array.isArray(data.lanzamientos) ? data.lanzamientos : [];

    if (!lanzamientos.length) {
      console.warn("No se encontraron películas de lanzamiento.");
      return;
    }

    const grid = document.getElementById("new-releases");
    if (!grid) {
      console.warn("No se encontró el contenedor #new-releases");
      return;
    }

    lanzamientos.forEach((movie) => {
      const card = document.createElement("div");
      card.classList.add("movie-card");

      const year = new Date(movie.fecha_estreno).getFullYear();
      const sinopsisCorta =
        movie.sinopsis.length > 100
          ? movie.sinopsis.slice(0, 100) + "..."
          : movie.sinopsis;

      card.innerHTML = `
        <div class="movie-poster">
          <img src="${movie.poster_url}" alt="${movie.titulo_espanol}">
          <div class="card-overlay">
            <button class="play-trailer" data-id="${movie.trailer_url}">
              <i class="fas fa-play"></i> Ver Tráiler
            </button>
            <button class="more-info" data-id="${movie.id}">
              <i class="fas fa-info-circle"></i> Más información
            </button>
          </div>
        </div>
        <div class="card-info">
          <h3>${movie.titulo_espanol}</h3>
          <div class="movie-meta">
            <span>${year}</span>
            <span>${movie.clasificacion || "N/A"}</span>
            <span class="rating">${movie.calificacion}/10</span>
          </div>
        </div>
      `;

      grid.appendChild(card);
    });
  } catch (error) {
    console.error("Error al cargar nuevos lanzamientos:", error.message);
  }
});

// Cargar películas cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', loadMovies);