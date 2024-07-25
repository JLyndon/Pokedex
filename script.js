const limit = 10;
const searchBar = document.querySelector("#search-bar");
const listWrap = document.querySelector(".list-wrapper");
const nameFilter = document.querySelector("#name");
const numberFilter = document.querySelector("#number");
const notFoundMessage = document.querySelector(".not-found");

let offset = 0;

async function fetchPokemon(offset, limit) {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`);
    const data = await response.json();
    return data.results;
}

function renderPokemon(pokemonList) {
    pokemonList.forEach(pokemon => {
        const pokemonElement = document.createElement('div');
        pokemonElement.textContent = pokemon.name;
        listWrap.appendChild(pokemonElement);
    });
}

async function loadPokemon() {
    const pokemonList = await fetchPokemon(offset, limit);
    renderPokemon(pokemonList);
    offset += limit;
}

loadPokemon();