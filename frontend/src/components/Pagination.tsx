interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onPrefetch?: () => void;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  onPrefetch,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  // Generate page numbers to show
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const showPages = 5;
    const halfShow = Math.floor(showPages / 2);

    let start = Math.max(1, currentPage - halfShow);
    let end = Math.min(totalPages, currentPage + halfShow);

    // Adjust if we're near the beginning or end
    if (currentPage <= halfShow) {
      end = Math.min(totalPages, showPages);
    }
    if (currentPage > totalPages - halfShow) {
      start = Math.max(1, totalPages - showPages + 1);
    }

    // Add first page and ellipsis
    if (start > 1) {
      pages.push(1);
      if (start > 2) pages.push('...');
    }

    // Add middle pages
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    // Add last page and ellipsis
    if (end < totalPages) {
      if (end < totalPages - 1) pages.push('...');
      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <div className="flex items-center justify-center space-x-2">
      {/* Previous button */}
      <button
        onClick={handlePrevious}
        disabled={currentPage === 1}
        className={`
          px-4 py-2 rounded-lg font-medium transition-all
          ${
            currentPage === 1
              ? 'bg-gray-800 text-gray-600 cursor-not-allowed'
              : 'bg-gray-800 text-white hover:bg-gray-700'
          }
        `}
      >
        ← Prev
      </button>

      {/* Page numbers */}
      <div className="hidden sm:flex items-center space-x-1">
        {getPageNumbers().map((page, index) => (
          <button
            key={index}
            onClick={() => typeof page === 'number' && onPageChange(page)}
            disabled={page === '...'}
            className={`
              w-10 h-10 rounded-lg font-medium transition-all
              ${
                page === currentPage
                  ? 'bg-green-600 text-white'
                  : page === '...'
                  ? 'bg-transparent text-gray-500 cursor-default'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }
            `}
          >
            {page}
          </button>
        ))}
      </div>

      {/* Mobile page indicator */}
      <div className="sm:hidden px-4 py-2 bg-gray-800 rounded-lg">
        <span className="text-gray-300">
          {currentPage} / {totalPages}
        </span>
      </div>

      {/* Next button */}
      <button
        onClick={handleNext}
        onMouseEnter={onPrefetch}
        disabled={currentPage === totalPages}
        className={`
          px-4 py-2 rounded-lg font-medium transition-all
          ${
            currentPage === totalPages
              ? 'bg-gray-800 text-gray-600 cursor-not-allowed'
              : 'bg-gray-800 text-white hover:bg-gray-700'
          }
        `}
      >
        Next →
      </button>
    </div>
  );
}
