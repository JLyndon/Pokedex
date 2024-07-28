const limit = 10;
const searchBar = document.querySelector("#search-bar");
const searchBtn = document.querySelector(".search-btn");
const listWrap = document.querySelector(".list-wrapper");
const nameFilter = document.querySelector("#name");
const numberFilter = document.querySelector("#number");
const notFoundMessage = document.querySelector(".not-found");

let offset = 0;
let isLoading = false;
let searchQuery = "";
let isSearchMode = false;

fetchPokemons();

async function fetchPokemons() {
  try {
    isLoading = true;
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    let allPokemons = data.results;

    const detailedPokemons = await Promise.all(
      allPokemons.map(pokemon => fetch(pokemon.url).then(res => res.json()))
    );

    if (offset === 0) {
      listWrap.innerHTML = ""; // Clear the list only if it's a fresh fetch (not infinite scroll)
    }

    displayPokemons(allPokemons, detailedPokemons);
    isLoading = false;
  } catch (error) {
    console.log(error);
    console.error("Failed to fetch Pokémon data");
    isLoading = false;
  }
}

async function searchPokemon(query) {
  try {
    isLoading = true;
    const searchResults = [];

    // Fetch all Pokémon to filter based on the search query
    let offset = 0;
    let keepFetching = true;

    while (keepFetching) {
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();

      // Filter Pokémon based on the query
      const filteredPokemons = data.results.filter(pokemon => {
        const pokemonID = pokemon.url.split("/")[6];
        return pokemonID.includes(query) || pokemon.name.includes(query.toLowerCase());
      });

      searchResults.push(...filteredPokemons);

      if (data.next) {
        offset += limit;
      } else {
        keepFetching = false;
      }
    }

    const detailedPokemons = await Promise.all(
      searchResults.slice(0, limit).map(pokemon => fetch(pokemon.url).then(res => res.json()))
    );

    // Display the filtered Pokémon
    listWrap.innerHTML = "";
    displayPokemons(searchResults.slice(0, limit), detailedPokemons);
    searchResultsRemaining = searchResults.slice(limit);

    isLoading = false;
  } catch (error) {
    console.log(error);
    console.error("Failed to fetch Pokémon data");
    isLoading = false;
  }
}

function displayPokemons(pokemonList, details) {
  pokemonList.forEach((pokemon, index) => {
    let pokemonID, formatted_pkmn_ID;

    if (pokemon.url) {
      pokemonID = pokemon.url.split("/")[6];
    } else {
      // If `pokemon.url` is not available, use `pokemon.id`
      pokemonID = pokemon.id.toString();
    }

    formatted_pkmn_ID = pokemonID.padStart(3, '0');

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

    const typesWrap = document.createElement("div");
    typesWrap.className = "types-wrap";

    details[index].types.forEach(typeInfo => {
      const typeDiv = document.createElement("div");
      typeDiv.className = "type";
      typeDiv.textContent = typeInfo.type.name;
      typesWrap.appendChild(typeDiv);
    });

    listItem.appendChild(typesWrap);

    listWrap.appendChild(listItem);
  });
}

searchBtn.addEventListener("click", () => {
  const query = searchBar.value.trim();
  if (query) {
    searchQuery = query;
    offset = 0;
    isSearchMode = true;
    listWrap.innerHTML = "";
    searchPokemon(query);
  } else {
    isSearchMode = false;
    offset = 0;
    listWrap.innerHTML = "";
    fetchPokemons();
  }
});

// Infinite scroll event listener
window.addEventListener("scroll", () => {
  if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 150 && !isLoading) {
    if (isSearchMode) {
      if (searchResultsRemaining.length > 0) {
        const nextBatch = searchResultsRemaining.slice(0, limit);
        searchResultsRemaining = searchResultsRemaining.slice(limit);

        Promise.all(
          nextBatch.map(pokemon => fetch(pokemon.url).then(res => res.json()))
        ).then(detailedPokemons => {
          displayPokemons(nextBatch, detailedPokemons);
        });
      }
    } else {
      offset += limit;
      fetchPokemons();
    }
  }
});
