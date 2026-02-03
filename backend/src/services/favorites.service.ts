import { favoritesRepository, PaginatedResult } from '../repositories/favorites.repository.js';
import { rickAndMortyService } from './rickandmorty.service.js';
import { IFavorite } from '../models/favorite.model.js';
import type { CreateFavoriteDTO, FavoriteQueryParams } from '../types/index.js';
import { logger } from '../utils/logger.js';

export class FavoritesService {
  async getAllFavorites(params: FavoriteQueryParams): Promise<PaginatedResult<IFavorite>> {
    return favoritesRepository.findAll(params);
  }

  async getFavoriteIds(): Promise<number[]> {
    return favoritesRepository.findAllIds();
  }

  async addFavorite(characterId: number): Promise<IFavorite> {
    // Check if already favorited (idempotency)
    const existing = await favoritesRepository.findByCharacterId(characterId);
    if (existing) {
      logger.debug(`Character ${characterId} is already a favorite`);
      return existing;
    }

    // Fetch character data from Rick and Morty API
    const character = await rickAndMortyService.getCharacterById(characterId);
    if (!character) {
      throw new Error(`Character with ID ${characterId} not found`);
    }

    // Create favorite DTO
    const dto: CreateFavoriteDTO = {
      characterId: character.id,
      name: character.name,
      image: character.image,
      species: character.species,
      status: character.status,
    };

    const favorite = await favoritesRepository.create(dto);
    logger.info(`Added character ${character.name} (ID: ${characterId}) to favorites`);

    return favorite;
  }

  async removeFavorite(characterId: number): Promise<boolean> {
    const deleted = await favoritesRepository.deleteByCharacterId(characterId);

    if (deleted) {
      logger.info(`Removed character ID ${characterId} from favorites`);
    } else {
      logger.debug(`Character ID ${characterId} was not in favorites`);
    }

    return deleted;
  }

  async isFavorite(characterId: number): Promise<boolean> {
    return favoritesRepository.exists(characterId);
  }

  async getFavoritesCount(): Promise<number> {
    return favoritesRepository.count();
  }
}

// Singleton instance
export const favoritesService = new FavoritesService();
