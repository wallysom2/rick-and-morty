import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useCharacter, useFavoriteIds, useToggleFavorite, useMultipleEpisodes } from '../hooks';
import { Breadcrumb } from '../components/Breadcrumb';
import { TerminalCard } from '../components/TerminalCard';
import { getCharacterDescription } from '../data/character-descriptions';
import { 
  IoPulseOutline, 
  IoPersonOutline, 
  IoMaleFemaleOutline, 
  IoPlanetOutline, 
  IoLocationOutline, 
  IoChevronDownOutline, 
  IoArrowBackOutline,
  IoHeartOutline,
  IoHeart
} from 'react-icons/io5';

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

  const [expandedSeasons, setExpandedSeasons] = useState<Record<string, boolean>>({});

  const toggleSeason = (season: string) => {
    setExpandedSeasons(prev => ({
      ...prev,
      [season]: !prev[season]
    }));
  };

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


  // Group episodes by season
  const episodesBySeason = episodes.reduce((acc, ep) => {
    const match = ep.episode.match(/S(\d+)E\d+/);
    const season = match ? `Temporada ${parseInt(match[1])}` : 'Outros';
    
    if (!acc[season]) {
      acc[season] = [];
    }
    acc[season].push(ep);
    return acc;
  }, {} as Record<string, typeof episodes>);

  // Sort seasons
  const sortedSeasons = Object.keys(episodesBySeason).sort((a, b) => {
    if (a === 'Outros') return 1;
    if (b === 'Outros') return -1;
    return a.localeCompare(b, undefined, { numeric: true });
  });

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
                  <IoPulseOutline className="w-4 h-4" />
                  STATUS
                </span>
                <span className="info-value" style={{ color: character.status === 'Alive' ? 'var(--status-alive)' : character.status === 'Dead' ? 'var(--status-dead)' : 'var(--text-secondary)' }}>
                  {character.status === 'Alive' ? 'Vivo' : character.status === 'Dead' ? 'Morto' : 'Desconhecido'}
                </span>
              </div>
              <div className="info-item">
                <span className="info-label">
                  <IoPersonOutline className="w-4 h-4" />
                  ESPECIE
                </span>
                <span className="info-value">{character.species}</span>
              </div>
            </div>
            
            <div className="info-row">
              <div className="info-item">
                <span className="info-label">
                  <IoMaleFemaleOutline className="w-4 h-4" />
                  GENERO
                </span>
                <span className="info-value">{character.gender}</span>
              </div>
              <div className="info-item">
                <span className="info-label">
                  <IoPlanetOutline className="w-4 h-4" />
                  ORIGEM
                </span>
                <span className="info-value">{character.origin.name}</span>
              </div>
            </div>
            
            <div className="info-row full-width">
              <div className="info-item">
                <span className="info-label">
                  <IoLocationOutline className="w-4 h-4" />
                  ULTIMA LOCALIZACAO
                </span>
                <span className="info-value flex items-center gap-2">
                  {character.location.name}
                  <div className="w-2 h-2 rounded-full bg-[var(--color-primary)]" />
                </span>
              </div>
            </div>
          </TerminalCard>
          
          {/* Episodes appeared */}
          {episodes.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-[var(--text-muted)] uppercase tracking-wider">
                  Aparece em {character.episode.length} episodio{character.episode.length !== 1 ? 's' : ''}
                </h3>
              </div>
              
              <div className="space-y-3">
                {sortedSeasons.map(season => {
                  const isExpanded = expandedSeasons[season];
                  const seasonEpisodes = episodesBySeason[season];
                  
                  return (
                    <div key={season} className={`
                      transition-all duration-200 border rounded-lg overflow-hidden
                      ${isExpanded 
                        ? 'bg-[var(--bg-card)] border-[var(--color-primary)]/30 shadow-lg shadow-[var(--color-primary)]/5' 
                        : 'bg-[var(--bg-card)]/50 border-[var(--border-default)] hover:border-[var(--color-primary)]/50 hover:bg-[var(--bg-card)]'
                      }
                    `}>
                      <button
                        onClick={() => toggleSeason(season)}
                        className="w-full flex items-center justify-between p-3"
                      >
                        <div className="flex items-center gap-3">
                          <span className={`text-sm font-medium transition-colors ${isExpanded ? 'text-[var(--color-primary)]' : 'text-[var(--text-primary)]'}`}>
                            {season}
                          </span>
                          <span className="text-xs text-[var(--text-secondary)] bg-[var(--bg-main)] px-2 py-0.5 rounded border border-[var(--border-default)]">
                            {seasonEpisodes.length} eps
                          </span>
                        </div>
                        <IoChevronDownOutline 
                          className={`w-4 h-4 text-[var(--text-secondary)] transition-transform duration-200 ${isExpanded ? 'rotate-180 text-[var(--color-primary)]' : ''}`} 
                        />
                      </button>
                      
                      {isExpanded && (
                        <div className="px-3 pb-3 pt-1">
                          <div className="grid grid-cols-4 sm:grid-cols-5 gap-2 animate-in fade-in slide-in-from-top-1 duration-200">
                            {seasonEpisodes.map(ep => (
                              <Link
                                key={ep.id}
                                to={`/episodes/${ep.id}`}
                                className="px-2 py-1.5 text-xs text-center bg-[var(--bg-main)] hover:bg-[var(--bg-card-hover)] border border-[var(--border-default)] hover:border-[var(--color-primary)] hover:shadow-[0_0_10px_rgba(151,206,76,0.3)] rounded transition-all duration-200"
                                title={`${ep.episode}: ${ep.name}`}
                              >
                                {ep.episode}
                              </Link>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          
          {/* Actions */}
          <div className="flex items-center gap-3 pt-4">
            <button
              onClick={() => navigate(-1)}
              className="btn btn-primary flex-1 sm:flex-none"
            >
              <IoArrowBackOutline className="w-5 h-5" />
              Voltar ao Portal
            </button>
            
            <button
              onClick={() => toggle(characterId, isFavorite)}
              disabled={isToggling}
              className={`btn btn-icon ${isFavorite ? 'bg-[var(--status-dead)]/20 border-[var(--status-dead)]' : ''}`}
              title={isFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
            >
              {isFavorite ? (
                <IoHeart className="w-5 h-5 text-[var(--status-dead)]" />
              ) : (
                <IoHeartOutline className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
