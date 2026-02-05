import type { 
  Character, 
  CharactersResponse, 
  CharacterQueryParams,
  Episode,
  EpisodesResponse,
  EpisodeQueryParams,
  Location,
  LocationsResponse,
  LocationQueryParams
} from '../types/index.js';
import { apiCache } from '../utils/cache.js';
import { logger } from '../utils/logger.js';

const RICK_AND_MORTY_API = 'https://rickandmortyapi.com/api';
const CACHE_TTL_SECONDS = 60;

export class RickAndMortyService {
  private buildCacheKey(endpoint: string, params?: Record<string, unknown>): string {
    const paramString = params ? JSON.stringify(params) : '';
    return `ram:${endpoint}:${paramString}`;
  }

  // ============================================
  // CHARACTER METHODS
  // ============================================

  async getCharacters(params: CharacterQueryParams = {}): Promise<CharactersResponse> {
    const cacheKey = this.buildCacheKey('characters', params as Record<string, unknown>);

    const cached = apiCache.get<CharactersResponse>(cacheKey);
    if (cached) {
      logger.debug('Cache hit for characters');
      return cached;
    }

    const queryParams = new URLSearchParams();
    if (params.page) queryParams.set('page', String(params.page));
    if (params.name) queryParams.set('name', params.name);
    if (params.status) queryParams.set('status', params.status);
    if (params.species) queryParams.set('species', params.species);
    if (params.gender) queryParams.set('gender', params.gender);

    const queryString = queryParams.toString();
    const url = `${RICK_AND_MORTY_API}/character${queryString ? `?${queryString}` : ''}`;

    logger.debug(`Fetching from Rick and Morty API: ${url}`);

    try {
      const response = await fetch(url);

      if (!response.ok) {
        if (response.status === 404) {
          return {
            info: { count: 0, pages: 0, next: null, prev: null },
            results: [],
          };
        }
        throw new Error(`API responded with status ${response.status}`);
      }

      const data = (await response.json()) as CharactersResponse;
      apiCache.set(cacheKey, data, CACHE_TTL_SECONDS);

      return data;
    } catch (error) {
      logger.error('Error fetching characters from Rick and Morty API:', error);
      throw new Error('Failed to fetch characters from external API');
    }
  }

  async getCharacterById(id: number): Promise<Character | null> {
    const cacheKey = this.buildCacheKey(`character:${id}`);

    const cached = apiCache.get<Character>(cacheKey);
    if (cached) {
      logger.debug(`Cache hit for character ${id}`);
      return cached;
    }

    const url = `${RICK_AND_MORTY_API}/character/${id}`;

    try {
      const response = await fetch(url);

      if (!response.ok) {
        if (response.status === 404) {
          return null;
        }
        throw new Error(`API responded with status ${response.status}`);
      }

      const data = (await response.json()) as Character;
      apiCache.set(cacheKey, data, CACHE_TTL_SECONDS);

      return data;
    } catch (error) {
      logger.error(`Error fetching character ${id} from Rick and Morty API:`, error);
      throw new Error('Failed to fetch character from external API');
    }
  }

  async getMultipleCharacters(ids: number[]): Promise<Character[]> {
    if (ids.length === 0) return [];

    const cacheKey = this.buildCacheKey('characters:multiple', { ids: ids.sort() });

    const cached = apiCache.get<Character[]>(cacheKey);
    if (cached) {
      logger.debug('Cache hit for multiple characters');
      return cached;
    }

    const url = `${RICK_AND_MORTY_API}/character/${ids.join(',')}`;

    try {
      const response = await fetch(url);

      if (!response.ok) {
        if (response.status === 404) {
          return [];
        }
        throw new Error(`API responded with status ${response.status}`);
      }

      const data = await response.json();
      const characters: Character[] = Array.isArray(data) ? data : [data];
      apiCache.set(cacheKey, characters, CACHE_TTL_SECONDS);

      return characters;
    } catch (error) {
      logger.error('Error fetching multiple characters from Rick and Morty API:', error);
      throw new Error('Failed to fetch characters from external API');
    }
  }

  // ============================================
  // EPISODE METHODS
  // ============================================

  async getEpisodes(params: EpisodeQueryParams = {}): Promise<EpisodesResponse> {
    const cacheKey = this.buildCacheKey('episodes', params as Record<string, unknown>);

    const cached = apiCache.get<EpisodesResponse>(cacheKey);
    if (cached) {
      logger.debug('Cache hit for episodes');
      return cached;
    }

    const queryParams = new URLSearchParams();
    if (params.page) queryParams.set('page', String(params.page));
    if (params.name) queryParams.set('name', params.name);
    if (params.episode) queryParams.set('episode', params.episode);

    const queryString = queryParams.toString();
    const url = `${RICK_AND_MORTY_API}/episode${queryString ? `?${queryString}` : ''}`;

    logger.debug(`Fetching episodes from Rick and Morty API: ${url}`);

    try {
      const response = await fetch(url);

      if (!response.ok) {
        if (response.status === 404) {
          return {
            info: { count: 0, pages: 0, next: null, prev: null },
            results: [],
          };
        }
        throw new Error(`API responded with status ${response.status}`);
      }

      const data = (await response.json()) as EpisodesResponse;
      apiCache.set(cacheKey, data, CACHE_TTL_SECONDS);

      return data;
    } catch (error) {
      logger.error('Error fetching episodes from Rick and Morty API:', error);
      throw new Error('Failed to fetch episodes from external API');
    }
  }

