import type { Request, Response } from 'express';
import { rickAndMortyService } from '../services/rickandmorty.service.js';
import type { EpisodeQueryParams } from '../types/index.js';
import { logger } from '../utils/logger.js';

export class EpisodesController {
  async getAll(req: Request, res: Response): Promise<void> {
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
      logger.error('Error in getAll episodes:', error);
      res.status(500).json({ error: 'Failed to fetch episodes' });
    }
  }

  async getById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const episodeId = Number(id);

      if (isNaN(episodeId)) {
        res.status(400).json({ error: 'Invalid episode ID' });
        return;
      }

      const episode = await rickAndMortyService.getEpisodeById(episodeId);

      if (!episode) {
        res.status(404).json({ error: 'Episode not found' });
        return;
      }

      res.json(episode);
    } catch (error) {
      logger.error('Error in getById episode:', error);
      res.status(500).json({ error: 'Failed to fetch episode' });
    }
  }

  async getMultiple(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const episodeIds = id.split(',').map(Number).filter(id => !isNaN(id));

      if (episodeIds.length === 0) {
        res.status(400).json({ error: 'Invalid episode IDs' });
        return;
      }

      const episodes = await rickAndMortyService.getMultipleEpisodes(episodeIds);
      res.json(episodes);
    } catch (error) {
      logger.error('Error in getMultiple episodes:', error);
      res.status(500).json({ error: 'Failed to fetch episodes' });
    }
  }
}

export const episodesController = new EpisodesController();
