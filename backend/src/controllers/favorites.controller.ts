import { Request, Response, NextFunction } from 'express';
import { favoritesService } from '../services/favorites.service.js';
import type { FavoriteQueryParams } from '../types/index.js';
import { z } from 'zod';

const addFavoriteSchema = z.object({
  characterId: z.number().int().positive(),
});

export class FavoritesController {
  async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const params: FavoriteQueryParams = {
        page: req.query.page ? Number(req.query.page) : 1,
        limit: req.query.limit ? Number(req.query.limit) : 20,
        search: req.query.search as string | undefined,
        sortBy: (req.query.sortBy as FavoriteQueryParams['sortBy']) || 'createdAt',
        order: (req.query.order as FavoriteQueryParams['order']) || 'desc',
      };

      const result = await favoritesService.getAllFavorites(params);

      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async getIds(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const ids = await favoritesService.getFavoriteIds();
      res.json({ ids });
    } catch (error) {
      next(error);
    }
  }

  async add(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const parsed = addFavoriteSchema.safeParse(req.body);

      if (!parsed.success) {
        res.status(400).json({
          error: {
            message: 'Validation failed',
            status: 400,
            errors: parsed.error.flatten().fieldErrors,
          },
        });
        return;
      }

      const favorite = await favoritesService.addFavorite(parsed.data.characterId);

      res.status(201).json(favorite);
    } catch (error) {
      if (error instanceof Error && error.message.includes('not found')) {
        res.status(404).json({ error: { message: error.message, status: 404 } });
        return;
      }
      next(error);
    }
  }

  async remove(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const characterId = Number(req.params.characterId);

      if (isNaN(characterId)) {
        res.status(400).json({ error: { message: 'Invalid character ID', status: 400 } });
        return;
      }

      const deleted = await favoritesService.removeFavorite(characterId);

      if (!deleted) {
        res.status(404).json({ error: { message: 'Favorite not found', status: 404 } });
        return;
      }

      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }

  async checkFavorite(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const characterId = Number(req.params.characterId);

      if (isNaN(characterId)) {
        res.status(400).json({ error: { message: 'Invalid character ID', status: 400 } });
        return;
      }

      const isFavorite = await favoritesService.isFavorite(characterId);

      res.json({ isFavorite });
    } catch (error) {
      next(error);
    }
  }
}

export const favoritesController = new FavoritesController();
