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
      <div className="flex flex-col items-center justify-center py-12 sm:py-16">
        {/* Empty state illustration */}
        <div className="relative mb-6">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full flex items-center justify-center"
            style={{
              background: 'linear-gradient(135deg, var(--space-medium), var(--space-dark))',
              boxShadow: '0 0 30px rgba(151, 206, 76, 0.2)'
            }}
          >
            <svg className="w-10 h-10 sm:w-12 sm:h-12 text-[var(--portal-green)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
        
        <h3 className="text-lg sm:text-xl font-bold text-[var(--text-primary)] mb-2">
          Nenhum personagem encontrado
        </h3>
        <p className="text-sm sm:text-base text-[var(--text-muted)] text-center">
          Tente buscar por outro nome ou altere os filtros
        </p>
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
