import { useQuery, useQueryClient } from '@tanstack/react-query';
import { locationsApi } from '../services/api';
import type { LocationFilters } from '../types';

export function useLocations(filters: LocationFilters = {}) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['locations', filters],
    queryFn: () => locationsApi.getAll(filters),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const prefetchNextPage = () => {
    if (query.data?.info.next) {
      const nextPage = (filters.page || 1) + 1;
      queryClient.prefetchQuery({
        queryKey: ['locations', { ...filters, page: nextPage }],
        queryFn: () => locationsApi.getAll({ ...filters, page: nextPage }),
      });
    }
  };

  return {
    locations: query.data?.results || [],
    pagination: query.data?.info || { count: 0, pages: 0, next: null, prev: null },
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
    prefetchNextPage,
  };
}

export function useLocation(id: number) {
  return useQuery({
    queryKey: ['location', id],
    queryFn: () => locationsApi.getById(id),
    enabled: !!id && id > 0,
    staleTime: 1000 * 60 * 5,
  });
}

export function useMultipleLocations(ids: number[]) {
  return useQuery({
    queryKey: ['locations', 'multiple', ids.sort().join(',')],
    queryFn: () => locationsApi.getMultiple(ids),
    enabled: ids.length > 0,
    staleTime: 1000 * 60 * 5,
  });
}
