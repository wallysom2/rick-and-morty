import { useParams, Link } from 'react-router-dom';
import { useLocation, useMultipleCharacters } from '../hooks';
import { Breadcrumb } from '../components/Breadcrumb';
import { TerminalCard } from '../components/TerminalCard';

export function LocationPage() {
  const { id } = useParams<{ id: string }>();
  const locationId = Number(id);
  
  const { data: location, isLoading, isError } = useLocation(locationId);
  
  // Get resident IDs from URLs
  const residentIds = location?.residents?.map(url => {
    const match = url.match(/\/character\/(\d+)/);
    return match ? Number(match[1]) : 0;
  }).filter(id => id > 0).slice(0, 20) || [];
  
  const { data: residents = [] } = useMultipleCharacters(residentIds);

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

  if (isError || !location) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-16">
          <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-4">Localizacao nao encontrada</h2>
          <p className="text-[var(--text-secondary)] mb-6">Esta localizacao nao existe em nenhuma dimensao conhecida.</p>
          <Link to="/locations" className="btn btn-primary">Voltar para Localizacoes</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumb items={[
        { label: 'Localizacoes', href: '/locations' },
        { label: location.name }
      ]} />
      
      <div className="space-y-8">
        {/* Header */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <span className="px-3 py-1.5 text-sm font-mono font-bold bg-[var(--color-primary)]/20 text-[var(--color-primary)] rounded-lg">
              #{location.id}
            </span>
            {location.type && (
              <span className="px-3 py-1.5 text-sm font-medium bg-[var(--bg-terminal)] text-[var(--text-secondary)] rounded-lg border border-[var(--border-default)]">
                {location.type}
              </span>
            )}
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-[var(--text-primary)] mb-2">
            {location.name}
          </h1>
          <p className="text-lg text-[var(--text-secondary)]">
            {location.dimension || 'Dimensao desconhecida'}
          </p>
        </div>
        
        {/* Info Card */}
        <TerminalCard title="LOCATION_DATA">
          <div className="info-row">
            <div className="info-item">
              <span className="info-label">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
                TIPO
              </span>
              <span className="info-value">{location.type || 'Desconhecido'}</span>
            </div>
            <div className="info-item">
              <span className="info-label">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                DIMENSAO
              </span>
              <span className="info-value">{location.dimension || 'Desconhecida'}</span>
            </div>
          </div>
          <div className="info-row full-width">
            <div className="info-item">
              <span className="info-label">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                RESIDENTES
              </span>
              <span className="info-value">{location.residents.length} personagens residem nesta localizacao</span>
            </div>
          </div>
        </TerminalCard>
        
        {/* Residents Grid */}
        {residents.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-4">
              Residentes
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4">
              {residents.map(char => (
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
                    <div className="flex items-center gap-1 mt-1">
                      <span className={`w-2 h-2 rounded-full ${
                        char.status === 'Alive' ? 'status-dot-alive' : 
                        char.status === 'Dead' ? 'status-dot-dead' : 'status-dot-unknown'
                      }`} />
                      <span className="text-xs text-[var(--text-muted)]">{char.status}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            {location.residents.length > 20 && (
              <p className="text-sm text-[var(--text-muted)] mt-4">
                +{location.residents.length - 20} outros residentes
              </p>
            )}
          </div>
        )}

        {/* Empty residents state */}
        {location.residents.length === 0 && (
          <div className="text-center py-8 bg-[var(--bg-card)] rounded-xl border border-[var(--border-default)]">
            <svg className="w-12 h-12 mx-auto text-[var(--text-muted)] mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <p className="text-[var(--text-secondary)]">Nenhum residente conhecido nesta localizacao</p>
          </div>
        )}
        
        {/* Back button */}
        <div>
          <Link to="/locations" className="btn btn-secondary">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Voltar para Localizacoes
          </Link>
        </div>
      </div>
    </div>
  );
}
