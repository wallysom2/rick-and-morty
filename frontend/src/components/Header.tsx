import { Link, useLocation } from 'react-router-dom';
import { useFavoriteIds } from '../hooks';

export function Header() {
  const location = useLocation();
  const { data: favoriteIds = [] } = useFavoriteIds();

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="bg-gray-800 border-b border-gray-700 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-xl sm:text-2xl">🛸</span>
            <span className="text-base sm:text-xl font-bold text-green-400">
              Rick & Morty
            </span>
          </Link>

          {/* Navigation */}
          <nav className="flex space-x-1 sm:space-x-2">
            <Link
              to="/"
              className={`px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg text-sm sm:text-base font-medium transition-colors ${
                isActive('/')
                  ? 'bg-green-600 text-white'
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              }`}
            >
              Personagens
            </Link>
            <Link
              to="/favorites"
              className={`px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg text-sm sm:text-base font-medium transition-colors flex items-center space-x-1 sm:space-x-2 ${
                isActive('/favorites')
                  ? 'bg-yellow-600 text-white'
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              }`}
            >
              <span className="hidden xs:inline">Favoritos</span>
              <span className="text-base sm:text-lg">❤️</span>
              {favoriteIds.length > 0 && (
                <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {favoriteIds.length > 99 ? '99+' : favoriteIds.length}
                </span>
              )}
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
