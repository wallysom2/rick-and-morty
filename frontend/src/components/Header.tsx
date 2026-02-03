import { Link, useLocation } from 'react-router-dom';
import { useFavoriteIds } from '../hooks';

export function Header() {
  const location = useLocation();
  const { data: favoriteIds = [] } = useFavoriteIds();

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="glass sticky top-0 z-50 border-b border-[var(--portal-green)]/20">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            {/* Portal Icon */}
            <div className="relative w-10 h-10 sm:w-12 sm:h-12">
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[var(--portal-green)] to-[var(--portal-cyan)] animate-portal-spin opacity-50"></div>
              <div className="absolute inset-1 rounded-full bg-gradient-to-br from-[var(--portal-green)] to-[var(--portal-green-dark)] flex items-center justify-center">
                <div className="w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-[var(--space-black)]"></div>
              </div>
              <div className="absolute inset-0 rounded-full group-hover:animate-portal-pulse"></div>
            </div>
            
            {/* Title */}
            <div className="flex flex-col">
              <span className="font-title text-xl sm:text-3xl text-[var(--portal-green)] text-glow-green leading-tight">
                Rick & Morty
              </span>
              <span className="text-[10px] sm:text-xs text-[var(--text-muted)] tracking-widest uppercase">
                Catálogo Multiversal
              </span>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="flex space-x-2 sm:space-x-3">
            <Link
              to="/"
              className={`
                relative px-3 sm:px-5 py-2 sm:py-2.5 rounded-xl text-sm sm:text-base font-semibold
                transition-all duration-300 overflow-hidden
                ${isActive('/')
                  ? 'bg-gradient-to-r from-[var(--portal-green)] to-[var(--portal-green-dark)] text-[var(--space-black)] glow-green'
                  : 'bg-[var(--space-medium)] text-[var(--text-secondary)] hover:text-[var(--portal-green)] hover:bg-[var(--space-light)] border border-[var(--space-lighter)]/50'
                }
              `}
            >
              <span className="relative z-10 flex items-center gap-1.5 sm:gap-2">
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <span className="hidden sm:inline">Personagens</span>
              </span>
            </Link>
            
            <Link
              to="/favorites"
              className={`
                relative px-3 sm:px-5 py-2 sm:py-2.5 rounded-xl text-sm sm:text-base font-semibold
                transition-all duration-300 overflow-hidden
                ${isActive('/favorites')
                  ? 'bg-gradient-to-r from-[var(--dimension-pink)] to-[var(--status-dead)] text-white'
                  : 'bg-[var(--space-medium)] text-[var(--text-secondary)] hover:text-[var(--dimension-pink)] hover:bg-[var(--space-light)] border border-[var(--space-lighter)]/50'
                }
              `}
              style={isActive('/favorites') ? { boxShadow: '0 0 20px rgba(236, 72, 153, 0.5)' } : {}}
            >
              <span className="relative z-10 flex items-center gap-1.5 sm:gap-2">
                <svg className={`w-4 h-4 sm:w-5 sm:h-5 ${isActive('/favorites') ? 'animate-pulse' : ''}`} fill={isActive('/favorites') ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                <span className="hidden sm:inline">Favoritos</span>
                {favoriteIds.length > 0 && (
                  <span className="flex items-center justify-center min-w-[20px] h-5 px-1.5 text-xs font-bold bg-[var(--status-dead)] text-white rounded-full animate-pulse">
                    {favoriteIds.length > 99 ? '99+' : favoriteIds.length}
                  </span>
                )}
              </span>
            </Link>
          </nav>
        </div>
      </div>
      
      {/* Bottom glow line */}
      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[var(--portal-green)] to-transparent opacity-50"></div>
    </header>
  );
}
