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
    sm: 'w-8 h-8 text-lg',
    md: 'w-10 h-10 text-xl',
    lg: 'w-12 h-12 text-2xl',
  };

  return (
    <button
      onClick={handleClick}
      disabled={isLoading}
      className={`
        ${sizeClasses[size]}
        flex items-center justify-center
        rounded-full
        transition-all duration-200
        ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:scale-110 cursor-pointer'}
        ${isFavorite ? 'bg-red-500/20' : 'bg-gray-700/50 hover:bg-gray-600/50'}
        ${isAnimating ? 'animate-heart' : ''}
      `}
      title={isFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
    >
      <span
        className={`
          transition-all duration-200
          ${isFavorite ? 'text-red-500' : 'text-gray-400'}
          ${isAnimating ? 'scale-125' : ''}
        `}
      >
        {isFavorite ? '❤️' : '🤍'}
      </span>
    </button>
  );
}
