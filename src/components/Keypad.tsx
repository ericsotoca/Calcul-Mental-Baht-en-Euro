import React from 'react';
import { Delete, Check } from 'lucide-react';

interface KeypadProps {
  onDigit: (digit: string) => void;
  onDelete: () => void;
  onClear: () => void;
  onSubmit: () => void;
  disabled?: boolean;
}

export const Keypad: React.FC<KeypadProps> = ({
  onDigit,
  onDelete,
  onClear,
  onSubmit,
  disabled = false,
}) => {
  const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '0'];

  return (
    <div className="w-full max-w-xs mx-auto grid grid-cols-3 gap-2 select-none">
      {keys.slice(0, 9).map((key) => (
        <button
          key={key}
          type="button"
          disabled={disabled}
          onClick={() => onDigit(key)}
          className="h-12 rounded-xl text-lg font-bold bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-700 active:scale-95 transition flex items-center justify-center shadow-2xs disabled:opacity-50"
        >
          {key}
        </button>
      ))}

      {/* Dot */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => onDigit('.')}
        className="h-12 rounded-xl text-lg font-bold bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-700 active:scale-95 transition flex items-center justify-center shadow-2xs disabled:opacity-50"
      >
        .
      </button>

      {/* 0 */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => onDigit('0')}
        className="h-12 rounded-xl text-lg font-bold bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-700 active:scale-95 transition flex items-center justify-center shadow-2xs disabled:opacity-50"
      >
        0
      </button>

      {/* Backspace */}
      <button
        type="button"
        disabled={disabled}
        onClick={onDelete}
        className="h-12 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-200 dark:hover:bg-zinc-700 active:scale-95 transition flex items-center justify-center shadow-2xs disabled:opacity-50"
        title="Effacer"
      >
        <Delete className="w-5 h-5" />
      </button>

      {/* Clear & Validate row */}
      <div className="col-span-3 grid grid-cols-3 gap-2 mt-1">
        <button
          type="button"
          disabled={disabled}
          onClick={onClear}
          className="h-11 rounded-xl text-xs font-semibold bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition flex items-center justify-center"
        >
          Reset
        </button>
        <button
          type="button"
          disabled={disabled}
          onClick={onSubmit}
          className="col-span-2 h-11 rounded-xl text-sm font-semibold bg-blue-600 text-white hover:bg-blue-500 active:scale-98 transition flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
        >
          <Check className="w-4 h-4" />
          Valider
        </button>
      </div>
    </div>
  );
};
