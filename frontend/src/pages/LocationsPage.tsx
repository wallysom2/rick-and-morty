import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLocations, useDebounce } from '../hooks';
import { Container, SearchBar, Pagination, ErrorState } from '../components';
import type { Location } from '../types';

function LocationCard({ location }: { location: Location }) {
  return (
    <Link 
      to={`/locations/${location.id}`}
      className="block bg-[var(--bg-card)] rounded-xl p-4 card-hover animate-fade-in-up border border-[var(--border-default)] hover:border-[var(--color-primary)]"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-[var(--text-primary)] truncate mb-1 group-hover:text-[var(--color-primary)] transition-colors">
            {location.name}
          </h3>
          <div className="space-y-1">
            <p className="text-sm text-[var(--text-secondary)] flex items-center gap-2">
              <svg className="w-4 h-4 text-[var(--color-primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
              <span className="truncate">{location.type || 'Tipo desconhecido'}</span>
            </p>
            <p className="text-sm text-[var(--text-muted)] flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="truncate">{location.dimension || 'Dimensao desconhecida'}</span>
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1 text-[var(--text-muted)] bg-[var(--bg-terminal)] px-2 py-1 rounded-lg">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <span className="text-xs font-mono">{location.residents.length}</span>
        </div>
      </div>
    </Link>
  );
}

function LocationSkeleton() {
  return (
    <div className="bg-[var(--bg-card)] rounded-xl p-4 border border-[var(--border-default)] animate-pulse">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <div className="h-5 w-3/4 skeleton rounded mb-2" />
          <div className="h-4 w-1/2 skeleton rounded mb-1" />
          <div className="h-4 w-2/3 skeleton rounded" />
        </div>
      </div>
    </div>
  );
}

const typeFilters = [
  { value: '', label: 'Todos os tipos' },
  { value: 'Planet', label: 'Planeta' },
  { value: 'Space station', label: 'Estacao espacial' },
  { value: 'Microverse', label: 'Microverso' },
  { value: 'TV', label: 'TV' },
  { value: 'Resort', label: 'Resort' },
  { value: 'Fantasy town', label: 'Cidade fantasia' },
  { value: 'Dream', label: 'Sonho' },
];

export function LocationsPage() {
  const [search, setSearch] = useState('');
  const [type, setType] = useState('');
  const [page, setPage] = useState(1);

  const debouncedSearch = useDebounce(search, 300);

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const handleTypeChange = (value: string) => {
    setType(value);
    setPage(1);
  };

  const { locations, pagination, isLoading, isError, refetch, prefetchNextPage } = useLocations({
    page,
    name: debouncedSearch || undefined,
    type: type || undefined,
  });

  return (
    <Container>
      {/* Page Header */}
      <div className="mb-6 sm:mb-10">
        <div className="flex items-center gap-3 mb-2">
          <div className="relative">
            <div className="w-2 h-8 sm:h-10 rounded-full bg-gradient-to-b from-[var(--color-primary)] to-cyan-400" />
            <div className="absolute inset-0 w-2 h-8 sm:h-10 rounded-full bg-gradient-to-b from-[var(--color-primary)] to-cyan-400 blur-sm" />
          </div>
          <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl text-[var(--color-primary)]" 
            style={{ textShadow: '0 0 20px var(--color-primary), 0 0 40px var(--color-primary)' }}>
            Localizacoes
          </h1>
        </div>
        <p className="text-sm sm:text-base text-[var(--text-muted)] ml-5">
          Explore{' '}
          <span className="text-[var(--color-primary)] font-semibold">
            {pagination.count || 'todas as'}
          </span>{' '}
          localizacoes do multiverso Rick and Morty
        </p>
      </div>

      {/* Filters */}
      <div className="mb-6 sm:mb-8 space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <SearchBar
              value={search}
              onChange={handleSearchChange}
              placeholder="Buscar localizacoes..."
            />
          </div>
          <select
            value={type}
            onChange={(e) => handleTypeChange(e.target.value)}
            className="input sm:w-48"
          >
            {typeFilters.map((t) => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 9 }).map((_, i) => (
            <LocationSkeleton key={i} />
          ))}
        </div>
      ) : isError ? (
        <ErrorState
          message="Falha ao carregar localizacoes. O portal pode estar instavel."
          onRetry={() => refetch()}
        />
      ) : locations.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 sm:py-24">
          <div className="relative mb-6">
            <div className="absolute inset-0 rounded-full animate-pulse"
              style={{ 
                background: 'radial-gradient(circle, rgba(0, 255, 136, 0.2) 0%, transparent 70%)',
                transform: 'scale(2)'
              }}
            />
            <div className="relative w-24 h-24 sm:w-32 sm:h-32 rounded-full flex items-center justify-center"
              style={{
                background: 'linear-gradient(135deg, var(--bg-card), var(--bg-main))',
                boxShadow: '0 0 40px rgba(0, 255, 136, 0.2)'
              }}
            >
              <svg className="w-12 h-12 sm:w-16 sm:h-16 text-[var(--color-primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-[var(--text-primary)] mb-2 text-center">
            Nenhuma localizacao encontrada
          </h3>
          <p className="text-sm sm:text-base text-[var(--text-muted)] text-center max-w-md">
            Tente ajustar sua busca ou filtros para encontrar outras dimensoes
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {locations.map((location) => (
              <LocationCard key={location.id} location={location} />
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
                Mostrando pagina{' '}
                <span className="text-[var(--color-primary)] font-semibold">{page}</span>
                {' '}de{' '}
                <span className="text-[var(--color-primary)] font-semibold">{pagination.pages}</span>
              </span>
            </div>
          )}
        </>
      )}
    </Container>
  );
}
