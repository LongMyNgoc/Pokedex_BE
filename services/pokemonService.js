import axios from 'axios';

// Hàm để fetch dữ liệu từ PokeAPI theo từng lô nhỏ
export const fetchPokemonDataByBatch = async (offset, limit) => {
    try {
        const response = await axios.get(`https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`);
        const detailedPokemon = await Promise.all(
            response.data.results.map(async (pokemon, index) => {
                try {
                    // Fetch thông tin chi tiết về Pokémon
                    const pokemonData = await axios.get(pokemon.url);
                    
                    // Fetch thông tin về species để lấy generation
                    const speciesData = await axios.get(pokemonData.data.species.url);
                    
                    return {
                        name: pokemonData.data.name,
                        sprite: pokemonData.data.sprites.front_default,
                        types: pokemonData.data.types.map(type => type.type.name),
                        generation: speciesData.data.generation.name, // Lấy thế hệ từ species data
                        number: offset + index + 1, // Tính toán số thứ tự dựa trên offset
                    };
                } catch (error) {
                    console.error(`Error fetching data for Pokémon: ${pokemon.name}`, error);
                    return null; // Nếu có lỗi, trả về null để không làm hỏng toàn bộ request
                }
            })
        );
        
        // Lọc ra các kết quả hợp lệ
        return detailedPokemon.filter(pokemon => pokemon !== null);
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