  async getEpisodeById(id: number): Promise<Episode | null> {
    const cacheKey = this.buildCacheKey(`episode:${id}`);

    const cached = apiCache.get<Episode>(cacheKey);
    if (cached) {
      logger.debug(`Cache hit for episode ${id}`);
      return cached;
    }

    const url = `${RICK_AND_MORTY_API}/episode/${id}`;

    try {
      const response = await fetch(url);

      if (!response.ok) {
        if (response.status === 404) {
          return null;
        }
        throw new Error(`API responded with status ${response.status}`);
      }

      const data = (await response.json()) as Episode;
      apiCache.set(cacheKey, data, CACHE_TTL_SECONDS);

      return data;
    } catch (error) {
      logger.error(`Error fetching episode ${id} from Rick and Morty API:`, error);
      throw new Error('Failed to fetch episode from external API');
    }
  }

  async getMultipleEpisodes(ids: number[]): Promise<Episode[]> {
    if (ids.length === 0) return [];

    const cacheKey = this.buildCacheKey('episodes:multiple', { ids: ids.sort() });

    const cached = apiCache.get<Episode[]>(cacheKey);
    if (cached) {
      logger.debug('Cache hit for multiple episodes');
      return cached;
    }

    const url = `${RICK_AND_MORTY_API}/episode/${ids.join(',')}`;

    try {
      const response = await fetch(url);

      if (!response.ok) {
        if (response.status === 404) {
          return [];
        }
        throw new Error(`API responded with status ${response.status}`);
      }

      const data = await response.json();
      const episodes: Episode[] = Array.isArray(data) ? data : [data];
      apiCache.set(cacheKey, episodes, CACHE_TTL_SECONDS);

      return episodes;
    } catch (error) {
      logger.error('Error fetching multiple episodes from Rick and Morty API:', error);
      throw new Error('Failed to fetch episodes from external API');
    }
  }

  // ============================================
  // LOCATION METHODS
  // ============================================

  async getLocations(params: LocationQueryParams = {}): Promise<LocationsResponse> {
    const cacheKey = this.buildCacheKey('locations', params as Record<string, unknown>);

    const cached = apiCache.get<LocationsResponse>(cacheKey);
    if (cached) {
      logger.debug('Cache hit for locations');
      return cached;
    }

    const queryParams = new URLSearchParams();
    if (params.page) queryParams.set('page', String(params.page));
    if (params.name) queryParams.set('name', params.name);
    if (params.type) queryParams.set('type', params.type);
    if (params.dimension) queryParams.set('dimension', params.dimension);

    const queryString = queryParams.toString();
    const url = `${RICK_AND_MORTY_API}/location${queryString ? `?${queryString}` : ''}`;

    logger.debug(`Fetching locations from Rick and Morty API: ${url}`);

    try {
      const response = await fetch(url);

      if (!response.ok) {
        if (response.status === 404) {
          return {
            info: { count: 0, pages: 0, next: null, prev: null },
            results: [],
          };
        }
        throw new Error(`API responded with status ${response.status}`);
      }

      const data = (await response.json()) as LocationsResponse;
      apiCache.set(cacheKey, data, CACHE_TTL_SECONDS);

      return data;
    } catch (error) {
      logger.error('Error fetching locations from Rick and Morty API:', error);
      throw new Error('Failed to fetch locations from external API');
    }
  }

  async getLocationById(id: number): Promise<Location | null> {
    const cacheKey = this.buildCacheKey(`location:${id}`);

    const cached = apiCache.get<Location>(cacheKey);
    if (cached) {
      logger.debug(`Cache hit for location ${id}`);
      return cached;
    }

    const url = `${RICK_AND_MORTY_API}/location/${id}`;

    try {
      const response = await fetch(url);

      if (!response.ok) {
        if (response.status === 404) {
          return null;
        }
        throw new Error(`API responded with status ${response.status}`);
      }

      const data = (await response.json()) as Location;
      apiCache.set(cacheKey, data, CACHE_TTL_SECONDS);

      return data;
    } catch (error) {
      logger.error(`Error fetching location ${id} from Rick and Morty API:`, error);
      throw new Error('Failed to fetch location from external API');
    }
  }

  async getMultipleLocations(ids: number[]): Promise<Location[]> {
    if (ids.length === 0) return [];

    const cacheKey = this.buildCacheKey('locations:multiple', { ids: ids.sort() });

    const cached = apiCache.get<Location[]>(cacheKey);
    if (cached) {
      logger.debug('Cache hit for multiple locations');
      return cached;
    }

    const url = `${RICK_AND_MORTY_API}/location/${ids.join(',')}`;

    try {
      const response = await fetch(url);

      if (!response.ok) {
        if (response.status === 404) {
          return [];
        }
        throw new Error(`API responded with status ${response.status}`);
      }

      const data = await response.json();
      const locations: Location[] = Array.isArray(data) ? data : [data];
      apiCache.set(cacheKey, locations, CACHE_TTL_SECONDS);

      return locations;
    } catch (error) {
      logger.error('Error fetching multiple locations from Rick and Morty API:', error);
      throw new Error('Failed to fetch locations from external API');
    }
  }
}

// Singleton instance
export const rickAndMortyService = new RickAndMortyService();
