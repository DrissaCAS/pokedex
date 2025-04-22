const pokemonList = document.getElementById('pokemonList')
const loadMoreButton = document.getElementById('loadMoreButton')
const modal = document.getElementById('pokeDetailModal')
const btnClose = document.getElementById('close')

const maxRecords = 151
const limit = 20
let offset = 0

function convertPokemonToLi(pokemon) {
    return `
        <li class="pokemon ${pokemon.type}">
            <span class="number">#0${pokemon.number}</span>
            <span class="name">${pokemon.name}</span>

            <div class="detail">
                <ol class="types">
                    ${pokemon.types.map((type) => `<li class="type ${type}">${type}</li>`).join('')}
                </ol>
                <img src="${pokemon.photo}" alt="${pokemon.name}">
            </div>
        </li>
    `
}

//Transforming API information into HTML
function loadPokemonItens(offset, limit) {
    loadMoreButton.textContent = 'Carregando...'
    loadMoreButton.disabled = true
    
    pokeApi.getPokemons(offset, limit).then((pokemons = []) => {
        const newHtml = pokemons.map(convertPokemonToLi).join('')

        pokemonList.innerHTML += newHtml

        loadMoreButton.textContent = 'Load More ▼'
        loadMoreButton.disabled = false
    })
}

//Loading new pokemons
loadPokemonItens(offset, limit)

loadMoreButton.addEventListener('click', () => {
    offset += limit

    const qtdRecordNextPage = offset + limit

    if (qtdRecordNextPage >= maxRecords) {
        const newLimit = maxRecords - offset
        loadPokemonItens(offset, newLimit)

        loadMoreButton.parentElement.removeChild(loadMoreButton)
    } else {
        loadPokemonItens(offset, limit)
    }

})

pokemonList.addEventListener('click', (event) => {
    const clickedPokemon = event.target.closest(".pokemon")

    if(clickedPokemon) {
        const pokemonId = clickedPokemon.getAttribute("data-id")

        pokeApi.detailsPokeToModal(pokemonId).then((detailsModal) => {
            const details = pokemonModal(detailsModal, pokemonId)
            modal.innerHTML = details
            modal.classList.remove("dNone")
            modal.classList.add("dGrid")
        })}
})

function pokemonModal(detailsModal, id) {
    return `
        <div id="pokeDetail">
        <div id="close"><i id="iconClose" class="bi bi-arrow-left-circle"></i></div>
        
        <div class="details ${detailsModal.type}">

            <img src="${detailsModal.photo}" alt="${detailsModal.name}">

            <p class="name"> #0${id} - ${detailsModal.name}</p>

            <ol id="typeModal">
                ${detailsModal.types.map((type) => `<li class="type ${type}"> ${type} </li>`).join("")}
            </ol>

        </div>

        <div id="characteristics">
            <div>
                <h3> ${detailsModal.height} M </h3>
                <p> Height </p>
            </div>
            
            <div>
                <h3> ${detailsModal.weight} KG </h3>
                <p> Weight </p>
            </div>
        </div>

        <div id="stats">
            <h2>Stats</h2>
            
            <div class="red">
                <h4>HP</h4>
                <p>${detailsModal.stats[0]}</p>
            </div>
            
            <div class="yellow">
                <h4>Attack</h4>
                <p>${detailsModal.stats[1]}</p>
            </div>
            
            <div class="blue">
                <h4>Defense</h4>
                <p>${detailsModal.stats[2]}</p>
            </div>
        </div>
        </div>
    `
}

modal.addEventListener('click', closeModal)

function closeModal(event) {
    if (event.target.id === "pokeDetailModal" || event.target.id === "close" || event.target.id === "iconClose") {
        modal.classList.add("dNone")
        modal.classList.remove("dGrid")
    }
}