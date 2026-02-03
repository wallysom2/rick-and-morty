import { useState } from 'react';
import {
  Container,
  SearchBar,
  StatusFilter,
  CharacterList,
  Pagination,
  SkeletonList,
  ErrorState,
} from '../components';
import { useCharacters, useFavoriteIds, useDebounce } from '../hooks';
import type { CharacterStatus } from '../types';

export function HomePage() {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<CharacterStatus | ''>('');
  const [page, setPage] = useState(1);

  const debouncedSearch = useDebounce(search, 300);

  // Reset page when filters change
  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const handleStatusChange = (value: CharacterStatus | '') => {
    setStatus(value);
    setPage(1);
  };

  const {
    characters,
    pagination,
    isLoading,
    isError,
    refetch,
    prefetchNextPage,
  } = useCharacters({
    page,
    name: debouncedSearch || undefined,
    status: status || undefined,
  });

  const { data: favoriteIds = [] } = useFavoriteIds();

  return (
    <Container>
      {/* Header */}
      <div className="mb-4 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1 sm:mb-2">
          Personagens
        </h1>
        <p className="text-sm sm:text-base text-gray-400">
          Explore {pagination.count || 'todos os'} personagens do universo Rick and Morty
        </p>
      </div>

      {/* Filters */}
      <div className="mb-4 sm:mb-8 space-y-3 sm:space-y-4">
        <SearchBar
          value={search}
          onChange={handleSearchChange}
          placeholder="Buscar por nome..."
        />
        <StatusFilter value={status} onChange={handleStatusChange} />
      </div>

      {/* Content */}
      {isLoading ? (
        <SkeletonList count={8} />
      ) : isError ? (
        <ErrorState
          message="Falha ao carregar personagens. Tente novamente."
          onRetry={() => refetch()}
        />
      ) : (
        <>
          <CharacterList characters={characters} favoriteIds={favoriteIds} />

          {/* Pagination */}
          <div className="mt-6 sm:mt-8">
            <Pagination
              currentPage={page}
              totalPages={pagination.pages}
              onPageChange={setPage}
              onPrefetch={prefetchNextPage}
            />
          </div>
        </>
      )}
    </Container>
  );
}
