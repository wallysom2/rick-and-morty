export function SkeletonCard() {
  return (
    <div className="bg-gray-800 rounded-xl overflow-hidden shadow-lg">
      {/* Image skeleton */}
      <div className="skeleton aspect-square w-full" />

      {/* Content skeleton */}
      <div className="p-3 sm:p-4 space-y-2 sm:space-y-3">
        {/* Name */}
        <div className="skeleton h-5 sm:h-6 w-3/4 rounded" />

        {/* Status badge */}
        <div className="skeleton h-4 sm:h-5 w-16 sm:w-20 rounded-full" />

        {/* Species */}
        <div className="skeleton h-3 sm:h-4 w-1/2 rounded" />
      </div>
    </div>
  );
}

export function SkeletonList({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
      {Array.from({ length: count }).map((_, index) => (
        <SkeletonCard key={index} />
      ))}
    </div>
  );
}
