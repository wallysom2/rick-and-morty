import { FavoriteModel, IFavorite } from '../models/favorite.model.js';
import type { CreateFavoriteDTO, FavoriteQueryParams } from '../types/index.js';

export interface PaginatedResult<T> {
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

export class FavoritesRepository {
  async findAll(params: FavoriteQueryParams): Promise<PaginatedResult<IFavorite>> {
    const {
      page = 1,
      limit = 20,
      search,
      sortBy = 'createdAt',
      order = 'desc',
    } = params;

    const skip = (page - 1) * limit;

    // Build query
    const query: Record<string, unknown> = {};
    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    // Build sort
    const sort: Record<string, 1 | -1> = {
      [sortBy]: order === 'asc' ? 1 : -1,
    };

    const [data, total] = await Promise.all([
      FavoriteModel.find(query).sort(sort).skip(skip).limit(limit),
      FavoriteModel.countDocuments(query),
    ]);

    return {
      data,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    };
  }

  async findByCharacterId(characterId: number): Promise<IFavorite | null> {
    return FavoriteModel.findOne({ characterId });
  }

  async findAllIds(): Promise<number[]> {
    const favorites = await FavoriteModel.find({}, { characterId: 1 });
    return favorites.map((f) => f.characterId);
  }

  async create(dto: CreateFavoriteDTO): Promise<IFavorite> {
    // Check if already exists (idempotency)
    const existing = await this.findByCharacterId(dto.characterId);
    if (existing) {
      return existing;
    }

    const favorite = new FavoriteModel(dto);
    return favorite.save();
  }

  async deleteByCharacterId(characterId: number): Promise<boolean> {
    const result = await FavoriteModel.deleteOne({ characterId });
    return result.deletedCount > 0;
  }

  async exists(characterId: number): Promise<boolean> {
    const count = await FavoriteModel.countDocuments({ characterId });
    return count > 0;
  }

  async count(): Promise<number> {
    return FavoriteModel.countDocuments();
  }
}

// Singleton instance
export const favoritesRepository = new FavoritesRepository();
