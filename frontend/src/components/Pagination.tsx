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

    if (currentPage <= halfShow) {
      end = Math.min(totalPages, showPages);
    }
    if (currentPage > totalPages - halfShow) {
      start = Math.max(1, totalPages - showPages + 1);
    }

    if (start > 1) {
      pages.push(1);
      if (start > 2) pages.push('...');
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (end < totalPages) {
      if (end < totalPages - 1) pages.push('...');
      pages.push(totalPages);
    }

    return pages;
  };

  const buttonBaseClass = `
    relative px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl text-sm sm:text-base font-semibold
    transition-all duration-300 overflow-hidden
    flex items-center gap-1.5
  `;

  const activeButtonClass = `
    bg-gradient-to-r from-[var(--portal-green)] to-[var(--portal-cyan)]
    text-[var(--space-black)]
  `;

  const inactiveButtonClass = `
    bg-[var(--space-medium)] text-[var(--text-secondary)]
    hover:bg-[var(--space-light)] hover:text-[var(--portal-green)]
    border border-[var(--space-lighter)]/50
  `;

  const disabledButtonClass = `
    bg-[var(--space-dark)] text-[var(--text-muted)]
    cursor-not-allowed border border-[var(--space-medium)]
  `;

  return (
    <div className="flex items-center justify-center gap-2">
      {/* Previous button */}
      <button
        onClick={handlePrevious}
        disabled={currentPage === 1}
        className={`${buttonBaseClass} ${currentPage === 1 ? disabledButtonClass : inactiveButtonClass}`}
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        <span className="hidden sm:inline">Anterior</span>
      </button>

      {/* Page numbers - Desktop */}
      <div className="hidden sm:flex items-center gap-1.5">
        {getPageNumbers().map((page, index) => (
          <button
            key={index}
            onClick={() => typeof page === 'number' && onPageChange(page)}
            disabled={page === '...'}
            className={`
              w-10 h-10 rounded-xl font-semibold
              transition-all duration-300
              flex items-center justify-center
              ${page === currentPage 
                ? activeButtonClass 
                : page === '...'
                ? 'bg-transparent text-[var(--text-muted)] cursor-default'
                : inactiveButtonClass
              }
            `}
            style={page === currentPage ? { boxShadow: '0 0 20px rgba(151, 206, 76, 0.4)' } : {}}
          >
            {page}
          </button>
        ))}
      </div>

      {/* Mobile page indicator */}
      <div className="sm:hidden flex items-center gap-2">
        <div className="px-4 py-2 rounded-xl bg-[var(--space-medium)] border border-[var(--space-lighter)]/50">
          <span className="text-[var(--portal-green)] font-bold">{currentPage}</span>
          <span className="text-[var(--text-muted)]"> / {totalPages}</span>
        </div>
      </div>

      {/* Next button */}
      <button
        onClick={handleNext}
        onMouseEnter={onPrefetch}
        disabled={currentPage === totalPages}
        className={`${buttonBaseClass} ${currentPage === totalPages ? disabledButtonClass : inactiveButtonClass}`}
        style={currentPage < totalPages ? {} : {}}
      >
        <span className="hidden sm:inline">Próximo</span>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
}
