import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Container,
  SearchBar,
  FilterSelect,
  ActiveFilters,
  Pagination,
  SkeletonList,
  ErrorState,
  CharacterCard, // Import shared component
} from '../components';
import { useFavorites, useToggleFavorite, useDebounce } from '../hooks';
import type { Character } from '../types';

const sortByOptions = [
  { value: 'createdAt', label: 'Data' },
  { value: 'name', label: 'Nome' },
];

export function FavoritesPage() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState<'createdAt' | 'name'>('createdAt');
  const [order, setOrder] = useState<'asc' | 'desc'>('desc');

  const debouncedSearch = useDebounce(search, 300);

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const handleSortByChange = (value: string) => {
    setSortBy(value as 'createdAt' | 'name');
    setPage(1);
  };

  const handleClearFilters = () => {
    setSearch('');
    setSortBy('createdAt');
    setOrder('desc');
    setPage(1);
  };

  const { data, isLoading, isError, refetch } = useFavorites({
    page,
    limit: 12,
    search: debouncedSearch || undefined,
    sortBy,
    order,
  });

  const { toggle, isLoading: isToggling } = useToggleFavorite();

  const favorites = data?.data || [];
  const pagination = data?.pagination || { total: 0, page: 1, limit: 12, pages: 0 };

  // Build active filters
  const activeFilters = [];
  if (search) {
    activeFilters.push({
      label: `Busca: ${search}`,
      value: search,
      onClear: () => setSearch(''),
    });
  }
  if (sortBy !== 'createdAt' || order !== 'desc') {
    const sortLabel = sortByOptions.find(s => s.value === sortBy)?.label || sortBy;
    const orderLabel = order === 'asc' ? 'Crescente' : 'Decrescente';
    activeFilters.push({
      label: `${sortLabel} (${orderLabel})`,
      value: `${sortBy}-${order}`,
      onClear: () => {
        setSortBy('createdAt');
        setOrder('desc');
      },
    });
  }

  return (
    <Container>
      {/* Page Header */}
      <div className="mb-6 sm:mb-10">
        <div className="flex items-center gap-3 mb-2">
          <div className="relative">
            <div className="w-2 h-8 sm:h-10 rounded-full bg-gradient-to-b from-[var(--dimension-pink)] to-[var(--status-dead)]" />
          </div>
          <h1 className="font-title text-3xl sm:text-4xl lg:text-5xl text-[var(--dimension-pink)]">
            Meus Favoritos
          </h1>
        </div>
        <p className="text-sm sm:text-base text-[var(--text-muted)] ml-5">
          <span className="text-[var(--dimension-pink)] font-semibold">
            {pagination.total}
          </span>{' '}
          {pagination.total === 1 ? 'personagem salvo' : 'personagens salvos'} no seu portal pessoal
        </p>
      </div>

      {/* Filters Section */}
      <div className="mb-6 sm:mb-8 space-y-4">
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <div className="flex-1">
            <SearchBar
              value={search}
              onChange={handleSearchChange}
              placeholder="Buscar favoritos..."
            />
          </div>
          <div className="flex gap-2 sm:gap-3">
            {/* Sort by select */}
            <div className="flex-1 sm:w-36">
              <FilterSelect
                value={sortBy}
                onChange={handleSortByChange}
                options={sortByOptions}
                placeholder="Ordenar"
                accentColor="var(--dimension-pink)"
                ariaLabel="Ordenar por"
                icon={
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
                  </svg>
                }
              />
            </div>
            
            {/* Order button */}
            <button
              onClick={() => setOrder(order === 'asc' ? 'desc' : 'asc')}
              className="
                relative group
                px-4 py-3 rounded-xl
                bg-[var(--space-medium)]
                border-2 border-[var(--space-light)]
                text-[var(--text-primary)]
                hover:border-[var(--dimension-pink)]
                hover:text-[var(--dimension-pink)]
                focus:outline-none
                transition-all duration-300
              "
              title={order === 'asc' ? 'Ordem Crescente' : 'Ordem Decrescente'}
              style={{
                borderColor: order !== 'desc' ? 'var(--dimension-pink)' : 'var(--space-light)',
                color: order !== 'desc' ? 'var(--dimension-pink)' : 'var(--text-primary)',
              }}
            >
              {/* Glow effect on active */}
              {order !== 'desc' && (
                <div 
                  className="absolute -inset-0.5 rounded-xl opacity-50 blur transition-opacity duration-300"
                  style={{
                    background: 'linear-gradient(135deg, var(--dimension-pink), var(--status-dead))',
                  }}
                />
              )}
              <svg 
                className={`relative w-5 h-5 transition-transform duration-300 ${order === 'asc' ? 'rotate-180' : ''}`} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
        </div>

        {/* Active Filters */}
        <ActiveFilters 
          filters={activeFilters}
          onClearAll={handleClearFilters}
          accentColor="var(--dimension-pink)"
        />
      </div>

      {/* Content */}
      {isLoading ? (
        <SkeletonList count={8} />
      ) : isError ? (
        <ErrorState
          message="Falha ao carregar favoritos. Verifique sua conexão com o multiverso."
          onRetry={() => refetch()}
        />
      ) : favorites.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 sm:py-24">
          {/* Empty state illustration */}
          <div className="relative mb-6">
            {/* Glow effect */}
            <div className="absolute inset-0 rounded-full animate-pulse"
              style={{ 
                background: 'radial-gradient(circle, rgba(236, 72, 153, 0.2) 0%, transparent 70%)',
                transform: 'scale(2)'
              }}
            />
            
            <div className="relative w-24 h-24 sm:w-32 sm:h-32 rounded-full flex items-center justify-center"
              style={{
                background: 'linear-gradient(135deg, var(--space-medium), var(--space-dark))',
                boxShadow: '0 0 40px rgba(236, 72, 153, 0.2)'
              }}
            >
              <svg className="w-12 h-12 sm:w-16 sm:h-16 text-[var(--dimension-pink)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
          </div>
          
          <h3 className="text-xl sm:text-2xl font-bold text-[var(--text-primary)] mb-2 text-center">
            Nenhum favorito {search ? 'encontrado' : 'ainda'}
          </h3>
          <p className="text-sm sm:text-base text-[var(--text-muted)] mb-8 text-center max-w-md">
            {search 
              ? 'Tente ajustar sua busca para encontrar outros favoritos'
              : 'Comece a explorar o multiverso e adicione personagens ao seu portal pessoal!'}
          </p>
          
          {!search && (
            <Link
              to="/"
              className="
                group relative px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-semibold
                bg-gradient-to-r from-[var(--portal-green)] to-[var(--portal-cyan)]
                text-[var(--space-black)]
                transition-all duration-300
                hover:shadow-[0_0_30px_rgba(151,206,76,0.5)]
                hover:scale-105
                active:scale-95
              "
            >
              <span className="flex items-center gap-2 sm:gap-3">
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                Explorar Personagens
              </span>
            </Link>
          )}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
            {favorites.map((favorite) => {
              // Map favorite to character structure for the card
              // Note: Favorites only store basic info, so we provide defaults for missing fields
              const character: Character = {
                id: favorite.characterId,
                name: favorite.name,
                status: favorite.status,
                species: favorite.species,
                type: favorite.type || '',
                gender: favorite.gender || 'unknown',
                origin: favorite.origin || { name: 'Desconhecido', url: '' },
                location: favorite.location || { name: 'Desconhecido', url: '' },
                image: favorite.image,
                episode: favorite.episode || [],
                url: favorite.url || '',
                created: favorite.createdAt,
              };

              return (
                <CharacterCard
                  key={favorite._id}
                  character={character}
                  isFavorite={true}
                  onToggleFavorite={() => toggle(favorite.characterId, true)}
                  isToggling={isToggling}
                />
              );
            })}
          </div>

          {/* Pagination */}
          <div className="mt-8 sm:mt-12">
            <Pagination
              currentPage={page}
              totalPages={pagination.pages}
              onPageChange={setPage}
            />
          </div>
        </>
      )}
    </Container>
  );
}
