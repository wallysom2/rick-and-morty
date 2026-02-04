import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useEpisodes, useDebounce } from '../hooks';
import { SearchBar, Pagination, ErrorState } from '../components';
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
        <div className="flex items-center gap-1 text-[var(--text-muted)]">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <span className="text-xs">{episode.characters.length}</span>
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
  { value: '', label: 'All Seasons' },
  { value: 'S01', label: 'Season 1' },
  { value: 'S02', label: 'Season 2' },
  { value: 'S03', label: 'Season 3' },
  { value: 'S04', label: 'Season 4' },
  { value: 'S05', label: 'Season 5' },
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-[var(--text-primary)] mb-2">
          Episodes
        </h1>
        <p className="text-[var(--text-secondary)]">
          {pagination.count || 'All'} episodes from the multiverse
        </p>
      </div>

      {/* Filters */}
      <div className="mb-6 space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <SearchBar
              value={search}
              onChange={handleSearchChange}
              placeholder="Search episodes..."
            />
          </div>
          <select
            value={season}
            onChange={(e) => handleSeasonChange(e.target.value)}
            className="input sm:w-48"
          >
            {seasonFilters.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
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
          message="Failed to load episodes. Please try again."
          onRetry={() => refetch()}
        />
      ) : episodes.length === 0 ? (
        <div className="text-center py-16">
          <svg className="w-16 h-16 mx-auto text-[var(--text-muted)] mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
          </svg>
          <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-2">No episodes found</h3>
          <p className="text-[var(--text-secondary)]">Try adjusting your search or filters</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {episodes.map((episode) => (
              <EpisodeCard key={episode.id} episode={episode} />
            ))}
          </div>

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
    </div>
  );
}
