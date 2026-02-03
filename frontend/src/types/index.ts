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

// API Response types
export interface PaginationInfo {
  count: number;
  pages: number;
  next: string | null;
  prev: string | null;
}

export interface CharactersResponse {
  info: PaginationInfo;
  results: Character[];
}

// Favorite types
export interface Favorite {
  _id: string;
  characterId: number;
  name: string;
  image: string;
  species: string;
  status: CharacterStatus;
  createdAt: string;
}

export interface FavoritesResponse {
  data: Favorite[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

export interface FavoriteIdsResponse {
  ids: number[];
}

// Query params
export interface CharacterFilters {
  page?: number;
  name?: string;
  status?: CharacterStatus | '';
  species?: string;
  gender?: string;
}

export interface FavoriteFilters {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: 'createdAt' | 'name';
  order?: 'asc' | 'desc';
}
