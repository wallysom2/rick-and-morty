import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useEpisodes, useDebounce } from '../hooks';
import { Container, SearchBar, FilterSelect, ActiveFilters, Pagination, ErrorState } from '../components';
import type { Episode } from '../types';

function EpisodeCard({ episode }: { episode: Episode }) {
  return (
    <Link 
      to={`/episodes/${episode.id}`}
      className="block bg-[var(--bg-card)] rounded-xl p-4 card-hover animate-fade-in-up border border-[var(--border-default)] hover:border-[var(--color-primary)]"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2 py-1 text-xs font-mono font-bold bg-[var(--color-primary)]/20 text-[var(--color-primary)] rounded">
              {episode.episode}
            </span>
          </div>
          <h3 className="text-lg font-semibold text-[var(--text-primary)] truncate mb-1">
            {episode.name}
          </h3>
          <p className="text-sm text-[var(--text-secondary)]">
            {episode.air_date}
          </p>
        </div>
        <div className="flex items-center gap-1 text-[var(--text-muted)] bg-[var(--bg-terminal)] px-2 py-1 rounded-lg">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <span className="text-xs font-mono">{episode.characters.length}</span>
        </div>
      </div>
    </Link>
  );
}

function EpisodeSkeleton() {
  return (
    <div className="bg-[var(--bg-card)] rounded-xl p-4 border border-[var(--border-default)] animate-pulse">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <div className="h-6 w-16 skeleton rounded mb-2" />
          <div className="h-5 w-3/4 skeleton rounded mb-2" />
          <div className="h-4 w-1/2 skeleton rounded" />
        </div>
      </div>
    </div>
  );
}

const seasonFilters = [
  { value: '', label: 'Todas as Temporadas' },
  { value: 'S01', label: 'Temporada 1' },
  { value: 'S02', label: 'Temporada 2' },
  { value: 'S03', label: 'Temporada 3' },
  { value: 'S04', label: 'Temporada 4' },
  { value: 'S05', label: 'Temporada 5' },
];

export function EpisodesPage() {
  const [search, setSearch] = useState('');
  const [season, setSeason] = useState('');
  const [page, setPage] = useState(1);

  const debouncedSearch = useDebounce(search, 300);

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const handleSeasonChange = (value: string) => {
    setSeason(value);
    setPage(1);
  };

  const handleClearFilters = () => {
    setSearch('');
    setSeason('');
    setPage(1);
  };

  const { episodes, pagination, isLoading, isError, refetch, prefetchNextPage } = useEpisodes({
    page,
    name: debouncedSearch || undefined,
    episode: season || undefined,
  });

  // Build active filters
  const activeFilters = [];
  if (search) {
    activeFilters.push({
      label: `Busca: ${search}`,
      value: search,
      onClear: () => setSearch(''),
    });
  }
  if (season) {
    const seasonLabel = seasonFilters.find(s => s.value === season)?.label || season;
    activeFilters.push({
      label: seasonLabel,
      value: season,
      onClear: () => setSeason(''),
    });
  }

  return (
    <Container>
      {/* Page Header */}
      <div className="mb-6 sm:mb-10">
        <div className="flex items-center gap-3 mb-2">
          <div className="relative">
            <div className="w-2 h-8 sm:h-10 rounded-full bg-gradient-to-b from-[var(--portal-cyan)] to-[var(--dimension-purple)]" />
          </div>
          <h1 className="font-title text-3xl sm:text-4xl lg:text-5xl text-[var(--portal-cyan)]">
            Episódios
          </h1>
        </div>
        <p className="text-sm sm:text-base text-[var(--text-muted)] ml-5">
          Explore{' '}
          <span className="text-[var(--portal-cyan)] font-semibold">
            {pagination.count || 'todos os'}
          </span>{' '}
          episódios do multiverso Rick and Morty
        </p>
      </div>

      {/* Filters Section */}
      <div className="mb-6 sm:mb-8 space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <SearchBar
              value={search}
              onChange={handleSearchChange}
              placeholder="Buscar episódios..."
            />
          </div>
          <div className="sm:w-56">
            <FilterSelect
              value={season}
              onChange={handleSeasonChange}
              options={seasonFilters}
              placeholder="Todas as Temporadas"
              accentColor="var(--portal-cyan)"
              ariaLabel="Filtrar por temporada"
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
                </svg>
              }
            />
          </div>
        </div>

        {/* Active Filters */}
        <ActiveFilters 
          filters={activeFilters}
          onClearAll={handleClearFilters}
          accentColor="var(--portal-cyan)"
        />
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 9 }).map((_, i) => (
            <EpisodeSkeleton key={i} />
          ))}
        </div>
      ) : isError ? (
        <ErrorState
          message="Falha ao carregar episódios. Tente novamente."
          onRetry={() => refetch()}
        />
      ) : episodes.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 sm:py-24">
          <div className="relative mb-6">
            <div className="absolute inset-0 rounded-full animate-pulse"
              style={{ 
                background: 'radial-gradient(circle, rgba(0, 212, 255, 0.2) 0%, transparent 70%)',
                transform: 'scale(2)'
              }}
            />
            <div className="relative w-24 h-24 sm:w-32 sm:h-32 rounded-full flex items-center justify-center"
              style={{
                background: 'linear-gradient(135deg, var(--bg-card), var(--bg-main))',
                boxShadow: '0 0 40px rgba(0, 212, 255, 0.2)'
              }}
            >
              <svg className="w-12 h-12 sm:w-16 sm:h-16 text-[var(--portal-cyan)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
              </svg>
            </div>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-[var(--text-primary)] mb-2 text-center">
            Nenhum episódio encontrado
          </h3>
          <p className="text-sm sm:text-base text-[var(--text-muted)] text-center max-w-md">
            Tente ajustar sua busca ou filtros para encontrar outros episódios
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {episodes.map((episode) => (
              <EpisodeCard key={episode.id} episode={episode} />
            ))}
          </div>

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
                <span className="text-[var(--portal-cyan)] font-semibold">{page}</span>
                {' '}de{' '}
                <span className="text-[var(--portal-cyan)] font-semibold">{pagination.pages}</span>
              </span>
            </div>
          )}
        </>
      )}
    </Container>
  );
}
