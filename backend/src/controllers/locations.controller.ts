import type { Request, Response, NextFunction } from 'express';
import { rickAndMortyService } from '../services/rickandmorty.service.js';
import type { LocationQueryParams } from '../types/index.js';

export class LocationsController {
  async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
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
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const locationId = Number(id);

      if (isNaN(locationId)) {
        res.status(400).json({ error: { message: 'Invalid location ID', status: 400 } });
        return;
      }

      const location = await rickAndMortyService.getLocationById(locationId);

      if (!location) {
        res.status(404).json({ error: { message: 'Location not found', status: 404 } });
        return;
      }

      res.json(location);
    } catch (error) {
      next(error);
    }
  }

  async getMultiple(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const locationIds = id.split(',').map(Number).filter(id => !isNaN(id) && id > 0);

      if (locationIds.length === 0) {
        res.status(400).json({ error: { message: 'Invalid location IDs', status: 400 } });
        return;
      }

      const locations = await rickAndMortyService.getMultipleLocations(locationIds);
      res.json(locations);
    } catch (error) {
      next(error);
    }
  }
}

export const locationsController = new LocationsController();
