interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({
  message = 'Something went wrong',
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="text-center py-12">
      <span className="text-6xl mb-4 block">😵</span>
      <h3 className="text-xl font-semibold text-red-400">Oops!</h3>
      <p className="text-gray-400 mt-2">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-4 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          Try Again
        </button>
      )}
    </div>
  );
}
