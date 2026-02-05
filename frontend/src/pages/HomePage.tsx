import { useState } from 'react';
import {
  Container,
  SearchBar,
  StatusFilter,
  ActiveFilters,
  CharacterList,
  Pagination,
  SkeletonList,
  ErrorState,
} from '../components';
import { useCharacters, useFavoriteIds, useDebounce } from '../hooks';
import type { CharacterStatus } from '../types';

const statusLabels: Record<CharacterStatus | '', string> = {
  '': 'Todos',
  'Alive': 'Vivos',
  'Dead': 'Mortos',
  'unknown': 'Desconhecido',
};

export function HomePage() {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<CharacterStatus | ''>('');
  const [page, setPage] = useState(1);

  const debouncedSearch = useDebounce(search, 300);

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const handleStatusChange = (value: CharacterStatus | '') => {
    setStatus(value);
    setPage(1);
  };

  const handleClearFilters = () => {
    setSearch('');
    setStatus('');
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

  // Build active filters
  const activeFilters = [];
  if (search) {
    activeFilters.push({
      label: `Busca: ${search}`,
      value: search,
      onClear: () => setSearch(''),
    });
  }
  if (status) {
    activeFilters.push({
      label: `Status: ${statusLabels[status]}`,
      value: status,
      onClear: () => setStatus(''),
    });
  }

  return (
    <Container>
      {/* Page Header */}
      <div className="mb-6 sm:mb-10">
        <div className="flex items-center gap-3 mb-2">
          <div className="relative">
            <div className="w-2 h-8 sm:h-10 rounded-full bg-gradient-to-b from-[var(--portal-green)] to-[var(--portal-cyan)]" />
          </div>
          <h1 className="font-title text-3xl sm:text-4xl lg:text-5xl text-[var(--portal-green)]">
            Personagens
          </h1>
        </div>
        <p className="text-sm sm:text-base text-[var(--text-muted)] ml-5">
          Explore{' '}
          <span className="text-[var(--portal-cyan)] font-semibold">
            {pagination.count || 'todos os'}
          </span>{' '}
          personagens do multiverso Rick and Morty
        </p>
      </div>

      {/* Filters Section */}
      <div className="mb-6 sm:mb-8 space-y-4">
        <SearchBar
          value={search}
          onChange={handleSearchChange}
          placeholder="Buscar por nome..."
        />
        <StatusFilter value={status} onChange={handleStatusChange} />
        
        {/* Active Filters */}
        <ActiveFilters 
          filters={activeFilters}
          onClearAll={handleClearFilters}
        />
      </div>

      {/* Content */}
      {isLoading ? (
        <SkeletonList count={8} />
      ) : isError ? (
        <ErrorState
          message="Falha ao carregar personagens. O portal dimensional pode estar instável."
          onRetry={() => refetch()}
        />
      ) : (
        <>
          <CharacterList characters={characters} favoriteIds={favoriteIds} />

          {/* Pagination */}
          <div className="mt-8 sm:mt-12">
            <Pagination
              currentPage={page}
              totalPages={pagination.pages}
              onPageChange={setPage}
              onPrefetch={prefetchNextPage}
            />
          </div>

          {/* Page info */}
          {pagination.pages > 1 && (
            <div className="mt-4 text-center">
              <span className="text-sm text-[var(--text-muted)]">
                Mostrando página{' '}
                <span className="text-[var(--portal-green)] font-semibold">{page}</span>
                {' '}de{' '}
                <span className="text-[var(--portal-green)] font-semibold">{pagination.pages}</span>
              </span>
            </div>
          )}
        </>
      )}
    </Container>
  );
}
