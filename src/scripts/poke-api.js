const pokeApi = {}

function convertPokeApiDetailToPokemon(pokeDetail) {
    const pokemon = new Pokemon()
    pokemon.number = pokeDetail.id
    pokemon.name = pokeDetail.name

    const types = pokeDetail.types.map((typeSlot) => typeSlot.type.name)
    const [type] = types
    
    pokemon.types = types
    pokemon.type = type

    pokemon.photo = pokeDetail.sprites.front_default

    return pokemon
}


pokeApi.getPokemonDetail = (pokemon) => {
    return fetch(pokemon.url)
        .then((response) => response.json())
        .then(convertPokeApiDetailToPokemon)
}


pokeApi.getPokemons = (offset = 0, limit = 5) => {
    const url = `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`
    
    return fetch(url)
        .then((response) => response.json())
        .then((jsonBody) => jsonBody.results)
        .then((pokemons) => pokemons.map(pokeApi.getPokemonDetail))
        .then((detailRequests) => Promise.all(detailRequests))
        .then((pokemonsDetails) => pokemonsDetails)
}

pokeApi.detailsPokeToModal = (id) => {
    const url = `https://pokeapi.co/api/v2/pokemon/${id}/`

    return fetch(url)
        .then((response) => response.json())
        .then(convertPokeApiDetailToModal)
}

/*pokeApi.detailsPokeToGenders = (genders) => {
    const url = `https://pokeapi.co/api/v2/gender/{id}/`

    return fetch(url)
        .then((response) => response.json())
        .then(convertPokeApiDetailToModal)
}*/

function convertPokeApiDetailToModal(pokeDetail){
    const pokemon = new Pokemon();

    pokemon.number = pokeDetail.id

    pokemon.name = pokeDetail.name

    const types = pokeDetail.types.map((typeSlot) => typeSlot.type.name)
    const [type] = types
    
    pokemon.types = types
    pokemon.type = type
    
    //pokemon.genders = genders
    
    pokemon.image = pokeDetail.sprites.other.home.front_default

    pokemon.height = pokeDetail.height / 10
    pokemon.weight = pokeDetail.weight / 10

    pokemon.abilities = pokeDetail.abilities.map((abilities) => abilities.ability.name)

    pokemon.stats = pokeDetail.stats.map((stat) => stat.base_stat)

    return pokemon 
}