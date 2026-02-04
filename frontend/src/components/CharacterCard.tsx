import { Link } from 'react-router-dom';
import type { Character, CharacterStatus } from '../types';
import { FavoriteButton } from './FavoriteButton';

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
    <div className="group relative bg-[var(--bg-card)] rounded-xl overflow-hidden card-hover animate-fade-in-up">
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
        
        {/* Status badge */}
        <div className="absolute top-3 left-3">
          <span className={`badge ${character.status === 'Alive' ? 'badge-alive' : character.status === 'Dead' ? 'badge-dead' : 'badge-unknown'}`}>
            <span className={`status-dot ${status.dotClass}`} />
            {status.label}
          </span>
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
        
        <p className="text-sm text-[var(--text-secondary)]">{character.species}</p>
        
        <div className="flex items-center gap-1.5 mt-2 text-[var(--text-muted)]">
          <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span className="text-xs truncate">{character.location.name}</span>
        </div>
      </div>
    </div>
  );
}
