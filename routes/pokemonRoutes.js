import express from 'express';
import { getPokemonData } from '../controllers/pokemonController.js';

const router = express.Router();

// Route để lấy dữ liệu Pokémon
router.get('/', getPokemonData);

export default router;
