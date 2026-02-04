import { useParams, Link } from 'react-router-dom';
import { useEpisode, useMultipleCharacters } from '../hooks';
import { Breadcrumb } from '../components/Breadcrumb';
import { TerminalCard } from '../components/TerminalCard';

export function EpisodePage() {
  const { id } = useParams<{ id: string }>();
  const episodeId = Number(id);
  
  const { data: episode, isLoading, isError } = useEpisode(episodeId);
  
  // Get character IDs from URLs
  const characterIds = episode?.characters?.map(url => {
    const match = url.match(/\/character\/(\d+)/);
    return match ? Number(match[1]) : 0;
  }).filter(id => id > 0).slice(0, 20) || [];
  
  const { data: characters = [] } = useMultipleCharacters(characterIds);

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-6 w-48 skeleton rounded" />
          <div className="h-12 w-3/4 skeleton rounded" />
          <div className="h-64 skeleton rounded-xl" />
        </div>
      </div>
    );
  }

  if (isError || !episode) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-16">
          <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-4">Episode not found</h2>
          <p className="text-[var(--text-secondary)] mb-6">This episode doesn't exist in any dimension we know of.</p>
          <Link to="/episodes" className="btn btn-primary">Back to Episodes</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumb items={[
        { label: 'Episodes', href: '/episodes' },
        { label: episode.name }
      ]} />
      
      <div className="space-y-8">
        {/* Header */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <span className="px-3 py-1.5 text-sm font-mono font-bold bg-[var(--color-primary)]/20 text-[var(--color-primary)] rounded-lg">
              {episode.episode}
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-[var(--text-primary)] mb-2">
            {episode.name}
          </h1>
          <p className="text-lg text-[var(--text-secondary)]">
            Aired: {episode.air_date}
          </p>
        </div>
        
        {/* Info Card */}
        <TerminalCard title="EPISODE_DATA">
          <div className="info-row">
            <div className="info-item">
              <span className="info-label">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
                </svg>
                EPISODE CODE
              </span>
              <span className="info-value font-mono">{episode.episode}</span>
            </div>
            <div className="info-item">
              <span className="info-label">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                AIR DATE
              </span>
              <span className="info-value">{episode.air_date}</span>
            </div>
          </div>
          <div className="info-row full-width">
            <div className="info-item">
              <span className="info-label">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                CHARACTERS
              </span>
              <span className="info-value">{episode.characters.length} characters appear in this episode</span>
            </div>
          </div>
        </TerminalCard>
        
        {/* Characters Grid */}
        {characters.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-4">
              Featured Characters
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4">
              {characters.map(char => (
                <Link
                  key={char.id}
                  to={`/character/${char.id}`}
                  className="group bg-[var(--bg-card)] rounded-lg overflow-hidden card-hover"
                >
                  <div className="aspect-square overflow-hidden">
                    <img 
                      src={char.image} 
                      alt={char.name}
                      className="w-full h-full object-cover transition-transform group-hover:scale-105"
                      loading="lazy"
                    />
                  </div>
                  <div className="p-2">
                    <p className="text-sm font-medium text-[var(--text-primary)] truncate group-hover:text-[var(--color-primary)] transition-colors">
                      {char.name}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
            {episode.characters.length > 20 && (
              <p className="text-sm text-[var(--text-muted)] mt-4">
                +{episode.characters.length - 20} more characters
              </p>
            )}
          </div>
        )}
        
        {/* Back button */}
        <div>
          <Link to="/episodes" className="btn btn-secondary">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Episodes
          </Link>
        </div>
      </div>
    </div>
  );
}
