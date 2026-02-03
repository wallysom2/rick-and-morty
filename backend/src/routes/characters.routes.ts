import { Router, type Router as RouterType } from 'express';
import { charactersController } from '../controllers/characters.controller.js';

const router: RouterType = Router();

// GET /api/characters - List all characters with filters
router.get('/', (req, res, next) => charactersController.getAll(req, res, next));

// GET /api/characters/:id - Get single character
router.get('/:id', (req, res, next) => charactersController.getById(req, res, next));

export { router as charactersRoutes };
