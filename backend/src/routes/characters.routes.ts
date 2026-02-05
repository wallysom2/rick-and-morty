import { Router, type Router as RouterType } from 'express';
import { charactersController } from '../controllers/characters.controller.js';

const router: RouterType = Router();

// GET /api/characters - List all characters with filters
router.get('/', (req, res, next) => charactersController.getAll(req, res, next));

// GET /api/characters/:id - Get single character or multiple (comma-separated IDs)
router.get('/:id', (req, res, next) => {
  // Check if it's a comma-separated list of IDs
  if (req.params.id.includes(',')) {
    return charactersController.getMultiple(req, res, next);
  }
  return charactersController.getById(req, res, next);
});

export { router as charactersRoutes };
