const maxBatchNum = 10;
const searchBar = document.querySelector("#search-bar");
const listWrap = document.querySelector(".list-wrapper");
const nameFilter = document.querySelector("#name");
const numberFilter = document.querySelector("#number");
const notFoundMessage = document.querySelector(".not-found")

let pokemons = []