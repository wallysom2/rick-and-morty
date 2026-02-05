import type { ReactNode } from 'react';

interface ContainerProps {
  children: ReactNode;
  className?: string;
}

export function Container({ children, className = '' }: ContainerProps) {
  return (
    <main className={`relative min-h-screen ${className}`}>
      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-8">
        {children}
      </div>
    </main>
  );
}
