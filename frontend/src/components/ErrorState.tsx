interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({
  message = 'Algo deu errado',
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="text-center py-12">
      <span className="text-5xl sm:text-6xl mb-4 block">😵</span>
      <h3 className="text-lg sm:text-xl font-semibold text-red-400">Ops!</h3>
      <p className="text-sm sm:text-base text-gray-400 mt-2">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-4 px-4 sm:px-6 py-2 bg-green-600 text-white text-sm sm:text-base rounded-lg hover:bg-green-700 transition-colors"
        >
          Tentar Novamente
        </button>
      )}
    </div>
  );
}
