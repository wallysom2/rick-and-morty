import { useQuery } from '@tanstack/react-query';
import { charactersApi } from '../services/api';

export function useCharacter(id: number) {
  return useQuery({
    queryKey: ['character', id],
    queryFn: () => charactersApi.getById(id),
    enabled: !!id && id > 0,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export function useMultipleCharacters(ids: number[]) {
  return useQuery({
    queryKey: ['characters', 'multiple', ids.sort().join(',')],
    queryFn: () => charactersApi.getMultiple(ids),
    enabled: ids.length > 0,
    staleTime: 1000 * 60 * 5,
  });
}
