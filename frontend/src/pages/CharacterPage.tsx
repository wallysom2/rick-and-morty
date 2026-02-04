import { useParams, Link, useNavigate } from 'react-router-dom';
import { useCharacter, useFavoriteIds, useToggleFavorite, useMultipleEpisodes } from '../hooks';
import { Breadcrumb } from '../components/Breadcrumb';
import { TerminalCard } from '../components/TerminalCard';
import { getCharacterDescription } from '../data/character-descriptions';

export function CharacterPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const characterId = Number(id);
  
  const { data: character, isLoading, isError } = useCharacter(characterId);
  const { data: favoriteIds = [] } = useFavoriteIds();
  const { toggle, isLoading: isToggling } = useToggleFavorite();
  
  const isFavorite = favoriteIds.includes(characterId);
  
  // Get episode IDs from URLs
  const episodeIds = character?.episode?.map(url => {
    const match = url.match(/\/episode\/(\d+)/);
    return match ? Number(match[1]) : 0;
  }).filter(id => id > 0) || [];
  
  const { data: episodes = [] } = useMultipleEpisodes(episodeIds);

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="h-6 w-48 bg-[var(--bg-card)] rounded mb-8" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="aspect-square bg-[var(--bg-card)] rounded-xl" />
            <div className="space-y-4">
              <div className="h-12 w-3/4 bg-[var(--bg-card)] rounded" />
              <div className="h-24 bg-[var(--bg-card)] rounded" />
              <div className="h-64 bg-[var(--bg-card)] rounded" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isError || !character) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-16">
          <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-4">Personagem nao encontrado</h2>
          <p className="text-[var(--text-secondary)] mb-6">O personagem que voce procura nao existe nesta dimensao.</p>
          <Link to="/" className="btn btn-primary">Voltar aos Personagens</Link>
        </div>
      </div>
    );
  }

  const description = getCharacterDescription(character.id, character.species, character.status);
  
  // Split name for styling (first word white, rest green)
  const nameParts = character.name.split(' ');
  const firstName = nameParts[0];
  const lastName = nameParts.slice(1).join(' ');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumb items={[
        { label: 'Personagens', href: '/' },
        { label: character.name }
      ]} />
      
      {/* Add spacing */}
      <div className="mt-12" />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-start">
        {/* Left Column - Image with dashed border only */}
        <div className="relative group">
          {/* Single dashed border - green */}
          <div 
            className="absolute -inset-4 border-2 border-dashed border-[var(--color-primary)]/30 rounded-3xl"
          />

          {/* Image container with glow */}
          <div className="relative overflow-hidden rounded-3xl portal-glow-intense">
            <img
              src={character.image}
              alt={character.name}
              className="w-full aspect-square object-cover transition-transform duration-700 group-hover:scale-105"
            />
            
            {/* Overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-main)] via-transparent to-transparent opacity-60" />
            
            {/* ID Badge */}
            <div className="absolute bottom-6 left-6 px-4 py-2 rounded-full bg-[var(--bg-card)]/80 backdrop-blur-sm border border-[var(--border-default)] font-mono text-xl text-[var(--text-primary)]">
              #{character.id}
            </div>
          </div>
        </div>
        
        {/* Right Column - Info */}
        <div className="space-y-6">
          {/* Name */}
          <h1 className="text-4xl sm:text-5xl font-bold">
            <span className="text-[var(--text-primary)]">{firstName}</span>
            {lastName && <span className="text-[var(--color-primary)]"> {lastName}</span>}
          </h1>
          
          {/* Description */}
          <p className="description-block">
            {description}
          </p>
          
          {/* Terminal Card with Info */}
          <TerminalCard>
            <div className="info-row">
              <div className="info-item">
                <span className="info-label">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  STATUS
                </span>
                <span className="info-value" style={{ color: character.status === 'Alive' ? 'var(--status-alive)' : character.status === 'Dead' ? 'var(--status-dead)' : 'var(--text-secondary)' }}>
                  {character.status === 'Alive' ? 'Vivo' : character.status === 'Dead' ? 'Morto' : 'Desconhecido'}
                </span>
              </div>
              <div className="info-item">
                <span className="info-label">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                  </svg>
                  ESPECIE
                </span>
                <span className="info-value">{character.species}</span>
              </div>
            </div>
            
            <div className="info-row">
              <div className="info-item">
                <span className="info-label">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  GENERO
                </span>
                <span className="info-value">{character.gender}</span>
              </div>
              <div className="info-item">
                <span className="info-label">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  ORIGEM
                </span>
                <span className="info-value">{character.origin.name}</span>
              </div>
            </div>
            
            <div className="info-row full-width">
              <div className="info-item">
                <span className="info-label">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  ULTIMA LOCALIZACAO
                </span>
                <span className="info-value flex items-center gap-2">
                  {character.location.name}
                  <svg className="w-4 h-4 text-[var(--color-primary)]" fill="currentColor" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="4" />
                  </svg>
                </span>
              </div>
            </div>
          </TerminalCard>
          
          {/* Episodes appeared */}
          {episodes.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-[var(--text-muted)] uppercase tracking-wider">
                Aparece em {character.episode.length} episodio{character.episode.length !== 1 ? 's' : ''}
              </h3>
              <div className="flex flex-wrap gap-2">
                {episodes.map(ep => (
                  <Link
                    key={ep.id}
                    to={`/episodes/${ep.id}`}
                    className="px-3 py-1.5 text-sm bg-[var(--bg-card)] hover:bg-[var(--bg-card-hover)] border border-[var(--border-default)] rounded-lg transition-colors"
                  >
                    {ep.episode}
                  </Link>
                ))}
                {character.episode.length > 5 && (
                  <span className="px-3 py-1.5 text-sm text-[var(--text-muted)]">
                    +{character.episode.length - 5} mais
                  </span>
                )}
              </div>
            </div>
          )}
          
          {/* Actions */}
          <div className="flex items-center gap-3 pt-4">
            <button
              onClick={() => navigate(-1)}
              className="btn btn-primary flex-1 sm:flex-none"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Voltar ao Portal
            </button>
            
            <button
              onClick={() => toggle(characterId, isFavorite)}
              disabled={isToggling}
              className={`btn btn-icon ${isFavorite ? 'bg-[var(--status-dead)]/20 border-[var(--status-dead)]' : ''}`}
              title={isFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
            >
              <svg 
                className="w-5 h-5"
                fill={isFavorite ? 'var(--status-dead)' : 'none'}
                stroke={isFavorite ? 'var(--status-dead)' : 'currentColor'}
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
