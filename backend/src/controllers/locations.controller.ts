import type { Request, Response } from 'express';
import { rickAndMortyService } from '../services/rickandmorty.service.js';
import type { LocationQueryParams } from '../types/index.js';
import { logger } from '../utils/logger.js';

export class LocationsController {
  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const { page, name, type, dimension } = req.query;

      const params: LocationQueryParams = {
        page: page ? Number(page) : undefined,
        name: name as string | undefined,
        type: type as string | undefined,
        dimension: dimension as string | undefined,
      };

      const data = await rickAndMortyService.getLocations(params);
      res.json(data);
    } catch (error) {
      logger.error('Error in getAll locations:', error);
      res.status(500).json({ error: 'Failed to fetch locations' });
    }
  }

  async getById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const locationId = Number(id);

      if (isNaN(locationId)) {
        res.status(400).json({ error: 'Invalid location ID' });
        return;
      }

      const location = await rickAndMortyService.getLocationById(locationId);

      if (!location) {
        res.status(404).json({ error: 'Location not found' });
        return;
      }

      res.json(location);
    } catch (error) {
      logger.error('Error in getById location:', error);
      res.status(500).json({ error: 'Failed to fetch location' });
    }
  }

  async getMultiple(req: Request, res: Response): Promise<void> {
    try {
      const { ids } = req.params;
      const locationIds = ids.split(',').map(Number).filter(id => !isNaN(id));

      if (locationIds.length === 0) {
        res.status(400).json({ error: 'Invalid location IDs' });
        return;
      }

      const locations = await rickAndMortyService.getMultipleLocations(locationIds);
      res.json(locations);
    } catch (error) {
      logger.error('Error in getMultiple locations:', error);
      res.status(500).json({ error: 'Failed to fetch locations' });
    }
  }
}

export const locationsController = new LocationsController();
