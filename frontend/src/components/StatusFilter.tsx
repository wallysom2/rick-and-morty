import type { CharacterStatus } from '../types';

interface StatusFilterProps {
  value: CharacterStatus | '';
  onChange: (value: CharacterStatus | '') => void;
}

const statuses: { value: CharacterStatus | ''; label: string; shortLabel: string }[] = [
  { value: '', label: 'Todos', shortLabel: 'Todos' },
  { value: 'Alive', label: 'Vivo', shortLabel: 'Vivo' },
  { value: 'Dead', label: 'Morto', shortLabel: 'Morto' },
  { value: 'unknown', label: 'Desconhecido', shortLabel: '?' },
];

export function StatusFilter({ value, onChange }: StatusFilterProps) {
  return (
    <div className="flex flex-wrap gap-1.5 sm:gap-2">
      {statuses.map((status) => (
        <button
          key={status.value}
          onClick={() => onChange(status.value)}
          className={`
            px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-lg text-sm sm:text-base font-medium transition-all
            ${
              value === status.value
                ? 'bg-green-600 text-white'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }
          `}
        >
          {status.value === 'Alive' && '🟢 '}
          {status.value === 'Dead' && '🔴 '}
          {status.value === 'unknown' && '⚪ '}
          <span className="hidden sm:inline">{status.label}</span>
          <span className="sm:hidden">{status.shortLabel}</span>
        </button>
      ))}
    </div>
  );
}
