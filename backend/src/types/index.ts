// Character types from Rick and Morty API
export interface Character {
  id: number;
  name: string;
  status: CharacterStatus;
  species: string;
  type: string;
  gender: string;
  origin: {
    name: string;
    url: string;
  };
  location: {
    name: string;
    url: string;
  };
  image: string;
  episode: string[];
  url: string;
  created: string;
}

export type CharacterStatus = 'Alive' | 'Dead' | 'unknown';

// Episode types from Rick and Morty API
export interface Episode {
  id: number;
  name: string;
  air_date: string;
  episode: string; // Format: S01E01
  characters: string[];
  url: string;
  created: string;
}

// Location types from Rick and Morty API
export interface Location {
  id: number;
  name: string;
  type: string;
  dimension: string;
  residents: string[];
  url: string;
  created: string;
}

// API Response types
export interface ApiResponse<T> {
  info: {
    count: number;
    pages: number;
    next: string | null;
    prev: string | null;
  };
  results: T[];
}

export interface CharactersResponse extends ApiResponse<Character> {}
export interface EpisodesResponse extends ApiResponse<Episode> {}
export interface LocationsResponse extends ApiResponse<Location> {}

// Favorite types
export interface Favorite {
  _id?: string;
  characterId: number;
  name: string;
  image: string;
  species: string;
  status: CharacterStatus;
  createdAt: Date;
}

export interface CreateFavoriteDTO {
  characterId: number;
  name: string;
  image: string;
  species: string;
  status: CharacterStatus;
}

// Query params
export interface CharacterQueryParams {
  page?: number;
  name?: string;
  status?: CharacterStatus;
  species?: string;
  gender?: string;
}

export interface EpisodeQueryParams {
  page?: number;
  name?: string;
  episode?: string;
}

export interface LocationQueryParams {
  page?: number;
  name?: string;
  type?: string;
  dimension?: string;
}

export interface FavoriteQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: 'createdAt' | 'name';
  order?: 'asc' | 'desc';
}

// API Error
export interface ApiError {
  message: string;
  status: number;
  errors?: Record<string, string[]>;
}
