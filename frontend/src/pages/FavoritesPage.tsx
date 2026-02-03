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

interface FavoriteCardProps {
  favorite: Favorite;
  onRemove: () => void;
  isRemoving: boolean;
}

function FavoriteCard({ favorite, onRemove, isRemoving }: FavoriteCardProps) {
  return (
    <div className="bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 group">
      {/* Image */}
      <div className="relative">
        <img
          src={favorite.image}
          alt={favorite.name}
          className="w-full h-48 object-cover"
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
      <div className="p-4">
        {/* Name */}
        <h3 className="text-lg font-bold text-white truncate mb-2" title={favorite.name}>
          {favorite.name}
        </h3>

        {/* Status */}
        <div className="flex items-center space-x-2 mb-2">
          <span
            className={`w-2 h-2 rounded-full ${statusColors[favorite.status]}`}
          />
          <span className={`text-sm ${statusTextColors[favorite.status]}`}>
            {favorite.status}
          </span>
        </div>

        {/* Species */}
        <p className="text-gray-400 text-sm">
          <span className="text-gray-500">Species:</span> {favorite.species}
        </p>

        {/* Added date */}
        <p className="text-gray-500 text-xs mt-2">
          Added {new Date(favorite.createdAt).toLocaleDateString()}
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
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
          <span>❤️</span>
          <span>My Favorites</span>
        </h1>
        <p className="text-gray-400">
          {pagination.total} favorite {pagination.total === 1 ? 'character' : 'characters'}
        </p>
      </div>

      {/* Filters */}
      <div className="mb-8 space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <SearchBar
              value={search}
              onChange={handleSearchChange}
              placeholder="Search favorites..."
            />
          </div>
          <div className="flex gap-2">
            {/* Sort by */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'createdAt' | 'name')}
              className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="createdAt">Date Added</option>
              <option value="name">Name</option>
            </select>
            {/* Order */}
            <button
              onClick={() => setOrder(order === 'asc' ? 'desc' : 'asc')}
              className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white hover:bg-gray-700 transition-colors"
              title={order === 'asc' ? 'Ascending' : 'Descending'}
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
          message="Failed to load favorites. Please try again."
          onRetry={() => refetch()}
        />
      ) : favorites.length === 0 ? (
        <div className="text-center py-16">
          <span className="text-6xl mb-4 block">💔</span>
          <h3 className="text-xl font-semibold text-gray-400 mb-2">No favorites yet</h3>
          <p className="text-gray-500 mb-6">
            Start adding characters to your favorites!
          </p>
          <Link
            to="/"
            className="inline-flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <span className="mr-2">🔍</span>
            Browse Characters
          </Link>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
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
          <div className="mt-8">
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
