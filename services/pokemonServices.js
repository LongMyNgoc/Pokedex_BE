import axios from 'axios';

// Hàm để fetch dữ liệu từ PokeAPI theo từng lô nhỏ
export const fetchPokemonDataByBatch = async (offset, limit) => {
    try {
        const response = await axios.get(`https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`);
        const detailedPokemon = await Promise.all(
            response.data.results.map(async (pokemon, index) => {
                const pokemonData = await axios.get(pokemon.url);
                return {
                    name: pokemonData.data.name,
                    sprite: pokemonData.data.sprites.front_default,
                    types: pokemonData.data.types.map(type => type.type.name),
                    generation: 'Gen 1', // Bạn có thể thay đổi logic này nếu cần
                    number: offset + index + 1, // Tính toán số thứ tự dựa trên offset
                };
            })
        );
        return detailedPokemon;
    } catch (error) {
        console.error('Error fetching data from PokeAPI:', error);
        throw new Error('Failed to fetch Pokémon data from PokeAPI');
    }
};

// Hàm để fetch toàn bộ dữ liệu Pokémon
export const fetchAllPokemonData = async () => {
    let allPokemon = [];
    const limit = 205; // Fetch theo từng lô 205 Pokémon
    const total = 1025; // Tổng số Pokémon
    for (let offset = 0; offset < total; offset += limit) {
        const pokemonBatch = await fetchPokemonDataByBatch(offset, limit);
        allPokemon = [...allPokemon, ...pokemonBatch];
    }
    return allPokemon;
};
