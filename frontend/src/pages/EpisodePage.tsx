import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useEpisode, useMultipleCharacters } from '../hooks';
import { Breadcrumb } from '../components/Breadcrumb';
import { TerminalCard } from '../components/TerminalCard';
import { Pagination } from '../components/Pagination';

export function EpisodePage() {
  const { id } = useParams<{ id: string }>();
  const episodeId = Number(id);
  const [page, setPage] = useState(1);
  const ITEMS_PER_PAGE = 20;
  
  const { data: episode, isLoading, isError } = useEpisode(episodeId);

  // Reset page when episode changes
  useEffect(() => {
    setPage(1);
  }, [episodeId]);
  
  // Get character IDs from URLs
  const characterIds = episode?.characters?.map(url => {
    const match = url.match(/\/character\/(\d+)/);
    return match ? Number(match[1]) : 0;
  }).filter(id => id > 0) || [];

  const totalPages = Math.ceil(characterIds.length / ITEMS_PER_PAGE);
  const paginatedIds = characterIds.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);
  
  const { data: characters = [] } = useMultipleCharacters(paginatedIds);

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
          <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-4">Episodio nao encontrado</h2>
          <p className="text-[var(--text-secondary)] mb-6">Este episodio nao existe em nenhuma dimensao conhecida.</p>
          <Link to="/episodes" className="btn btn-primary">Voltar aos Episodios</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumb items={[
        { label: 'Episodios', href: '/episodes' },
        { label: episode.name }
      ]} />
      
      <div className="space-y-8">
        {/* Info Card */}
        <TerminalCard>
          <div className="mb-8 border-b border-[var(--border-default)] pb-6">
            <h1 className="text-3xl sm:text-4xl font-title font-bold text-[var(--text-primary)] mb-2">
              {episode.name}
            </h1>
          </div>
          
          <div className="info-row">
            <div className="info-item">
              <span className="info-label">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
                </svg>
                CODIGO DO EPISODIO
              </span>
              <span className="info-value font-mono">{episode.episode}</span>
            </div>
            <div className="info-item">
              <span className="info-label">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                DATA DE EXIBICAO
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
                PERSONAGENS
              </span>
              <span className="info-value">{episode.characters.length} personagens aparecem neste episodio</span>
            </div>
          </div>
        </TerminalCard>
        
        {/* Characters Grid */}
        {characters.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold font-title text-[var(--text-primary)]">
                Personagens em Destaque
              </h2>
              <span className="text-sm text-[var(--text-muted)] bg-[var(--bg-terminal)] px-3 py-1 rounded-full border border-[var(--border-default)]">
                {characters.length} encontrados
              </span>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {characters.map(char => (
                <Link
                  key={char.id}
                  to={`/character/${char.id}`}
                  className="group relative bg-[var(--bg-card)] rounded-xl overflow-hidden border border-[var(--border-default)] hover:border-[var(--color-primary)] transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
                >
                  <div className="aspect-square overflow-hidden bg-[var(--bg-terminal)]">
                    <img 
                      src={char.image} 
                      alt={char.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-card)] via-transparent to-transparent opacity-60" />
                  </div>
                  
                  <div className="absolute top-2 left-2">
                    <span className={`block w-2.5 h-2.5 rounded-full ${
                      char.status === 'Alive' ? 'bg-[var(--status-alive)] shadow-[0_0_8px_var(--status-alive)]' : 
                      char.status === 'Dead' ? 'bg-[var(--status-dead)]' : 'bg-[var(--status-unknown)]'
                    }`} />
                  </div>

                  <div className="p-3">
                    <p className="text-sm font-semibold text-[var(--text-primary)] truncate group-hover:text-[var(--color-primary)] transition-colors">
                      {char.name}
                    </p>
                    <p className="text-xs text-[var(--text-muted)] truncate mt-0.5">
                      {char.species}
                    </p>
                  </div>
                </Link>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8">
                <Pagination
                  currentPage={page}
                  totalPages={totalPages}
                  onPageChange={setPage}
                />
              </div>
            )}
          </div>
        )}
        
        {/* Back button */}
        <div>
          <Link to="/episodes" className="btn btn-secondary">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Voltar aos Episodios
          </Link>
        </div>
      </div>
    </div>
  );
}
