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
  PageHeader,
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
      <PageHeader
        title="Personagens"
        icon={
          <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        }
        subtitle={
          <p>
            Explore{' '}
            <span className="text-[var(--portal-green)] font-semibold font-mono">
              {pagination.count || 'todos os'}
            </span>{' '}
            personagens do multiverso Rick and Morty
          </p>
        }
        accentColor="var(--portal-green)"
      />

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
