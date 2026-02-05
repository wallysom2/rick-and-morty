interface TerminalCardProps {
  title?: string;
  version?: string;
  children: React.ReactNode;
  className?: string;
}

export function TerminalCard({ title, version = 'GF_TERMINAL_V.4.2', children, className = '' }: TerminalCardProps) {
  return (
    <div className={`terminal-card ${className}`}>
      <div className="terminal-header">
        <div className="terminal-dots">
          <span className="terminal-dot terminal-dot-red" />
          <span className="terminal-dot terminal-dot-yellow" />
          <span className="terminal-dot terminal-dot-green" />
        </div>
        {(title || version) && (
          <span className="text-xs font-mono text-[var(--text-muted)]">
            {title || version}
          </span>
        )}
      </div>
      <div className="terminal-content">
        {children}
      </div>
    </div>
  );
}
