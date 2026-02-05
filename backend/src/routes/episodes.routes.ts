import { Router, type Router as RouterType } from 'express';
import { episodesController } from '../controllers/episodes.controller.js';

const router: RouterType = Router();

/**
 * @route GET /api/episodes
 * @desc Get all episodes with optional filters
 */
router.get('/', (req, res) => episodesController.getAll(req, res));

/**
 * @route GET /api/episodes/:id
 * @desc Get a single episode by ID
 */
router.get('/:id', (req, res) => {
  // Check if it's a comma-separated list of IDs
  if (req.params.id.includes(',')) {
    return episodesController.getMultiple(req, res);
  }
  return episodesController.getById(req, res);
});

export default router;
