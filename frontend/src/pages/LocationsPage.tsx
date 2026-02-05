import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLocations, useDebounce } from '../hooks';
import { Container, SearchBar, FilterSelect, Pagination, ErrorState, PageHeader } from '../components';
import type { Location } from '../types';
import { 
  IoPlanetOutline, 
  IoRocketOutline, 
  IoInfiniteOutline, 
  IoTvOutline, 
  IoSunnyOutline, 
  IoLocationOutline,
  IoPeopleOutline,
  IoCubeOutline,
  IoBusinessOutline,
  IoCloudyNightOutline,
  IoSearchOutline,
  IoFilterOutline
} from 'react-icons/io5';

const typeIcons = {
  Planet: <IoPlanetOutline className="w-5 h-5" />,
  'Space station': <IoRocketOutline className="w-5 h-5" />,
  Microverse: <IoInfiniteOutline className="w-5 h-5" />,
  TV: <IoTvOutline className="w-5 h-5" />,
  Resort: <IoSunnyOutline className="w-5 h-5" />,
  'Fantasy town': <IoBusinessOutline className="w-5 h-5" />,
  Dream: <IoCloudyNightOutline className="w-5 h-5" />,
  default: <IoLocationOutline className="w-5 h-5" />
};

function LocationCard({ location }: { location: Location }) {
  const icon = typeIcons[location.type as keyof typeof typeIcons] || typeIcons.default;

  return (
    <Link
      to={`/locations/${location.id}`}
      className="group relative flex flex-col bg-[var(--bg-card)] rounded-xl overflow-hidden border border-[var(--border-default)] hover:border-[var(--color-primary)]/50 hover:shadow-[0_0_20px_rgba(151,206,76,0.15)] transition-all duration-300 animate-fade-in-up"
    >
      <div className="p-5 flex flex-col h-full">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="p-2 rounded-lg bg-[var(--space-medium)] text-[var(--color-primary)] transition-colors">
            {icon}
          </div>
          <div className="flex items-center gap-1.5 text-[var(--text-muted)] text-xs font-medium px-2 py-1 rounded-md bg-[var(--space-medium)]">
            <IoPeopleOutline className="w-3.5 h-3.5" />
            <span>{location.residentsCount ?? location.residents.length}</span>
          </div>
        </div>

        <h3 className="text-lg font-semibold text-[var(--text-primary)] group-hover:text-[var(--color-primary)] transition-colors line-clamp-2 mb-1">
          {location.name}
        </h3>

        <p className="text-sm text-[var(--text-secondary)] mb-auto">
          {location.type || 'Tipo desconhecido'}
        </p>

        <div className="mt-4 pt-4 border-t border-[var(--space-light)] flex items-center gap-2 text-sm text-[var(--text-muted)]">
          <IoCubeOutline className="w-4 h-4" />
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

  const { locations, pagination, isLoading, isError, refetch, prefetchNextPage } = useLocations({
    page,
    name: debouncedSearch || undefined,
    type: type || undefined,
  });

  return (
    <Container>
      {/* Page Header */}
      <PageHeader
        title="Localizações"
        icon={
          <IoLocationOutline className="w-7 h-7" />
        }
        subtitle={
          <p>
            Explore{' '}
            <span className="text-[var(--color-primary)] font-semibold font-mono">
              {pagination.count || 'todas as'}
            </span>{' '}
            localizações do multiverso Rick and Morty
          </p>
        }
        accentColor="var(--color-primary)"
      />

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
              accentColor="var(--color-primary)"
              ariaLabel="Filtrar por tipo"
              icon={
                <IoFilterOutline className="w-5 h-5" />
              }
            />
          </div>
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
          message="Falha ao carregar localizações. O portal pode estar instável."
          onRetry={() => refetch()}
        />
      ) : locations.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 sm:py-24">
          <div className="relative mb-6">
              <div className="absolute inset-0 rounded-full animate-pulse"
              style={{
                background: 'radial-gradient(circle, rgba(151, 206, 76, 0.2) 0%, transparent 70%)',
                transform: 'scale(2)'
              }}
            />
            <div className="relative w-24 h-24 sm:w-32 sm:h-32 rounded-full flex items-center justify-center"
              style={{
                background: 'linear-gradient(135deg, var(--bg-card), var(--bg-main))',
                boxShadow: '0 0 40px rgba(151, 206, 76, 0.2)'
              }}
            >
              <IoSearchOutline className="w-12 h-12 sm:w-16 sm:h-16 text-[var(--color-primary)]" />
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
