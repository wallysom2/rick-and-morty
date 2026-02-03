import { Link, useLocation } from 'react-router-dom';

export function Header() {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="bg-gray-800 border-b border-gray-700 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <span className="text-2xl">🛸</span>
            <span className="text-xl font-bold text-green-400">
              Rick & Morty
            </span>
          </Link>

          {/* Navigation */}
          <nav className="flex space-x-4">
            <Link
              to="/"
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                isActive('/')
                  ? 'bg-green-600 text-white'
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              }`}
            >
              Characters
            </Link>
            <Link
              to="/favorites"
              className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2 ${
                isActive('/favorites')
                  ? 'bg-yellow-600 text-white'
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              }`}
            >
              <span>Favorites</span>
              <span className="text-lg">❤️</span>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
