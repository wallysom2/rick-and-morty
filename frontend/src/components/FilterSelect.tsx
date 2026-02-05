import type { ChangeEvent, ReactNode } from 'react';

export interface FilterOption {
  value: string;
  label: string;
}

interface FilterSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: FilterOption[];
  placeholder?: string;
  icon?: ReactNode;
  accentColor?: string;
  ariaLabel?: string;
}

export function FilterSelect({
  value,
  onChange,
  options,
  placeholder = 'Selecione...',
  icon,
  accentColor = 'var(--portal-green)',
  ariaLabel,
}: FilterSelectProps) {
  const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    onChange(e.target.value);
  };

  const isActive = value !== '' && value !== options[0]?.value;

  return (
    <div className="relative group">
      {/* Glow effect on focus */}
      <div 
        className="absolute -inset-0.5 rounded-xl opacity-0 group-focus-within:opacity-50 blur transition-opacity duration-300"
        style={{
          background: accentColor,
        }}
      />
      
      <div className="relative flex items-center">
        {/* Icon */}
        {icon && (
          <div 
            className="absolute left-4 pointer-events-none transition-colors duration-300 z-10"
            style={{
              color: isActive ? accentColor : 'var(--text-muted)',
            }}
          >
            {icon}
          </div>
        )}

        {/* Select */}
        <select
          value={value}
          onChange={handleChange}
          aria-label={ariaLabel || placeholder}
          className={`
            w-full
            bg-[var(--space-medium)]
            border-2
            rounded-xl
            py-3 sm:py-3.5
            text-sm sm:text-base
            text-[var(--text-primary)]
            focus:outline-none
            focus:bg-[var(--space-dark)]
            transition-all duration-300
            appearance-none
            cursor-pointer
            ${icon ? 'pl-12 pr-12' : 'pl-4 pr-12'}
          `}
          style={{
            borderColor: isActive ? accentColor : 'var(--space-light)',
            boxShadow: isActive ? `0 0 20px ${accentColor}33` : 'none',
          }}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        {/* Custom dropdown arrow */}
        <div className="absolute right-4 pointer-events-none">
          <svg 
            className="w-5 h-5 transition-colors duration-300" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
            style={{
              color: isActive ? accentColor : 'var(--text-muted)',
            }}
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </div>
  );
}
