import { useQuery, useQueryClient } from '@tanstack/react-query';
import { episodesApi } from '../services/api';
import type { EpisodeFilters } from '../types';

export function useEpisodes(filters: EpisodeFilters = {}) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['episodes', filters],
    queryFn: () => episodesApi.getAll(filters),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const prefetchNextPage = () => {
    if (query.data?.info.next) {
      const nextPage = (filters.page || 1) + 1;
      queryClient.prefetchQuery({
        queryKey: ['episodes', { ...filters, page: nextPage }],
        queryFn: () => episodesApi.getAll({ ...filters, page: nextPage }),
      });
    }
  };

  return {
    episodes: query.data?.results || [],
    pagination: query.data?.info || { count: 0, pages: 0, next: null, prev: null },
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
    prefetchNextPage,
  };
}

export function useEpisode(id: number) {
  return useQuery({
    queryKey: ['episode', id],
    queryFn: () => episodesApi.getById(id),
    enabled: !!id && id > 0,
    staleTime: 1000 * 60 * 5,
  });
}

export function useMultipleEpisodes(ids: number[]) {
  return useQuery({
    queryKey: ['episodes', 'multiple', ids.sort().join(',')],
    queryFn: () => episodesApi.getMultiple(ids),
    enabled: ids.length > 0,
    staleTime: 1000 * 60 * 5,
  });
}
