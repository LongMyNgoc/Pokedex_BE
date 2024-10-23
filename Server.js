import express from 'express';
import axios from 'axios';
import cors from 'cors';

const app = express();

// Middleware để xử lý CORS
app.use(cors({
    origin: '*', // Cho phép tất cả các nguồn
    methods: ['GET'], // Các phương thức được phép
    allowedHeaders: ['Content-Type', 'Authorization'], // Các header được phép
}));

// Dữ liệu Pokémon sẽ được lưu vào biến toàn cục
let cachedPokemonData = [];

// Endpoint để fetch dữ liệu Pokémon
app.get('/', async (req, res) => {
    if (cachedPokemonData.length === 0) { // Nếu dữ liệu chưa được fetch
        try {
            const response = await axios.get('https://pokeapi.co/api/v2/pokemon?limit=1302');
            const detailedPokemon = await Promise.all(
                response.data.results.map(async (pokemon, index) => {
                    const pokemonData = await axios.get(pokemon.url);
                    return {
                        name: pokemonData.data.name,
                        sprite: pokemonData.data.sprites.front_default,
                        types: pokemonData.data.types.map(type => type.type.name),
                        generation: 'Gen 1',
                        version: 'Red/Blue',
                        number: index + 1,
                    };
                })
            );
            cachedPokemonData = detailedPokemon; // Lưu dữ liệu đã được chi tiết
            res.json(cachedPokemonData);
        } catch (error) {
            console.error('Error fetching data from PokeAPI:', error);
            res.status(500).json({ error: 'Failed to fetch data' });
        }
    } else {
        res.json(cachedPokemonData);
    }
});

// Export ứng dụng
export default app;
