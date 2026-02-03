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
        <span className="text-5xl sm:text-6xl mb-4 block">🔍</span>
        <h3 className="text-lg sm:text-xl font-semibold text-gray-400">Nenhum personagem encontrado</h3>
        <p className="text-sm sm:text-base text-gray-500 mt-2">Tente ajustar sua busca ou filtros</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
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
