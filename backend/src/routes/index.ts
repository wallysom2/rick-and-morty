import { Router, type Router as RouterType } from 'express';
import { charactersRoutes } from './characters.routes.js';
import { favoritesRoutes } from './favorites.routes.js';

const router: RouterType = Router();

// Mount routes
router.use('/characters', charactersRoutes);
router.use('/favorites', favoritesRoutes);

export { router as apiRoutes };
