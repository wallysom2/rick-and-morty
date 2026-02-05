import { Router, type Router as RouterType } from 'express';
import { charactersRoutes } from './characters.routes.js';
import { favoritesRoutes } from './favorites.routes.js';
import episodesRoutes from './episodes.routes.js';
import locationsRoutes from './locations.routes.js';
import chatRoutes from './chat.routes.js';

const router: RouterType = Router();

// Mount routes
router.use('/characters', charactersRoutes);
router.use('/favorites', favoritesRoutes);
router.use('/episodes', episodesRoutes);
router.use('/locations', locationsRoutes);
router.use('/chat', chatRoutes);

export { router as apiRoutes };

