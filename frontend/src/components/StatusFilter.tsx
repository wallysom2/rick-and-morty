import type { CharacterStatus } from '../types';

interface StatusFilterProps {
  value: CharacterStatus | '';
  onChange: (value: CharacterStatus | '') => void;
}

const statuses: { 
  value: CharacterStatus | ''; 
  label: string; 
  shortLabel: string;
  color: string;
  activeGradient: string;
  glow: string;
}[] = [
  { 
    value: '', 
    label: 'Todos', 
    shortLabel: 'Todos',
    color: 'var(--portal-green)',
    activeGradient: 'linear-gradient(135deg, var(--portal-green), var(--portal-cyan))',
    glow: '0 0 20px rgba(151, 206, 76, 0.5)'
  },
  { 
    value: 'Alive', 
    label: 'Vivos', 
    shortLabel: 'Vivo',
    color: 'var(--status-alive)',
    activeGradient: 'linear-gradient(135deg, var(--status-alive), #00cc6a)',
    glow: '0 0 20px rgba(0, 255, 136, 0.5)'
  },
  { 
    value: 'Dead', 
    label: 'Mortos', 
    shortLabel: 'Morto',
    color: 'var(--status-dead)',
    activeGradient: 'linear-gradient(135deg, var(--status-dead), var(--dimension-pink))',
    glow: '0 0 20px rgba(255, 71, 87, 0.5)'
  },
  { 
    value: 'unknown', 
    label: 'Desconhecido', 
    shortLabel: '?',
    color: 'var(--status-unknown)',
    activeGradient: 'linear-gradient(135deg, var(--status-unknown), var(--space-lighter))',
    glow: '0 0 20px rgba(160, 160, 160, 0.3)'
  },
];

export function StatusFilter({ value, onChange }: StatusFilterProps) {
  return (
    <div className="flex flex-wrap gap-2 sm:gap-3">
      {statuses.map((status) => {
        const isActive = value === status.value;
        
          return (
          <button
            key={status.value}
            onClick={() => onChange(status.value)}
            className={`
              relative px-3 sm:px-5 py-2 sm:py-2.5 rounded-xl text-sm sm:text-base font-semibold
              transition-all duration-300
              ${isActive 
                ? 'bg-[var(--space-light)] text-[var(--text-primary)]' 
                : 'bg-[var(--space-medium)] text-[var(--text-secondary)] hover:bg-[var(--space-light)]'
              }
              focus:outline-none
            `}
          >
            <span className="flex items-center gap-1.5 sm:gap-2">
              {/* Status indicator dot */}
              <span 
                className="w-2 h-2 rounded-full"
                style={{ 
                  background: status.color,
                }}
              />
              <span className="hidden sm:inline">{status.label}</span>
              <span className="sm:hidden">{status.shortLabel}</span>
            </span>
          </button>
        );
      })}
    </div>
  );
}
