import { Link } from 'react-router-dom';
import type { Character, CharacterStatus } from '../types';
import { FavoriteButton } from './FavoriteButton';
import { IoLocationOutline } from 'react-icons/io5';

interface CharacterCardProps {
  character: Character;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  isToggling?: boolean;
}

const statusConfig: Record<CharacterStatus, { dotClass: string; color: string; label: string }> = {
  Alive: { dotClass: 'status-dot-alive', color: 'var(--status-alive)', label: 'Vivo' },
  Dead: { dotClass: 'status-dot-dead', color: 'var(--status-dead)', label: 'Morto' },
  unknown: { dotClass: 'status-dot-unknown', color: 'var(--status-unknown)', label: 'Desconhecido' },
};

export function CharacterCard({
  character,
  isFavorite,
  onToggleFavorite,
  isToggling = false,
}: CharacterCardProps) {
  const status = statusConfig[character.status];

  return (
    <div className="group relative bg-[var(--bg-card)] rounded-xl overflow-hidden border border-[var(--border-default)] hover:border-[var(--color-primary)]/50 hover:shadow-[0_0_20px_rgba(0,255,136,0.15)] transition-all duration-300 card-hover animate-fade-in-up">
      {/* Image with Link */}
      <Link to={`/character/${character.id}`} className="block relative aspect-square overflow-hidden">
        <img
          src={character.image}
          alt={character.name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
        
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-card)] via-transparent to-transparent opacity-60" />
        
        {/* Status dot only */}
        <div className="absolute top-3 left-3">
          <span className={`status-dot ${status.dotClass}`} style={{ width: '12px', height: '12px' }} />
        </div>
      </Link>
      
      {/* Favorite button */}
      <div className="absolute top-3 right-3 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
        <FavoriteButton
          isFavorite={isFavorite}
          onToggle={onToggleFavorite}
          isLoading={isToggling}
          size="sm"
        />
      </div>

      {/* Content */}
      <div className="p-4">
        <Link to={`/character/${character.id}`}>
          <h3 className="text-base font-semibold text-[var(--text-primary)] truncate mb-1 hover:text-[var(--color-primary)] transition-colors">
            {character.name}
          </h3>
        </Link>
        
        {/* Status text */}
        <div className="flex items-center gap-2 mb-2">
          <span className={`status-dot ${status.dotClass}`} />
          <span className="text-sm font-medium" style={{ color: status.color }}>
            {status.label}
          </span>
        </div>
        
        <p className="text-sm text-[var(--text-secondary)] mb-2">{character.species}</p>
        
        <div className="flex items-center gap-1.5 text-[var(--text-muted)]">
          <IoLocationOutline className="w-3.5 h-3.5 flex-shrink-0" />
          <span className="text-xs truncate">{character.location.name}</span>
        </div>
      </div>
    </div>
  );
}
