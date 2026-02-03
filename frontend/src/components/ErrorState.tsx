interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({
  message = 'Algo deu errado. Por favor, tente novamente.',
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 sm:py-16 px-4">
      {/* Error illustration */}
      <div className="relative mb-6">
        {/* Outer glow ring */}
        <div className="absolute inset-0 rounded-full animate-pulse"
          style={{ 
            background: 'radial-gradient(circle, rgba(255, 71, 87, 0.2) 0%, transparent 70%)',
            transform: 'scale(2)'
          }}
        />
        
        {/* Icon container */}
        <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full flex items-center justify-center"
          style={{
            background: 'linear-gradient(135deg, var(--space-medium), var(--space-dark))',
            boxShadow: '0 0 30px rgba(255, 71, 87, 0.3)'
          }}
        >
          <svg 
            className="w-10 h-10 sm:w-12 sm:h-12 text-[var(--status-dead)]" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={1.5} 
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" 
            />
          </svg>
        </div>
      </div>

      {/* Error message */}
      <h3 className="text-lg sm:text-xl font-bold text-[var(--text-primary)] mb-2 text-center">
        Oops! Erro Dimensional
      </h3>
      <p className="text-sm sm:text-base text-[var(--text-muted)] mb-6 text-center max-w-md">
        {message}
      </p>

      {/* Retry button */}
      {onRetry && (
        <button
          onClick={onRetry}
          className="
            group relative px-6 py-3 rounded-xl font-semibold
            bg-gradient-to-r from-[var(--portal-green)] to-[var(--portal-green-dark)]
            text-[var(--space-black)]
            transition-all duration-300
            hover:shadow-[0_0_30px_rgba(151,206,76,0.5)]
            hover:scale-105
            active:scale-95
          "
        >
          <span className="flex items-center gap-2">
            <svg className="w-5 h-5 transition-transform group-hover:rotate-180 duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Tentar Novamente
          </span>
        </button>
      )}
    </div>
  );
}
