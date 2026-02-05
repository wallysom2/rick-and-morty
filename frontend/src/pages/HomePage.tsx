import { useState } from 'react';
import {
  Container,
  SearchBar,
  StatusFilter,
  CharacterList,
  Pagination,
  SkeletonList,
  ErrorState,
  PageHeader,
} from '../components';
import { useCharacters, useFavoriteIds, useDebounce } from '../hooks';
import type { CharacterStatus } from '../types';
import { IoPeopleOutline } from 'react-icons/io5';

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
      {/* Page Header */}
      <PageHeader
        title="Personagens"
        icon={
          <IoPeopleOutline className="w-7 h-7" />
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
