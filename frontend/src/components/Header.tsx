import { Link, useLocation } from 'react-router-dom';
import { useFavoriteIds } from '../hooks';
import logo from '../assets/logo.svg';

const navLinks = [
  { path: '/', label: 'PERSONAGENS', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' },
  { path: '/episodes', label: 'EPISODIOS', icon: 'M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z' },
  { path: '/locations', label: 'LOCAIS', icon: 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z' },
];

export function Header() {
  const location = useLocation();
  const { data: favoriteIds = [] } = useFavoriteIds();

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/' || location.pathname.startsWith('/character/');
    return location.pathname.startsWith(path);
  };

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-[var(--bg-main)]/85 border-b border-[var(--border-default)] supports-[backdrop-filter]:bg-[var(--bg-main)]/60">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group shrink-0">
            <img 
              src={logo} 
              alt="Rick and Morty DB" 
              className="h-8 sm:h-10 md:h-12 w-auto object-contain opacity-90 group-hover:opacity-100 transition-opacity duration-300" 
            />
          </Link>

          {/* Navigation */}
          <nav className="flex items-center gap-1 sm:gap-3">
            {navLinks.map((link) => {
              const active = isActive(link.path);
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`
                    relative flex items-center gap-2 px-2 sm:px-4 py-1.5 sm:py-2 rounded-md text-xs sm:text-sm font-mono tracking-wide transition-all duration-200 border
                    ${active
                      ? 'text-[var(--color-primary)] bg-[var(--color-primary)]/5 border-[var(--color-primary)]/30 shadow-[0_0_15px_-5px_var(--color-primary)]'
                      : 'text-[var(--text-secondary)] border-transparent hover:border-[var(--border-default)] hover:bg-[var(--bg-card)] hover:text-[var(--text-primary)]'
                    }
                  `}
                >
                  <svg className={`w-5 h-5 sm:w-4 sm:h-4 ${active ? 'animate-pulse' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={link.icon} />
                  </svg>
                  <span className="hidden md:block">{link.label}</span>
                  
                  {/* Active Indicator Dot for Console Feel */}
                  {active && (
                    <span className="absolute -bottom-[1px] left-1/2 -translate-x-1/2 w-1/2 h-[2px] bg-[var(--color-primary)] blur-[1px]" />
                  )}
                </Link>
              );
            })}
            
            {/* Divider */}
            <div className="h-5 sm:h-6 w-px bg-[var(--border-default)] mx-0.5 sm:mx-1" />

            {/* Favorites Link */}
            <Link
              to="/favorites"
              className={`
                group flex items-center gap-2 px-2 sm:px-4 py-1.5 sm:py-2 rounded-md text-xs sm:text-sm font-mono tracking-wide transition-all duration-200 border
                ${isActive('/favorites')
                  ? 'text-[var(--status-dead)] bg-[var(--status-dead)]/5 border-[var(--status-dead)]/30 shadow-[0_0_15px_-5px_var(--status-dead)]'
                  : 'text-[var(--text-secondary)] border-transparent hover:border-[var(--border-default)] hover:bg-[var(--bg-card)] hover:text-[var(--text-primary)]'
                }
              `}
            >
              <svg 
                className="w-5 h-5 sm:w-4 sm:h-4" 
                fill={isActive('/favorites') ? 'currentColor' : 'none'} 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              <span className="hidden md:block">FAVORITOS</span>
              
              {/* Data Counter Badge style */}
              {favoriteIds.length > 0 && (
                <span className={`
                  ml-1 px-1.5 py-0.5 text-[10px] rounded border
                  ${isActive('/favorites')
                    ? 'bg-[var(--status-dead)] text-[var(--bg-main)] border-[var(--status-dead)] font-bold'
                    : 'bg-[var(--bg-main)] text-[var(--status-dead)] border-[var(--border-default)] group-hover:border-[var(--status-dead)]'
                  }
                `}>
                  {favoriteIds.length}
                </span>
              )}
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
