export function SkeletonCard() {
  return (
    <div className="rounded-2xl overflow-hidden animate-pulse"
      style={{ background: 'linear-gradient(180deg, var(--space-medium) 0%, var(--space-dark) 100%)' }}
    >
      {/* Top accent bar */}
      <div className="h-1 skeleton" />
      
      {/* Image skeleton */}
      <div className="aspect-square skeleton relative">
        {/* Shimmer overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent skeleton" />
      </div>
      
      {/* Content skeleton */}
      <div className="p-3 sm:p-4 space-y-3">
        {/* Title */}
        <div className="h-5 sm:h-6 skeleton rounded-lg w-3/4" />
        
        {/* Status row */}
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full skeleton" />
          <div className="h-4 skeleton rounded w-16" />
          <div className="w-1 h-1 rounded-full bg-[var(--space-lighter)]" />
          <div className="h-4 skeleton rounded w-20" />
        </div>
        
        {/* Location */}
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 skeleton rounded" />
          <div className="h-4 skeleton rounded w-2/3" />
        </div>
      </div>
    </div>
  );
}

export function SkeletonList({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}
