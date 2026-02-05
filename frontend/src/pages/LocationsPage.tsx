import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLocations, useDebounce } from '../hooks';
import { Container, SearchBar, FilterSelect, ActiveFilters, Pagination, ErrorState } from '../components';
import type { Location } from '../types';

const typeIcons = {
  Planet: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  'Space station': (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
    </svg>
  ),
  Microverse: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
    </svg>
  ),
  TV: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  ),
  Resort: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  default: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  )
};

function LocationCard({ location }: { location: Location }) {
  const icon = typeIcons[location.type as keyof typeof typeIcons] || typeIcons.default;

  return (
    <Link
      to={`/locations/${location.id}`}
      className="group relative flex flex-col bg-[var(--bg-card)] rounded-xl overflow-hidden border border-[var(--border-default)] hover:border-[var(--dimension-gold)] transition-all duration-300 hover:shadow-[0_0_20px_rgba(250,204,21,0.15)] animate-fade-in-up"
    >
      {/* Top accent line */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[var(--dimension-gold)] to-[var(--dimension-purple)] opacity-0 group-hover:opacity-100 transition-opacity" />

      <div className="p-5 flex flex-col h-full">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="p-2 rounded-lg bg-[var(--bg-terminal)] text-[var(--dimension-gold)] border border-[var(--border-default)] group-hover:border-[var(--dimension-gold)] transition-colors">
            {icon}
          </div>
          <div className="flex items-center gap-1.5 text-[var(--text-muted)] text-xs font-medium bg-[var(--bg-terminal)] px-2 py-1 rounded-md border border-[var(--border-default)]">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span>{location.residents.length}</span>
          </div>
        </div>

        <h3 className="text-lg font-title font-semibold text-[var(--text-primary)] group-hover:text-[var(--dimension-gold)] transition-colors line-clamp-2 mb-1">
          {location.name}
        </h3>

        <p className="text-sm text-[var(--text-muted)] mb-auto">
          {location.type || 'Tipo desconhecido'}
        </p>

        <div className="mt-4 pt-4 border-t border-[var(--border-default)] flex items-center gap-2 text-sm text-[var(--text-secondary)]">
          <svg className="w-4 h-4 text-[var(--text-muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="truncate">{location.dimension || 'Dimensão desconhecida'}</span>
        </div>
      </div>
    </Link>
  );
}

function LocationSkeleton() {
  return (
    <div className="bg-[var(--bg-card)] rounded-xl p-5 border border-[var(--border-default)] animate-pulse flex flex-col h-[160px]">
      <div className="flex justify-between items-start mb-4">
        <div className="h-9 w-9 skeleton rounded-lg" />
        <div className="h-6 w-12 skeleton rounded" />
      </div>
      <div className="h-6 w-3/4 skeleton rounded mb-2" />
      <div className="h-4 w-1/3 skeleton rounded mb-auto" />
      <div className="pt-4 mt-4 border-t border-[var(--border-default)]">
        <div className="h-4 w-1/2 skeleton rounded" />
      </div>
    </div>
  );
}

const typeFilters = [
  { value: '', label: 'Todos os tipos' },
  { value: 'Planet', label: 'Planeta' },
  { value: 'Space station', label: 'Estação espacial' },
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

  const handleClearFilters = () => {
    setSearch('');
    setType('');
    setPage(1);
  };

  const { locations, pagination, isLoading, isError, refetch, prefetchNextPage } = useLocations({
    page,
    name: debouncedSearch || undefined,
    type: type || undefined,
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
  if (type) {
    const typeLabel = typeFilters.find(t => t.value === type)?.label || type;
    activeFilters.push({
      label: typeLabel,
      value: type,
      onClear: () => setType(''),
    });
  }

  return (
    <Container>
      {/* Page Header */}
      <div className="mb-6 sm:mb-10">
        <div className="flex items-center gap-3 mb-2">
          <div className="relative">
            <div className="w-2 h-8 sm:h-10 rounded-full bg-gradient-to-b from-[var(--dimension-gold)] to-[var(--dimension-purple)]" />
          </div>
          <h1 className="font-title text-3xl sm:text-4xl lg:text-5xl text-[var(--dimension-gold)]">
            Localizações
          </h1>
        </div>
        <p className="text-sm sm:text-base text-[var(--text-muted)] ml-5">
          Explore{' '}
          <span className="text-[var(--dimension-gold)] font-semibold">
            {pagination.count || 'todas as'}
          </span>{' '}
          localizações do multiverso Rick and Morty
        </p>
      </div>

      {/* Filters Section */}
      <div className="mb-6 sm:mb-8 space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <SearchBar
              value={search}
              onChange={handleSearchChange}
              placeholder="Buscar localizações..."
            />
          </div>
          <div className="sm:w-56">
            <FilterSelect
              value={type}
              onChange={handleTypeChange}
              options={typeFilters}
              placeholder="Todos os tipos"
              accentColor="var(--dimension-gold)"
              ariaLabel="Filtrar por tipo"
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
              }
            />
          </div>
        </div>

        {/* Active Filters */}
        <ActiveFilters
          filters={activeFilters}
          onClearAll={handleClearFilters}
          accentColor="var(--dimension-gold)"
        />
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
          message="Falha ao carregar localizações. O portal pode estar instável."
          onRetry={() => refetch()}
        />
      ) : locations.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 sm:py-24">
          <div className="relative mb-6">
            <div className="absolute inset-0 rounded-full animate-pulse"
              style={{
                background: 'radial-gradient(circle, rgba(250, 204, 21, 0.2) 0%, transparent 70%)',
                transform: 'scale(2)'
              }}
            />
            <div className="relative w-24 h-24 sm:w-32 sm:h-32 rounded-full flex items-center justify-center"
              style={{
                background: 'linear-gradient(135deg, var(--bg-card), var(--bg-main))',
                boxShadow: '0 0 40px rgba(250, 204, 21, 0.2)'
              }}
            >
              <svg className="w-12 h-12 sm:w-16 sm:h-16 text-[var(--dimension-gold)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-[var(--text-primary)] mb-2 text-center">
            Nenhuma localização encontrada
          </h3>
          <p className="text-sm sm:text-base text-[var(--text-muted)] text-center max-w-md">
            Tente ajustar sua busca ou filtros para encontrar outras dimensões
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
                Mostrando página{' '}
                <span className="text-[var(--dimension-gold)] font-semibold">{page}</span>
                {' '}de{' '}
                <span className="text-[var(--dimension-gold)] font-semibold">{pagination.pages}</span>
              </span>
            </div>
          )}
        </>
      )}
    </Container>
  );
}
