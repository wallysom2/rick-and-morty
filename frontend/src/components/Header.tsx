import { Link, useLocation } from 'react-router-dom';
import { useFavoriteIds } from '../hooks';
import logo from '../assets/logo.svg';

const navLinks = [
  {
    path: '/', label: 'Personagens', icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    )
  },
  {
    path: '/episodes', label: 'Episódios', icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
      </svg>
    )
  },
  {
    path: '/locations', label: 'Locais', icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    )
  },
];

export function Header() {
  const location = useLocation();
  const { data: favoriteIds = [] } = useFavoriteIds();

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/' || location.pathname.startsWith('/character/');
    return location.pathname.startsWith(path);
  };

  return (
    <header className="sticky top-0 z-50">
      {/* Glassmorphism background with terminal border */}
      <div className="absolute inset-0 bg-[var(--bg-main)]/80 backdrop-blur-xl border-b border-[var(--border-default)] shadow-[0_4px_30px_rgba(0,0,0,0.2)]" />

      {/* Top terminal decoration line */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[var(--color-primary)] via-[var(--portal-cyan)] to-[var(--dimension-pink)] opacity-60" />

      <div className="relative max-w-7xl mx-auto px-4 px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo Section */}
          <Link to="/" className="flex items-center gap-4 group">
            <div className="relative">
              <img
                src={logo}
                alt="Wubba Lubba Dub Dub DB"
                className="h-10 sm:h-12 w-auto relative z-10 transition-transform duration-300 group-hover:scale-105"
              />
            </div>
          </Link>

          {/* Navigation - Desktop */}
          <nav className="hidden md:flex items-center gap-2">
            <div className="flex items-center p-1.5 bg-[var(--bg-terminal)] rounded-2xl border border-[var(--border-default)] shadow-sm">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`
                      relative px-5 py-2.5 rounded-xl text-sm font-bold tracking-wide transition-all duration-300 flex items-center gap-2
                      ${isActive(link.path)
                      ? 'text-[var(--bg-main)] shadow-[0_0_20px_rgba(0,255,136,0.3)]'
                      : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)]'
                    }
                    `}
                >
                  {isActive(link.path) && (
                    <div className="absolute inset-0 bg-gradient-to-r from-[var(--portal-green)] to-[var(--portal-cyan)] rounded-xl" />
                  )}
                  <span className="relative z-10 flex items-center gap-2">
                    {isActive(link.path) ? (
                      <span className="animate-pulse">_</span>
                    ) : null}
                    {link.label}
                  </span>
                </Link>
              ))}
            </div>

            {/* Favorites Link */}
            <Link
              to="/favorites"
              className={`
                group relative ml-3 p-3 rounded-2xl border transition-all duration-300
                ${isActive('/favorites')
                  ? 'bg-[var(--bg-terminal)] border-[var(--dimension-pink)] shadow-[0_0_15px_rgba(236,72,153,0.2)]'
                  : 'bg-[var(--bg-terminal)] border-[var(--border-default)] hover:border-[var(--text-muted)] hover:bg-[var(--bg-elevated)]'
                }
              `}
              aria-label="Meus Favoritos"
            >
              <div className="relative">
                <svg
                  className={`w-5 h-5 transition-colors duration-300 ${isActive('/favorites') ? 'text-[var(--dimension-pink)] fill-[var(--dimension-pink)]' : 'text-[var(--text-secondary)] group-hover:text-[var(--dimension-pink)]'}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>

                {favoriteIds.length > 0 && (
                  <span className="absolute -top-4 -right-4 flex items-center justify-center min-w-[20px] h-5 px-1.5 text-[10px] font-bold bg-[var(--dimension-pink)] text-white rounded-full shadow-sm border-2 border-[var(--bg-main)] animate-heart">
                    {favoriteIds.length > 99 ? '99+' : favoriteIds.length}
                  </span>
                )}
              </div>
            </Link>
          </nav>

          {/* Mobile Navigation */}
          <nav className="md:hidden flex items-center gap-1">
            <div className="flex items-center gap-1 bg-[var(--bg-terminal)] p-1.5 rounded-xl border border-[var(--border-default)]">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`
                      p-2.5 rounded-lg transition-all duration-200
                      ${isActive(link.path)
                      ? 'text-[var(--portal-green)] bg-[var(--bg-elevated)] shadow-sm'
                      : 'text-[var(--text-muted)]'
                    }
                    `}
                  aria-label={link.label}
                >
                  {link.icon}
                </Link>
              ))}
              <div className="w-px h-6 bg-[var(--border-default)] mx-1" />
              <Link
                to="/favorites"
                className={`
                    p-2.5 rounded-lg transition-all duration-200 relative
                    ${isActive('/favorites')
                    ? 'text-[var(--dimension-pink)] bg-[var(--bg-elevated)] shadow-sm'
                    : 'text-[var(--text-muted)]'
                  }
                  `}
                aria-label="Favoritos"
              >
                <svg className="w-5 h-5" fill={isActive('/favorites') ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                {favoriteIds.length > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[var(--dimension-pink)] rounded-full animate-pulse" />
                )}
              </Link>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}

