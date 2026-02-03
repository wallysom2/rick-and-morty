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
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">
          Characters
        </h1>
        <p className="text-gray-400">
          Explore {pagination.count || 'all'} characters from the Rick and Morty universe
        </p>
      </div>

      {/* Filters */}
      <div className="mb-8 space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <SearchBar
              value={search}
              onChange={handleSearchChange}
              placeholder="Search by name..."
            />
          </div>
        </div>
        <StatusFilter value={status} onChange={handleStatusChange} />
      </div>

      {/* Content */}
      {isLoading ? (
        <SkeletonList count={8} />
      ) : isError ? (
        <ErrorState
          message="Failed to load characters. Please try again."
          onRetry={() => refetch()}
        />
      ) : (
        <>
          <CharacterList characters={characters} favoriteIds={favoriteIds} />

          {/* Pagination */}
          <div className="mt-8">
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
