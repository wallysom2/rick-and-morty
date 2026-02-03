import type { ChangeEvent } from 'react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function SearchBar({
  value,
  onChange,
  placeholder = 'Buscar personagens...',
}: SearchBarProps) {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  const handleClear = () => {
    onChange('');
  };

  return (
    <div className="relative">
      {/* Search icon */}
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <span className="text-gray-400 text-base sm:text-lg">🔍</span>
      </div>

      {/* Input */}
      <input
        type="text"
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        className="
          w-full
          bg-gray-800
          border border-gray-700
          rounded-lg
          py-2.5 sm:py-3 pl-9 sm:pl-10 pr-9 sm:pr-10
          text-sm sm:text-base
          text-white
          placeholder-gray-500
          focus:outline-none
          focus:ring-2
          focus:ring-green-500
          focus:border-transparent
          transition-all
        "
      />

      {/* Clear button */}
      {value && (
        <button
          onClick={handleClear}
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white transition-colors"
        >
          <span className="text-base sm:text-lg">✕</span>
        </button>
      )}
    </div>
  );
}
