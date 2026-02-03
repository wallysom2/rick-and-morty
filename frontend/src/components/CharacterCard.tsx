import type { Character, CharacterStatus } from '../types';
import { FavoriteButton } from './FavoriteButton';

interface CharacterCardProps {
  character: Character;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  isToggling?: boolean;
}

const statusConfig: Record<CharacterStatus, { 
  color: string; 
  glow: string; 
  label: string;
  bgGlow: string;
}> = {
  Alive: { 
    color: 'bg-[var(--status-alive)]', 
    glow: 'status-alive',
    label: 'Vivo',
    bgGlow: 'rgba(0, 255, 136, 0.1)'
  },
  Dead: { 
    color: 'bg-[var(--status-dead)]', 
    glow: 'status-dead',
    label: 'Morto',
    bgGlow: 'rgba(255, 71, 87, 0.1)'
  },
  unknown: { 
    color: 'bg-[var(--status-unknown)]', 
    glow: 'status-unknown',
    label: 'Desconhecido',
    bgGlow: 'rgba(160, 160, 160, 0.1)'
  },
};

export function CharacterCard({
  character,
  isFavorite,
  onToggleFavorite,
  isToggling = false,
}: CharacterCardProps) {
  const status = statusConfig[character.status];

  return (
    <div 
      className="group relative rounded-2xl overflow-hidden card-hover animate-slide-up"
      style={{ 
        background: `linear-gradient(180deg, var(--space-medium) 0%, var(--space-dark) 100%)`,
        animationDelay: `${Math.random() * 0.2}s`
      }}
    >
      {/* Glow border on hover */}
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background: 'linear-gradient(135deg, var(--portal-green), var(--portal-cyan), var(--dimension-purple))',
          padding: '2px',
          mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          maskComposite: 'xor',
          WebkitMaskComposite: 'xor'
        }}
      />
      
      {/* Status color accent at top */}
      <div 
        className="absolute top-0 left-0 right-0 h-1"
        style={{ 
          background: character.status === 'Alive' 
            ? 'linear-gradient(90deg, var(--status-alive), var(--portal-cyan))' 
            : character.status === 'Dead'
            ? 'linear-gradient(90deg, var(--status-dead), var(--dimension-pink))'
            : 'linear-gradient(90deg, var(--status-unknown), var(--space-lighter))'
        }}
      />

      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden">
        <img
          src={character.image}
          alt={character.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
        />
        
        {/* Image overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--space-dark)] via-transparent to-transparent opacity-60" />
        
        {/* Dimensional portal effect on hover */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-30 transition-opacity duration-500 pointer-events-none"
          style={{
            background: 'radial-gradient(circle at center, var(--portal-green) 0%, transparent 70%)'
          }}
        />
        
        {/* Favorite button */}
        <div className="absolute top-3 right-3 sm:opacity-0 sm:group-hover:opacity-100 transition-all duration-300 transform sm:translate-y-2 sm:group-hover:translate-y-0">
          <FavoriteButton
            isFavorite={isFavorite}
            onToggle={onToggleFavorite}
            isLoading={isToggling}
            size="md"
          />
        </div>
        
        {/* Character ID badge */}
        <div className="absolute top-3 left-3 px-2 py-1 rounded-lg bg-[var(--space-black)]/70 backdrop-blur-sm border border-[var(--portal-green)]/30">
          <span className="text-xs font-mono text-[var(--portal-green)]">#{character.id}</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-3 sm:p-4 relative">
        {/* Background glow based on status */}
        <div 
          className="absolute inset-0 opacity-30 pointer-events-none"
          style={{ background: `radial-gradient(ellipse at bottom, ${status.bgGlow} 0%, transparent 70%)` }}
        />
        
        {/* Name */}
        <h3 
          className="relative text-base sm:text-lg font-bold text-white truncate mb-2 group-hover:text-[var(--portal-green)] transition-colors duration-300" 
          title={character.name}
        >
          {character.name}
        </h3>

        {/* Status with glow */}
        <div className="flex items-center space-x-2 mb-2">
          <span className={`w-2.5 h-2.5 rounded-full ${status.glow}`} />
          <span className="text-xs sm:text-sm font-medium" style={{ 
            color: character.status === 'Alive' ? 'var(--status-alive)' 
              : character.status === 'Dead' ? 'var(--status-dead)' 
              : 'var(--status-unknown)' 
          }}>
            {status.label}
          </span>
          <span className="text-[var(--text-muted)]">•</span>
          <span className="text-xs sm:text-sm text-[var(--text-secondary)]">{character.species}</span>
        </div>

        {/* Location with icon */}
        <div className="flex items-center gap-1.5 text-[var(--text-muted)]">
          <svg className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span className="text-xs sm:text-sm truncate" title={character.location.name}>
            {character.location.name}
          </span>
        </div>
      </div>
    </div>
  );
}
