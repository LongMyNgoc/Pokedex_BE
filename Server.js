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

// Biến toàn cục để lưu dữ liệu Pokémon đã fetch và thời gian hết hạn cache
let cachedPokemonData = [];
let cacheExpirationTime = 0;

// Hàm để kiểm tra xem dữ liệu cache có còn hợp lệ không
const isCacheValid = () => {
    const now = Date.now();
    return cachedPokemonData.length > 0 && now < cacheExpirationTime;
};

// Hàm để fetch dữ liệu từ PokeAPI
const fetchPokemonData = async () => {
    try {
        // Gọi API để lấy danh sách Pokémon với giới hạn là 1302
        const response = await axios.get('https://pokeapi.co/api/v2/pokemon?limit=151');

        // Fetch chi tiết từng Pokémon và tạo một mảng chi tiết
        const detailedPokemon = await Promise.all(
            response.data.results.map(async (pokemon, index) => {
                const pokemonData = await axios.get(pokemon.url);
                return {
                    name: pokemonData.data.name,
                    sprite: pokemonData.data.sprites.front_default,
                    types: pokemonData.data.types.map(type => type.type.name),
                    generation: 'Gen 1', // Bạn có thể thay đổi logic này nếu cần
                    version: 'Red/Blue', // Bạn có thể thay đổi thông tin này nếu cần
                    number: index + 1,
                };
            })
        );

        // Cập nhật cache với dữ liệu mới và đặt thời gian hết hạn là 1 giờ (3600000 ms)
        cachedPokemonData = detailedPokemon;
        cacheExpirationTime = Date.now() + 3600000; // Cache hết hạn sau 1 giờ
        return detailedPokemon;

    } catch (error) {
        // Log lỗi và trả về null nếu có vấn đề xảy ra
        console.error('Error fetching data from PokeAPI:', error);
        throw new Error('Failed to fetch Pokémon data from PokeAPI');
    }
};

// Endpoint để phục vụ dữ liệu Pokémon
app.get('/', async (req, res) => {
    try {
        // Kiểm tra xem cache có còn hợp lệ không
        if (!isCacheValid()) {
            // Nếu cache không hợp lệ, fetch dữ liệu mới
            const pokemonData = await fetchPokemonData();
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
