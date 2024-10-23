import { fetchAllPokemonData } from '../services/pokemonService.js';
import { isCacheValid, setCache, getCache } from '../utils/cache.js';

// Hàm xử lý yêu cầu lấy dữ liệu Pokémon
export const getPokemonData = async (req, res) => {
    try {
        // Kiểm tra xem cache có còn hợp lệ không
        if (!isCacheValid()) {
            // Nếu cache không hợp lệ, fetch dữ liệu mới
            const pokemonData = await fetchAllPokemonData();
            setCache(pokemonData); // Cập nhật cache
            res.json(pokemonData);
        } else {
            // Nếu cache hợp lệ, trả về dữ liệu đã được cache
            res.json(getCache());
        }
    } catch (error) {
        // Nếu có lỗi xảy ra trong quá trình fetch dữ liệu, trả về lỗi 500
        res.status(500).json({ error: error.message });
    }
};
