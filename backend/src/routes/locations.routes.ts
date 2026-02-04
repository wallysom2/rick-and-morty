import { Router, type Router as RouterType } from 'express';
import { locationsController } from '../controllers/locations.controller.js';

const router: RouterType = Router();

/**
 * @route GET /api/locations
 * @desc Get all locations with optional filters
 */
router.get('/', (req, res) => locationsController.getAll(req, res));

/**
 * @route GET /api/locations/:id
 * @desc Get a single location by ID
 */
router.get('/:id', (req, res) => {
  // Check if it's a comma-separated list of IDs
  if (req.params.id.includes(',')) {
    return locationsController.getMultiple(req, res);
  }
  return locationsController.getById(req, res);
});

export default router;
