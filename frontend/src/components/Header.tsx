import { Link, useLocation } from 'react-router-dom';
import { useFavoriteIds } from '../hooks';

const navLinks = [
  { path: '/', label: 'Personagens', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' },
  { path: '/episodes', label: 'Episodios', icon: 'M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z' },
  { path: '/locations', label: 'Locais', icon: 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z' },
];

export function Header() {
  const location = useLocation();
  const { data: favoriteIds = [] } = useFavoriteIds();

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/' || location.pathname.startsWith('/character/');
    return location.pathname.startsWith(path);
  };

  return (
    <header className="sticky top-0 z-50 bg-[var(--bg-main)] border-b border-[var(--border-default)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            {/* Flask Icon */}
            <div className="relative w-8 h-8 flex items-center justify-center">
              <svg 
                className="w-7 h-7 text-[var(--color-primary)] group-hover:animate-float transition-transform" 
                viewBox="0 0 24 24" 
                fill="currentColor"
              >
                <path d="M9 3v2H8v2h1v1.5a7 7 0 00-3 5.5v4a3 3 0 003 3h6a3 3 0 003-3v-4a7 7 0 00-3-5.5V7h1V5h-1V3H9zm2 4V5h2v2h-2zm-1 2h4v1.5c1.5.8 2.5 2.2 3 3.5H7c.5-1.3 1.5-2.7 3-3.5V9zm-3 6h10v3a1 1 0 01-1 1H8a1 1 0 01-1-1v-3z"/>
              </svg>
            </div>
            
            <span className="text-lg font-bold text-[var(--text-primary)] hidden sm:block">
              Wubba Lubba <span className="text-[var(--color-primary)]">Dub Dub</span> DB
            </span>
          </Link>

          {/* Navigation */}
          <nav className="flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`
                  flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium
                  transition-all duration-200
                  ${isActive(link.path)
                    ? 'text-[var(--color-primary)] bg-[var(--color-primary)]/10'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card)]'
                  }
                `}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={link.icon} />
                </svg>
                <span className="hidden md:block">{link.label}</span>
              </Link>
            ))}
            
            {/* Favorites Link */}
            <Link
              to="/favorites"
              className={`
                flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium
                transition-all duration-200 ml-1
                ${isActive('/favorites')
                  ? 'text-[var(--status-dead)] bg-[var(--status-dead)]/10'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card)]'
                }
              `}
            >
              <svg 
                className="w-5 h-5" 
                fill={isActive('/favorites') ? 'currentColor' : 'none'} 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              {favoriteIds.length > 0 && (
                <span className="flex items-center justify-center min-w-[20px] h-5 px-1.5 text-xs font-bold bg-[var(--status-dead)] text-white rounded-full">
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
