// Datos de películas 
const moviesData = {
    featured: [
        {
            id: 1,
            title: "Duna",
            year: 2021,
            rating: 8.0,
            duration: "155 min",
            genre: "Ciencia Ficción, Aventura",
            director: "Denis Villeneuve",
            cast: "Timothée Chalamet, Rebecca Ferguson, Oscar Isaac",
            classification: "PG-13",
            description: "Un noble hereda el peligroso planeta desértico Arrakis, la única fuente de la sustancia más valiosa del universo.",
            poster: "../assets/images/1.jpg",
            trailer: "Wg86eQkdudI"
        },
        {
            id: 2,
            title: "Spider-Man: Sin Camino a Casa",
            year: 2021,
            rating: 8.2,
            duration: "148 min",
            genre: "Acción, Aventura",
            director: "Jon Watts",
            cast: "Tom Holland, Zendaya, Benedict Cumberbatch",
            classification: "PG-13",
            description: "Peter Parker busca la ayuda del Doctor Strange cuando su identidad secreta como Spider-Man es revelada.",
            poster: "../assets/images/2.jpg",
            trailer: "JfVOs4VSpmA"
        },
        {
            id: 3,
            title: "Top Gun: Maverick",
            year: 2022,
            rating: 8.4,
            duration: "130 min",
            genre: "Acción, Drama",
            director: "Joseph Kosinski",
            cast: "Tom Cruise, Jennifer Connelly, Miles Teller",
            classification: "PG-13",
            description: "Después de más de treinta años de servicio, Maverick es instructor de pilotos y debe enfrentar su pasado.",
            poster: "../assets/images/3.jpg",
            trailer: "qSqVVswa420"
        },
        {
            id: 4,
            title: "The Batman",
            year: 2022,
            rating: 7.9,
            duration: "176 min",
            genre: "Acción, Crimen, Drama",
            director: "Matt Reeves",
            cast: "Robert Pattinson, Zoë Kravitz, Jeffrey Wright",
            classification: "PG-13",
            description: "Batman investiga la corrupción en Gotham City mientras persigue al Enigma, un asesino en serie que se dirige a la élite de Gotham.",
            poster: "../assets/images/4.jpg",
            trailer: "mqqft2x_Aa4"
        }
    ],
    newReleases: [
        {
            id: 5,
            title: "Jurassic World: Dominion",
            year: 2022,
            rating: 5.7,
            duration: "147 min",
            genre: "Acción, Aventura",
            director: "Colin Trevorrow",
            cast: "Chris Pratt, Bryce Dallas Howard, Sam Neill",
            classification: "PG-13",
            description: "Cuatro años después de la destrucción de Isla Nublar, los dinosaurios ahora conviven con los humanos en todo el mundo.",
            poster: "../assets/images/5.jpg",
            trailer: "fb5ELWi-ekk"
        },
        {
            id: 6,
            title: "Doctor Strange en el Multiverso de la Locura",
            year: 2022,
            rating: 7.0,
            duration: "126 min",
            genre: "Acción, Aventura, Fantasía",
            director: "Sam Raimi",
            cast: "Benedict Cumberbatch, Elizabeth Olsen, Chiwetel Ejiofor",
            classification: "PG-13",
            description: "El Dr. Strange viaja a lo desconocido con la ayuda de aliados místicos y antiguos y nuevos para enfrentar a un nuevo adversario misterioso.",
            poster: "../assets/images/6.jpeg",
            trailer: "aWzlQ2N6qqg"
        },
        {
            id: 7,
            title: "Black Panther: Wakanda Forever",
            year: 2022,
            rating: 7.2,
            duration: "161 min",
            genre: "Acción, Aventura",
            director: "Ryan Coogler",
            cast: "Letitia Wright, Lupita Nyong'o, Danai Gurira",
            classification: "PG-13",
            description: "El pueblo de Wakanda lucha para proteger su nación de las potencias mundiales que intervienen después de la muerte del rey T'Challa.",
            poster: "../assets/images/7.jpg",
            trailer: "RlOB3UALvrQ"
        },
        {
            id: 8,
            title: "Avatar: El Camino del Agua",
            year: 2022,
            rating: 7.8,
            duration: "192 min",
            genre: "Acción, Aventura, Fantasía",
            director: "James Cameron",
            cast: "Sam Worthington, Zoe Saldana, Sigourney Weaver",
            classification: "PG-13",
            description: "Jake Sully vive con su nueva familia en el planeta Pandora. Cuando una amenaza familiar regresa, Jake debe trabajar con Neytiri para proteger su hogar.",
            poster: "../assets/images/8.jpg",
            trailer: "d9MyW72ELq0"
        }
    ]
};

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

// Cargar películas en las secciones
function loadMovies() {
    // Películas destacadas
    moviesData.featured.forEach(movie => {
        featuredMoviesContainer.appendChild(createMovieCard(movie));
    });

    // Nuevos lanzamientos
    moviesData.newReleases.forEach(movie => {
        newReleasesContainer.appendChild(createMovieCard(movie));
    });

    // Configurar eventos para los botones de tráiler
    document.querySelectorAll('.play-trailer').forEach(button => {
        button.addEventListener('click', (e) => {
            const videoId = e.target.getAttribute('data-id') || e.target.parentElement.getAttribute('data-id');
            youtubePlayer.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1`;
            
            // Desplazar hasta el reproductor
            document.querySelector('.player-section').scrollIntoView({
                behavior: 'smooth'
            });
        });
    });
}

// Crear tarjeta de película
function createMovieCard(movie) {
    const card = document.createElement('div');
    card.className = 'movie-card fade-in';
    card.innerHTML = `
        <div class="movie-poster">
            <img src="${movie.poster}" alt="${movie.title}">
            <div class="card-overlay">
                <button class="play-trailer" data-id="${movie.trailer}"><i class="fas fa-play"></i> Ver Tráiler</button>
                <button><i class="fas fa-info-circle"></i> Más información</button>
            </div>
        </div>
        <div class="card-info">
            <h3>${movie.title}</h3>
            <p>${movie.description}</p>
            <div class="movie-meta">
                <span>${movie.year}</span>
                <span>${movie.classification}</span>
                <span class="rating">${movie.rating}/10</span>
            </div>
        </div>
    `;
    return card;
}

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