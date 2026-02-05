import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useLocation, useMultipleCharacters } from '../hooks';
import { Breadcrumb } from '../components/Breadcrumb';
import { TerminalCard } from '../components/TerminalCard';
import { Pagination } from '../components/Pagination';
import { 
  IoLocationOutline, 
  IoPlanetOutline, 
  IoCubeOutline, 
  IoPeopleOutline,
  IoArrowBack
} from 'react-icons/io5';

export function LocationPage() {
  const { id } = useParams<{ id: string }>();
  const locationId = Number(id);
  const [page, setPage] = useState(1);
  const ITEMS_PER_PAGE = 20;
  
  const { data: location, isLoading, isError } = useLocation(locationId);

  // Reset page when location changes
  useEffect(() => {
    setPage(1);
  }, [locationId]);
  
  // Get resident IDs from URLs
  const residentIds = location?.residents?.map(url => {
    const match = url.match(/\/character\/(\d+)/);
    return match ? Number(match[1]) : 0;
  }).filter(id => id > 0) || [];

  const totalPages = Math.ceil(residentIds.length / ITEMS_PER_PAGE);
  const paginatedIds = residentIds.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);
  
  const { data: residents = [] } = useMultipleCharacters(paginatedIds);

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
        
        {/* Info Card */}
        <TerminalCard title="LOCATION_DATA">
          <div className="info-row full-width">
            <div className="info-item">
              <span className="info-label">
                <IoLocationOutline className="w-4 h-4" />
                NOME
              </span>
              <span className="info-value text-xl">{location.name}</span>
            </div>
          </div>
          <div className="info-row">
            <div className="info-item">
              <span className="info-label">
                <IoPlanetOutline className="w-4 h-4" />
                TIPO
              </span>
              <span className="info-value">{location.type || 'Desconhecido'}</span>
            </div>
            <div className="info-item">
              <span className="info-label">
                <IoCubeOutline className="w-4 h-4" />
                DIMENSAO
              </span>
              <span className="info-value">{location.dimension || 'Desconhecida'}</span>
            </div>
          </div>
          <div className="info-row full-width">
            <div className="info-item">
              <span className="info-label">
                <IoPeopleOutline className="w-4 h-4" />
                RESIDENTES
              </span>
              <span className="info-value">{location.residents.length} personagens residem nesta localizacao</span>
            </div>
          </div>
        </TerminalCard>
        
        {/* Residents Grid */}
        {residents.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold font-title text-[var(--text-primary)]">
                Residentes
              </h2>
              <span className="text-sm text-[var(--text-muted)] bg-[var(--bg-terminal)] px-3 py-1 rounded-full border border-[var(--border-default)]">
                {residents.length} encontrados
              </span>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {residents.map(char => (
                <Link
                  key={char.id}
                  to={`/character/${char.id}`}
                  className="group relative bg-[var(--bg-card)] rounded-xl overflow-hidden border border-[var(--border-default)] hover:border-[var(--color-primary)] hover:shadow-[0_0_20px_rgba(151,206,76,0.15)] transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
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

        {/* Empty residents state */}
        {location.residents.length === 0 && (
          <div className="text-center py-8 bg-[var(--bg-card)] rounded-xl border border-[var(--border-default)]">
            <IoPeopleOutline className="w-12 h-12 mx-auto text-[var(--text-muted)] mb-3" />
            <p className="text-[var(--text-secondary)]">Nenhum residente conhecido nesta localizacao</p>
          </div>
        )}
        
        {/* Back button */}
        <div>
          <Link to="/locations" className="btn btn-secondary">
            <IoArrowBack className="w-5 h-5" />
            Voltar para Localizacoes
          </Link>
        </div>
      </div>
    </div>
  );
}
