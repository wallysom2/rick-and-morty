import type { ReactNode } from 'react';

interface ContainerProps {
  children: ReactNode;
  className?: string;
}

export function Container({ children, className = '' }: ContainerProps) {
  return (
    <main className={`relative min-h-screen ${className}`}>
      {/* Subtle portal glow at top */}
      <div 
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] pointer-events-none opacity-30"
        style={{
          background: 'radial-gradient(ellipse at top, var(--portal-green) 0%, transparent 70%)',
          filter: 'blur(60px)'
        }}
      />
      
      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-8">
        {children}
      </div>
    </main>
  );
}
