import axios from 'axios';

// Hàm để tính toán thế hệ dựa trên số thứ tự
const calculateGeneration = (number) => {
    if (number >= 1 && number <= 151) return 'Gen 1';
    if (number >= 152 && number <= 251) return 'Gen 2';
    if (number >= 252 && number <= 386) return 'Gen 3';
    if (number >= 387 && number <= 493) return 'Gen 4';
    if (number >= 494 && number <= 649) return 'Gen 5';
    if (number >= 650 && number <= 721) return 'Gen 6';
    if (number >= 722 && number <= 809) return 'Gen 7';
    if (number >= 810 && number <= 898) return 'Gen 8';
    return 'Gen 9'; // 899 trở đi
};

// Hàm để fetch dữ liệu từ PokeAPI theo từng lô nhỏ
export const fetchPokemonDataByBatch = async (offset, limit) => {
    try {
        const response = await axios.get(`https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`);
        const detailedPokemon = await Promise.all(
            response.data.results.map(async (pokemon, index) => {
                const pokemonData = await axios.get(pokemon.url);
                const number = offset + index + 1; // Tính toán số thứ tự dựa trên offset
                return {
                    name: pokemonData.data.name,
                    sprite: pokemonData.data.sprites.front_default,
                    types: pokemonData.data.types.map(type => type.type.name),
                    generation: calculateGeneration(number), // Tính toán thế hệ
                    number: number,
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
