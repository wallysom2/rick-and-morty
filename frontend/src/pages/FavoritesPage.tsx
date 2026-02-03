import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Container,
  SearchBar,
  Pagination,
  SkeletonList,
  ErrorState,
  FavoriteButton,
} from '../components';
import { useFavorites, useToggleFavorite, useDebounce } from '../hooks';
import type { Favorite } from '../types';

const statusColors: Record<string, string> = {
  Alive: 'bg-green-500',
  Dead: 'bg-red-500',
  unknown: 'bg-gray-500',
};

const statusTextColors: Record<string, string> = {
  Alive: 'text-green-400',
  Dead: 'text-red-400',
  unknown: 'text-gray-400',
};

const statusLabels: Record<string, string> = {
  Alive: 'Vivo',
  Dead: 'Morto',
  unknown: 'Desconhecido',
};

interface FavoriteCardProps {
  favorite: Favorite;
  onRemove: () => void;
  isRemoving: boolean;
}

function FavoriteCard({ favorite, onRemove, isRemoving }: FavoriteCardProps) {
  return (
    <div className="bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 group">
      {/* Image */}
      <div className="relative aspect-square">
        <img
          src={favorite.image}
          alt={favorite.name}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        {/* Favorite button overlay */}
        <div className="absolute top-2 right-2">
          <FavoriteButton
            isFavorite={true}
            onToggle={onRemove}
            isLoading={isRemoving}
            size="md"
          />
        </div>
      </div>

      {/* Content */}
      <div className="p-3 sm:p-4">
        {/* Name */}
        <h3 className="text-base sm:text-lg font-bold text-white truncate mb-1 sm:mb-2" title={favorite.name}>
          {favorite.name}
        </h3>

        {/* Status */}
        <div className="flex items-center space-x-2 mb-1 sm:mb-2">
          <span
            className={`w-2 h-2 rounded-full ${statusColors[favorite.status]}`}
          />
          <span className={`text-xs sm:text-sm ${statusTextColors[favorite.status]}`}>
            {statusLabels[favorite.status] || favorite.status}
          </span>
        </div>

        {/* Species */}
        <p className="text-gray-400 text-xs sm:text-sm">
          <span className="text-gray-500">Especie:</span> {favorite.species}
        </p>

        {/* Added date */}
        <p className="text-gray-500 text-xs mt-1 sm:mt-2">
          Adicionado em {new Date(favorite.createdAt).toLocaleDateString('pt-BR')}
        </p>
      </div>
    </div>
  );
}

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

  return (
    <Container>
      {/* Header */}
      <div className="mb-4 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1 sm:mb-2 flex items-center gap-2 sm:gap-3">
          <span>❤️</span>
          <span>Meus Favoritos</span>
        </h1>
        <p className="text-sm sm:text-base text-gray-400">
          {pagination.total} {pagination.total === 1 ? 'personagem favorito' : 'personagens favoritos'}
        </p>
      </div>

      {/* Filters */}
      <div className="mb-4 sm:mb-8 space-y-3 sm:space-y-4">
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <div className="flex-1">
            <SearchBar
              value={search}
              onChange={handleSearchChange}
              placeholder="Buscar favoritos..."
            />
          </div>
          <div className="flex gap-2">
            {/* Sort by */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'createdAt' | 'name')}
              className="flex-1 sm:flex-none bg-gray-800 border border-gray-700 rounded-lg px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base text-white focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="createdAt">Data</option>
              <option value="name">Nome</option>
            </select>
            {/* Order */}
            <button
              onClick={() => setOrder(order === 'asc' ? 'desc' : 'asc')}
              className="bg-gray-800 border border-gray-700 rounded-lg px-3 sm:px-4 py-2.5 sm:py-3 text-white hover:bg-gray-700 transition-colors"
              title={order === 'asc' ? 'Crescente' : 'Decrescente'}
            >
              {order === 'asc' ? '↑' : '↓'}
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      {isLoading ? (
        <SkeletonList count={8} />
      ) : isError ? (
        <ErrorState
          message="Falha ao carregar favoritos. Tente novamente."
          onRetry={() => refetch()}
        />
      ) : favorites.length === 0 ? (
        <div className="text-center py-12 sm:py-16">
          <span className="text-5xl sm:text-6xl mb-4 block">💔</span>
          <h3 className="text-lg sm:text-xl font-semibold text-gray-400 mb-2">Nenhum favorito ainda</h3>
          <p className="text-sm sm:text-base text-gray-500 mb-4 sm:mb-6">
            Comece adicionando personagens aos seus favoritos!
          </p>
          <Link
            to="/"
            className="inline-flex items-center px-4 sm:px-6 py-2.5 sm:py-3 bg-green-600 text-white text-sm sm:text-base rounded-lg hover:bg-green-700 transition-colors"
          >
            <span className="mr-2">🔍</span>
            Explorar Personagens
          </Link>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
            {favorites.map((favorite) => (
              <FavoriteCard
                key={favorite._id}
                favorite={favorite}
                onRemove={() => toggle(favorite.characterId, true)}
                isRemoving={isToggling}
              />
            ))}
          </div>

          {/* Pagination */}
          <div className="mt-6 sm:mt-8">
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
