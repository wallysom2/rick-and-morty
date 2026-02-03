import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { favoritesApi } from '../services/api';
import type { FavoriteFilters } from '../types';
import toast from 'react-hot-toast';

export function useFavorites(filters: FavoriteFilters = {}) {
  return useQuery({
    queryKey: ['favorites', filters],
    queryFn: () => favoritesApi.getAll(filters),
  });
}

export function useFavoriteIds() {
  return useQuery({
    queryKey: ['favoriteIds'],
    queryFn: () => favoritesApi.getIds(),
    staleTime: 1000 * 30, // 30 seconds
  });
}

export function useToggleFavorite() {
  const queryClient = useQueryClient();

  const addMutation = useMutation({
    mutationFn: favoritesApi.add,
    onSuccess: (favorite) => {
      // Update favoriteIds cache
      queryClient.setQueryData<number[]>(['favoriteIds'], (old) => {
        if (!old) return [favorite.characterId];
        return [...old, favorite.characterId];
      });
      // Invalidate favorites list
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
      toast.success(`${favorite.name} added to favorites!`);
    },
    onError: () => {
      toast.error('Failed to add favorite');
    },
  });

  const removeMutation = useMutation({
    mutationFn: favoritesApi.remove,
    onSuccess: (_, characterId) => {
      // Update favoriteIds cache
      queryClient.setQueryData<number[]>(['favoriteIds'], (old) => {
        if (!old) return [];
        return old.filter((id) => id !== characterId);
      });
      // Invalidate favorites list
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
      toast.success('Removed from favorites');
    },
    onError: () => {
      toast.error('Failed to remove favorite');
    },
  });

  const toggle = (characterId: number, isFavorite: boolean) => {
    if (isFavorite) {
      removeMutation.mutate(characterId);
    } else {
      addMutation.mutate(characterId);
    }
  };

  return {
    toggle,
    isLoading: addMutation.isPending || removeMutation.isPending,
  };
}
