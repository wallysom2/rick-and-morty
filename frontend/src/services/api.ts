import axios from 'axios';
import type {
  CharactersResponse,
  CharacterFilters,
  FavoritesResponse,
  FavoriteFilters,
  FavoriteIdsResponse,
  Favorite,
  Character,
} from '../types';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Characters API
export const charactersApi = {
  getAll: async (filters: CharacterFilters = {}): Promise<CharactersResponse> => {
    const params = new URLSearchParams();
    if (filters.page) params.set('page', String(filters.page));
    if (filters.name) params.set('name', filters.name);
    if (filters.status) params.set('status', filters.status);
    if (filters.species) params.set('species', filters.species);
    if (filters.gender) params.set('gender', filters.gender);

    const { data } = await api.get<CharactersResponse>(`/characters?${params}`);
    return data;
  },

  getById: async (id: number): Promise<Character> => {
    const { data } = await api.get<Character>(`/characters/${id}`);
    return data;
  },
};

// Favorites API
export const favoritesApi = {
  getAll: async (filters: FavoriteFilters = {}): Promise<FavoritesResponse> => {
    const params = new URLSearchParams();
    if (filters.page) params.set('page', String(filters.page));
    if (filters.limit) params.set('limit', String(filters.limit));
    if (filters.search) params.set('search', filters.search);
    if (filters.sortBy) params.set('sortBy', filters.sortBy);
    if (filters.order) params.set('order', filters.order);

    const { data } = await api.get<FavoritesResponse>(`/favorites?${params}`);
    return data;
  },

  getIds: async (): Promise<number[]> => {
    const { data } = await api.get<FavoriteIdsResponse>('/favorites/ids');
    return data.ids;
  },

  add: async (characterId: number): Promise<Favorite> => {
    const { data } = await api.post<Favorite>('/favorites', { characterId });
    return data;
  },

  remove: async (characterId: number): Promise<void> => {
    await api.delete(`/favorites/${characterId}`);
  },

  check: async (characterId: number): Promise<boolean> => {
    const { data } = await api.get<{ isFavorite: boolean }>(`/favorites/check/${characterId}`);
    return data.isFavorite;
  },
};

export default api;
