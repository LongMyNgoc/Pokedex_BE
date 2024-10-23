import axios from 'axios';

// Hàm để fetch dữ liệu từ PokeAPI theo từng lô nhỏ
export const fetchAllPokemonData = async (offset, limit) => {
    try {
        const response = await axios.get(`https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`);
        const detailedPokemon = await Promise.all(
            response.data.results.map(async (pokemon, index) => {
                // Fetch thông tin chi tiết về Pokémon
                const pokemonData = await axios.get(pokemon.url);
                
                // Fetch thông tin về thế hệ từ pokemon-species endpoint
                const speciesData = await axios.get(pokemonData.data.species.url);
                
                return {
                    name: pokemonData.data.name,
                    sprite: pokemonData.data.sprites.front_default,
                    types: pokemonData.data.types.map(type => type.type.name),
                    generation: speciesData.data.generation.name, // Lấy thế hệ từ species data
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