let cachedPokemonData = [];

// Hàm để kiểm tra cache có còn hợp lệ không
export const isCacheValid = () => {
    return cachedPokemonData.length > 0; // Cache hợp lệ nếu có dữ liệu
};

// Hàm để cập nhật cache
export const setCache = (data) => {
    cachedPokemonData = data;
};

// Hàm để lấy dữ liệu từ cache
export const getCache = () => {
    return cachedPokemonData;
};
