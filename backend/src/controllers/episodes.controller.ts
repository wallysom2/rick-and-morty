import type { Request, Response, NextFunction } from 'express';
import { rickAndMortyService } from '../services/rickandmorty.service.js';
import type { EpisodeQueryParams } from '../types/index.js';

export class EpisodesController {
  async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { page, name, episode } = req.query;

      const params: EpisodeQueryParams = {
        page: page ? Number(page) : undefined,
        name: name as string | undefined,
        episode: episode as string | undefined,
      };

      const data = await rickAndMortyService.getEpisodes(params);
      res.json(data);
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const episodeId = Number(id);

      if (isNaN(episodeId)) {
        res.status(400).json({ error: { message: 'Invalid episode ID', status: 400 } });
        return;
      }

      const episode = await rickAndMortyService.getEpisodeById(episodeId);

      if (!episode) {
        res.status(404).json({ error: { message: 'Episode not found', status: 404 } });
        return;
      }

      res.json(episode);
    } catch (error) {
      next(error);
    }
  }

  async getMultiple(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const episodeIds = id.split(',').map(Number).filter(id => !isNaN(id) && id > 0);

      if (episodeIds.length === 0) {
        res.status(400).json({ error: { message: 'Invalid episode IDs', status: 400 } });
        return;
      }

      const episodes = await rickAndMortyService.getMultipleEpisodes(episodeIds);
      res.json(episodes);
    } catch (error) {
      next(error);
    }
  }
}

export const episodesController = new EpisodesController();
