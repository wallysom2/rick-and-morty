interface ActiveFilter {
  label: string;
  value: string;
  onClear: () => void;
}

interface ActiveFiltersProps {
  filters: ActiveFilter[];
  onClearAll?: () => void;
  accentColor?: string;
}

export function ActiveFilters({ 
  filters, 
  onClearAll,
  accentColor = 'var(--portal-green)' 
}: ActiveFiltersProps) {
  if (filters.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2 sm:gap-3 animate-fade-in-up">
      <span className="text-xs sm:text-sm text-[var(--text-muted)] font-medium">
        Filtros ativos:
      </span>
      
      {filters.map((filter, index) => (
        <button
          key={index}
          onClick={filter.onClear}
          className="
            group
            flex items-center gap-1.5 sm:gap-2
            px-2.5 sm:px-3 py-1.5 sm:py-2
            rounded-lg sm:rounded-xl
            border-2
            text-xs sm:text-sm font-medium
            transition-all duration-300
            hover:scale-105
            active:scale-95
          "
          style={{
            borderColor: accentColor,
            backgroundColor: `${accentColor}22`,
            color: accentColor,
          }}
          title={`Remover filtro: ${filter.label}`}
        >
          <span className="truncate max-w-[120px] sm:max-w-none">{filter.label}</span>
          <svg 
            className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0 transition-transform duration-300 group-hover:rotate-90" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      ))}

      {onClearAll && filters.length > 1 && (
        <button
          onClick={onClearAll}
          className="
            flex items-center gap-1.5
            px-2.5 sm:px-3 py-1.5 sm:py-2
            rounded-lg sm:rounded-xl
            bg-[var(--space-medium)]
            border-2 border-[var(--space-light)]
            text-xs sm:text-sm font-semibold
            text-[var(--text-secondary)]
            hover:text-[var(--text-primary)]
            hover:border-[var(--border-hover)]
            transition-all duration-300
            hover:scale-105
            active:scale-95
          "
          title="Limpar todos os filtros"
        >
          <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
          Limpar todos
        </button>
      )}
    </div>
  );
}
