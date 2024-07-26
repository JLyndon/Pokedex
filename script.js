const limit = 10;
const searchBar = document.querySelector("#search-bar");
const listWrap = document.querySelector(".list-wrapper");
const nameFilter = document.querySelector("#name");
const numberFilter = document.querySelector("#number");
const notFoundMessage = document.querySelector(".not-found");

let offset = 0;
let isLoading = false;

fetchPokemons();

async function fetchPokemons() {
  try {
    isLoading = true;
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`);
    const data = await response.json();
    const allPokemons = data.results;
    displayPokemons(allPokemons);
    isLoading = false;
  } catch (error) {
    console.error("Failed to fetch Pokémon data");
    isLoading = false;
  }
}

async function fetchPokemonDataBeforeRedirect(id) {
  try {
    const [pokemon, pokemonSpecies] = await Promise.all([
      fetch(`https://pokeapi.co/api/v2/pokemon/${id}`).then((res) => res.json()),
      fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}`).then((res) => res.json()),
    ]);
    return true;
  } catch (error) {
    console.error("Failed to fetch Pokémon data");
  }
}

function displayPokemons(pokemon) {
  pokemon.forEach((pokemon) => {
    const pokemonID = pokemon.url.split("/")[6];
    const formatted_pkmn_ID = pokemonID.padStart(3, '0');
    const listItem = document.createElement("div");
    listItem.className = "list-item";
    listItem.innerHTML = `
      <div class="number-wrap">
        <p class="caption-fonts">#${formatted_pkmn_ID}</p>
      </div>
      <div class="img-wrap">
        <img src="https://assets.pokemon.com/assets/cms2/img/pokedex/full/${formatted_pkmn_ID}.png" alt="${pokemon.name}" />
      </div>
      <div class="name-wrap">
        <p class="body3-fonts">${pokemon.name}</p>
      </div>
    `;

    listItem.addEventListener("click", async () => {
      const success = await fetchPokemonDataBeforeRedirect(pokemonID);
      if (success) {
        window.location.href = `./detail.html?id=${pokemonID}`;
      }
    });

    listWrap.appendChild(listItem);
  });
}

// Infinite scroll event listener
window.addEventListener("scroll", () => {
  if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 100 && !isLoading) {
    offset += limit;
    fetchPokemons();
  }
});
