import type { Character, CharacterStatus } from '../types';
import { FavoriteButton } from './FavoriteButton';

interface CharacterCardProps {
  character: Character;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  isToggling?: boolean;
}

const statusColors: Record<CharacterStatus, string> = {
  Alive: 'bg-green-500',
  Dead: 'bg-red-500',
  unknown: 'bg-gray-500',
};

const statusTextColors: Record<CharacterStatus, string> = {
  Alive: 'text-green-400',
  Dead: 'text-red-400',
  unknown: 'text-gray-400',
};

const statusLabels: Record<CharacterStatus, string> = {
  Alive: 'Vivo',
  Dead: 'Morto',
  unknown: 'Desconhecido',
};

export function CharacterCard({
  character,
  isFavorite,
  onToggleFavorite,
  isToggling = false,
}: CharacterCardProps) {
  return (
    <div className="bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 group">
      {/* Image */}
      <div className="relative aspect-square">
        <img
          src={character.image}
          alt={character.name}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        {/* Favorite button - always visible on mobile, hover on desktop */}
        <div className="absolute top-2 right-2 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
          <FavoriteButton
            isFavorite={isFavorite}
            onToggle={onToggleFavorite}
            isLoading={isToggling}
            size="md"
          />
        </div>
      </div>

      {/* Content */}
      <div className="p-3 sm:p-4">
        {/* Name */}
        <h3 className="text-base sm:text-lg font-bold text-white truncate mb-1 sm:mb-2" title={character.name}>
          {character.name}
        </h3>

        {/* Status */}
        <div className="flex items-center space-x-2 mb-1 sm:mb-2">
          <span
            className={`w-2 h-2 rounded-full ${statusColors[character.status]}`}
          />
          <span className={`text-xs sm:text-sm ${statusTextColors[character.status]}`}>
            {statusLabels[character.status]}
          </span>
        </div>

        {/* Species */}
        <p className="text-gray-400 text-xs sm:text-sm">
          <span className="text-gray-500">Especie:</span> {character.species}
        </p>

        {/* Location - hidden on very small screens */}
        <p className="text-gray-400 text-xs sm:text-sm truncate mt-1 hidden xs:block" title={character.location.name}>
          <span className="text-gray-500">Local:</span> {character.location.name}
        </p>
      </div>
    </div>
  );
}
