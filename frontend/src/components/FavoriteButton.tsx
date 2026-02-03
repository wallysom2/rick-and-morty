import { useState } from 'react';

interface FavoriteButtonProps {
  isFavorite: boolean;
  onToggle: () => void;
  isLoading?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function FavoriteButton({
  isFavorite,
  onToggle,
  isLoading = false,
  size = 'md',
}: FavoriteButtonProps) {
  const [isAnimating, setIsAnimating] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isLoading) return;

    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 300);
    onToggle();
  };

  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10 sm:w-11 sm:h-11',
    lg: 'w-12 h-12',
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5 sm:w-6 sm:h-6',
    lg: 'w-7 h-7',
  };

  return (
    <button
      onClick={handleClick}
      disabled={isLoading}
      className={`
        ${sizeClasses[size]}
        relative flex items-center justify-center
        rounded-full
        transition-all duration-300
        ${isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${isFavorite 
          ? 'bg-[var(--status-dead)]/20 backdrop-blur-sm' 
          : 'bg-[var(--space-black)]/50 backdrop-blur-sm hover:bg-[var(--space-medium)]'
        }
        border-2 ${isFavorite ? 'border-[var(--status-dead)]/50' : 'border-[var(--space-lighter)]/50 hover:border-[var(--dimension-pink)]/50'}
        ${!isLoading && 'hover:scale-110 active:scale-95'}
        ${isAnimating ? 'animate-heart' : ''}
      `}
      style={isFavorite ? { boxShadow: '0 0 15px rgba(255, 71, 87, 0.4)' } : {}}
      title={isFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
    >
      {/* Glow effect */}
      {isFavorite && (
        <div className="absolute inset-0 rounded-full animate-pulse opacity-50"
          style={{ boxShadow: '0 0 20px var(--status-dead)' }}
        />
      )}
      
      <svg 
        className={`${iconSizes[size]} transition-all duration-300 ${isAnimating ? 'scale-125' : ''}`}
        fill={isFavorite ? 'var(--status-dead)' : 'none'} 
        stroke={isFavorite ? 'var(--status-dead)' : 'var(--text-muted)'}
        strokeWidth={2}
        viewBox="0 0 24 24"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" 
        />
      </svg>
    </button>
  );
}
