import express from 'express';
import axios from 'axios';
import cors from 'cors';

const app = express();

// Cấu hình middleware CORS để cho phép mọi nguồn truy cập
app.use(cors({
    origin: '*', // Cho phép mọi nguồn truy cập
    methods: ['GET'], // Chỉ cho phép phương thức GET
    allowedHeaders: ['Content-Type', 'Authorization'], // Các header được phép sử dụng
}));

// Biến toàn cục để lưu dữ liệu Pokémon đã fetch
let cachedPokemonData = [];

// Hàm để kiểm tra xem cache có còn hợp lệ không (chỉ cần kiểm tra dữ liệu đã được fetch hay chưa)
const isCacheValid = () => {
    return cachedPokemonData.length > 0; // Cache hợp lệ nếu có dữ liệu
};

// Hàm để fetch dữ liệu từ PokeAPI theo từng lô nhỏ
const fetchPokemonDataByBatch = async (offset, limit) => {
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
                    version: 'Red/Blue', // Bạn có thể thay đổi thông tin này nếu cần
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

// Hàm để fetch toàn bộ dữ liệu Pokémon (1302 Pokémon)
const fetchAllPokemonData = async () => {
    let allPokemon = [];
    const limit = 200; // Fetch theo từng lô 200 Pokémon
    const total = 1000; // Tổng số Pokémon
    for (let offset = 0; offset < total; offset += limit) {
        const pokemonBatch = await fetchPokemonDataByBatch(offset, limit);
        allPokemon = [...allPokemon, ...pokemonBatch];
    }
    return allPokemon;
};

// Endpoint để phục vụ dữ liệu Pokémon
app.get('/', async (req, res) => {
    try {
        // Kiểm tra xem cache có còn hợp lệ không
        if (!isCacheValid()) {
            // Nếu cache không hợp lệ, fetch dữ liệu mới
            const pokemonData = await fetchAllPokemonData();
            cachedPokemonData = pokemonData; // Cập nhật cache
            res.json(pokemonData);
        } else {
            // Nếu cache hợp lệ, trả về dữ liệu đã được cache
            res.json(cachedPokemonData);
        }
    } catch (error) {
        // Nếu có lỗi xảy ra trong quá trình fetch dữ liệu, trả về lỗi 500
        res.status(500).json({ error: error.message });
    }
});

// Khởi động server tại một cổng cố định
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

// Export ứng dụng (nếu cần dùng trong các file khác)
export default app;
