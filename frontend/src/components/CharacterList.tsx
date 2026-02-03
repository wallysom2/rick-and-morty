import type { Character } from '../types';
import { CharacterCard } from './CharacterCard';
import { useToggleFavorite } from '../hooks/useFavorites';

interface CharacterListProps {
  characters: Character[];
  favoriteIds: number[];
}

export function CharacterList({ characters, favoriteIds }: CharacterListProps) {
  const { toggle, isLoading } = useToggleFavorite();

  if (characters.length === 0) {
    return (
      <div className="text-center py-12">
        <span className="text-6xl mb-4 block">🔍</span>
        <h3 className="text-xl font-semibold text-gray-400">No characters found</h3>
        <p className="text-gray-500 mt-2">Try adjusting your search or filters</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {characters.map((character) => {
        const isFavorite = favoriteIds.includes(character.id);
        return (
          <CharacterCard
            key={character.id}
            character={character}
            isFavorite={isFavorite}
            onToggleFavorite={() => toggle(character.id, isFavorite)}
            isToggling={isLoading}
          />
        );
      })}
    </div>
  );
}
