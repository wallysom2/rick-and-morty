import { Router, type Router as RouterType } from 'express';
import { favoritesController } from '../controllers/favorites.controller.js';

const router: RouterType = Router();

// GET /api/favorites - List all favorites with pagination
router.get('/', (req, res, next) => favoritesController.getAll(req, res, next));

// GET /api/favorites/ids - Get all favorite character IDs (for quick UI marking)
router.get('/ids', (req, res, next) => favoritesController.getIds(req, res, next));

// GET /api/favorites/check/:characterId - Check if character is favorited
router.get('/check/:characterId', (req, res, next) => favoritesController.checkFavorite(req, res, next));

// POST /api/favorites - Add favorite
router.post('/', (req, res, next) => favoritesController.add(req, res, next));

// DELETE /api/favorites/:characterId - Remove favorite
router.delete('/:characterId', (req, res, next) => favoritesController.remove(req, res, next));

export { router as favoritesRoutes };
