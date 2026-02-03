import { Request, Response, NextFunction } from 'express';
import { rickAndMortyService } from '../services/rickandmorty.service.js';
import type { CharacterQueryParams } from '../types/index.js';

export class CharactersController {
  async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const params: CharacterQueryParams = {
        page: req.query.page ? Number(req.query.page) : undefined,
        name: req.query.name as string | undefined,
        status: req.query.status as CharacterQueryParams['status'],
        species: req.query.species as string | undefined,
        gender: req.query.gender as string | undefined,
      };

      const result = await rickAndMortyService.getCharacters(params);

      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = Number(req.params.id);

      if (isNaN(id)) {
        res.status(400).json({ error: { message: 'Invalid character ID', status: 400 } });
        return;
      }

      const character = await rickAndMortyService.getCharacterById(id);

      if (!character) {
        res.status(404).json({ error: { message: 'Character not found', status: 404 } });
        return;
      }

      res.json(character);
    } catch (error) {
      next(error);
    }
  }
}

export const charactersController = new CharactersController();
