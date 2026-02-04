// Character types from Rick and Morty API
export interface Character {
  id: number;
  name: string;
  status: CharacterStatus;
  species: string;
  type: string;
  gender: CharacterGender;
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
export type CharacterGender = 'Female' | 'Male' | 'Genderless' | 'unknown';

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

export interface EpisodesResponse {
  info: PaginationInfo;
  results: Episode[];
}

export interface LocationsResponse {
  info: PaginationInfo;
  results: Location[];
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
  gender?: CharacterGender | '';
}

export interface EpisodeFilters {
  page?: number;
  name?: string;
  episode?: string; // Filter by episode code (S01, S02, etc)
}

export interface LocationFilters {
  page?: number;
  name?: string;
  type?: string;
  dimension?: string;
}

export interface FavoriteFilters {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: 'createdAt' | 'name';
  order?: 'asc' | 'desc';
}
