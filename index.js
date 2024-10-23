import express from 'express';
import cors from 'cors';
import pokemonRoutes from './routes/pokemonRoutes.js';

const app = express();

// Cấu hình middleware CORS để cho phép mọi nguồn truy cập
app.use(cors({
    origin: '*', // Cho phép mọi nguồn truy cập
    methods: ['GET'], // Chỉ cho phép phương thức GET
    allowedHeaders: ['Content-Type', 'Authorization'], // Các header được phép sử dụng
}));

// Sử dụng route cho Pokémon
app.use('/pokemon', pokemonRoutes);

// Khởi động server tại một cổng cố định
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

export default app;
