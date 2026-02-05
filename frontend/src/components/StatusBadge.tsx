import type { CharacterStatus } from '../types';

interface StatusBadgeProps {
  status: CharacterStatus | string;
  size?: 'sm' | 'md';
}

const statusConfig: Record<string, { label: string; className: string }> = {
  Alive: { label: 'VIVO', className: 'badge-alive' },
  Dead: { label: 'MORTO', className: 'badge-dead' },
  unknown: { label: 'DESCONHECIDO', className: 'badge-unknown' },
};

export function StatusBadge({ status, size = 'md' }: StatusBadgeProps) {
  const config = statusConfig[status] || statusConfig.unknown;
  
  return (
    <span className={`badge ${config.className} ${size === 'sm' ? 'text-[10px] px-2 py-1' : ''}`}>
      <span className={`status-dot status-dot-${status.toLowerCase()}`} />
      {config.label}
    </span>
  );
}
