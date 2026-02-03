export function SkeletonCard() {
  return (
    <div className="bg-gray-800 rounded-xl overflow-hidden shadow-lg">
      {/* Image skeleton */}
      <div className="skeleton h-48 w-full" />

      {/* Content skeleton */}
      <div className="p-4 space-y-3">
        {/* Name */}
        <div className="skeleton h-6 w-3/4 rounded" />

        {/* Status badge */}
        <div className="skeleton h-5 w-20 rounded-full" />

        {/* Species */}
        <div className="skeleton h-4 w-1/2 rounded" />
      </div>
    </div>
  );
}

export function SkeletonList({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, index) => (
        <SkeletonCard key={index} />
      ))}
    </div>
  );
}
