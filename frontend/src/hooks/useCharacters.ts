import { useQuery, useQueryClient } from '@tanstack/react-query';
import { charactersApi } from '../services/api';
import type { CharacterFilters } from '../types';

export function useCharacters(filters: CharacterFilters = {}) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['characters', filters],
    queryFn: () => charactersApi.getAll(filters),
    placeholderData: (previousData) => previousData,
  });

  // Prefetch next page
  const prefetchNextPage = () => {
    if (query.data?.info.next) {
      const nextPage = (filters.page || 1) + 1;
      queryClient.prefetchQuery({
        queryKey: ['characters', { ...filters, page: nextPage }],
        queryFn: () => charactersApi.getAll({ ...filters, page: nextPage }),
      });
    }
  };

  return {
    ...query,
    prefetchNextPage,
    characters: query.data?.results || [],
    pagination: query.data?.info || { count: 0, pages: 0, next: null, prev: null },
  };
}

export function useCharacter(id: number) {
  return useQuery({
    queryKey: ['character', id],
    queryFn: () => charactersApi.getById(id),
    enabled: !!id,
  });
}
