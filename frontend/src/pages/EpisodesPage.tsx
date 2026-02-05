import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useEpisodes, useDebounce } from '../hooks';
import { Container, SearchBar, FilterSelect, Pagination, ErrorState, PageHeader } from '../components';
import type { Episode } from '../types';

function EpisodeCard({ episode }: { episode: Episode }) {
  return (
    <Link 
      to={`/episodes/${episode.id}`}
      className="group relative flex flex-col bg-[var(--bg-card)] rounded-xl overflow-hidden border border-[var(--border-default)] hover:border-[var(--portal-cyan)] transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,212,255,0.15)] animate-fade-in-up"
    >
      {/* Top accent line */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[var(--portal-cyan)] to-[var(--dimension-purple)] opacity-0 group-hover:opacity-100 transition-opacity" />
      
      <div className="p-5 flex flex-col h-full">
        <div className="flex items-start justify-between gap-3 mb-3">
          <span className="px-2.5 py-1 text-xs font-mono font-bold bg-[var(--portal-cyan)]/10 text-[var(--portal-cyan)] rounded border border-[var(--portal-cyan)]/20 group-hover:bg-[var(--portal-cyan)]/20 transition-colors">
            {episode.episode}
          </span>
          <div className="flex items-center gap-1.5 text-[var(--text-muted)] text-xs font-medium bg-[var(--bg-terminal)] px-2 py-1 rounded-md border border-[var(--border-default)]">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span>{episode.characters.length}</span>
          </div>
        </div>

        <h3 className="text-lg font-title font-semibold text-[var(--text-primary)] group-hover:text-[var(--portal-cyan)] transition-colors line-clamp-2 mb-auto">
          {episode.name}
        </h3>
        
        <div className="mt-4 pt-4 border-t border-[var(--border-default)] flex items-center gap-2 text-sm text-[var(--text-secondary)]">
          <svg className="w-4 h-4 text-[var(--text-muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          {episode.air_date}
        </div>
      </div>
    </Link>
  );
}

function EpisodeSkeleton() {
  return (
    <div className="bg-[var(--bg-card)] rounded-xl p-5 border border-[var(--border-default)] animate-pulse flex flex-col h-[160px]">
      <div className="flex justify-between items-start mb-4">
        <div className="h-6 w-16 skeleton rounded" />
        <div className="h-6 w-12 skeleton rounded" />
      </div>
      <div className="h-6 w-3/4 skeleton rounded mb-auto" />
      <div className="pt-4 mt-4 border-t border-[var(--border-default)]">
        <div className="h-4 w-1/2 skeleton rounded" />
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

  const { episodes, pagination, isLoading, isError, refetch, prefetchNextPage } = useEpisodes({
    page,
    name: debouncedSearch || undefined,
    episode: season || undefined,
  });

  return (
    <Container>
      {/* Page Header */}
      <PageHeader
        title="Episódios"
        icon={
          <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
          </svg>
        }
        subtitle={
          <p>
            Explore{' '}
            <span className="text-[var(--portal-cyan)] font-semibold font-mono">
              {pagination.count || 'todos os'}
            </span>{' '}
            episódios do multiverso Rick and Morty
          </p>
        }
        accentColor="var(--portal-cyan)"
      />

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
