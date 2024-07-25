const limit = 10;
const searchBar = document.querySelector("#search-bar");
const listWrap = document.querySelector(".list-wrapper");
const nameFilter = document.querySelector("#name");
const numberFilter = document.querySelector("#number");
const notFoundMessage = document.querySelector(".not-found");

let offset = 0;

// Function to fetch Pokémon data
async function fetchPokemon(offset, limit) {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`);
    const data = await response.json();
    return data.results;
}

// Function to render Pokémon
function renderPokemon(pokemonList) {
    pokemonList.forEach(pokemon => {
        const pokemonElement = document.createElement('div');
        pokemonElement.textContent = pokemon.name;
        listWrap.appendChild(pokemonElement);
    });
}

// Function to load initial Pokémon
async function loadPokemon() {
    const pokemonList = await fetchPokemon(offset, limit);
    renderPokemon(pokemonList);
    offset += limit;
}

// Event listener for infinite scroll
window.addEventListener('scroll', async () => {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
        const pokemonList = await fetchPokemon(offset, limit);
        renderPokemon(pokemonList);
        offset += limit;
    }
});

// Load initial Pokémon
loadPokemon();