import type { CharacterStatus } from '../types';

interface StatusFilterProps {
  value: CharacterStatus | '';
  onChange: (value: CharacterStatus | '') => void;
}

const statuses: { value: CharacterStatus | ''; label: string }[] = [
  { value: '', label: 'All Status' },
  { value: 'Alive', label: 'Alive' },
  { value: 'Dead', label: 'Dead' },
  { value: 'unknown', label: 'Unknown' },
];

export function StatusFilter({ value, onChange }: StatusFilterProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {statuses.map((status) => (
        <button
          key={status.value}
          onClick={() => onChange(status.value)}
          className={`
            px-4 py-2 rounded-lg font-medium transition-all
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
          {status.label}
        </button>
      ))}
    </div>
  );
}
