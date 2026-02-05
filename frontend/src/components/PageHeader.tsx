import type { ReactNode } from 'react';

interface PageHeaderProps {
  title: string;
  subtitle?: ReactNode;
  accentColor?: string; // CSS variable like 'var(--portal-green)'
  icon?: ReactNode;
  rightContent?: ReactNode;
}

export function PageHeader({ 
  title, 
  subtitle, 
  accentColor = 'var(--portal-green)', 
  icon,
  rightContent
}: PageHeaderProps) {
  return (
    <div className="mb-8 sm:mb-12 relative">
      {/* Decorative background glow */}
      <div 
        className="absolute -top-10 -left-10 w-32 h-32 rounded-full blur-[80px] opacity-20 pointer-events-none"
        style={{ backgroundColor: accentColor }}
      />

      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 relative z-10">
        <div className="space-y-3">
          {/* Terminal-style eyebrow/decoration */}
          <div className="flex items-center gap-2 mb-1 opacity-70">
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-[var(--dot-red)]" />
              <div className="w-2.5 h-2.5 rounded-full bg-[var(--dot-yellow)]" />
              <div className="w-2.5 h-2.5 rounded-full bg-[var(--dot-green)]" />
            </div>
            <div className="h-px w-12 bg-[var(--border-default)]" />
            <span className="text-xs font-mono text-[var(--text-muted)] uppercase tracking-wider">
              System/Database/{title.toLowerCase()}
            </span>
          </div>

          <div className="flex items-center gap-4">
            {/* Icon Box */}
            {icon && (
              <div 
                className="hidden sm:flex items-center justify-center w-14 h-14 rounded-2xl bg-[var(--bg-elevated)] border border-[var(--border-default)] shadow-lg"
                style={{ color: accentColor }}
              >
                {icon}
              </div>
            )}
            
            <div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-title font-bold text-white tracking-tight leading-none">
                {title}
                <span className="text-[var(--color-primary)] animate-pulse">_</span>
              </h1>
            </div>
          </div>

          {subtitle && (
            <div className="text-[var(--text-secondary)] text-base sm:text-lg max-w-2xl pl-1 sm:pl-18 border-l-2 border-[var(--border-default)] sm:border-none ml-1 sm:ml-0 py-1 sm:py-0">
              {subtitle}
            </div>
          )}
        </div>

        {rightContent && (
          <div className="flex-shrink-0">
            {rightContent}
          </div>
        )}
      </div>
      
      {/* Bottom separator line */}
      <div className="mt-6 h-px w-full bg-gradient-to-r from-transparent via-[var(--border-default)] to-transparent opacity-50" />
    </div>
  );
}
