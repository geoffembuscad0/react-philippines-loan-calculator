import type { ReactNode } from 'react';

interface NumberFieldProps {
  /** Used to connect the <label> to the <input> (needed for accessibility). */
  id: string;
  label: ReactNode;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  step?: string;
  /** Symbol shown inside the left edge of the input, e.g. "₱". */
  prefix?: string;
  /** Symbol shown inside the right edge of the input, e.g. "%". */
  suffix?: string;
  /** Slightly shorter input, used in the Compare section. */
  compact?: boolean;
  /** Extra content shown under the input (help text, warnings). */
  below?: ReactNode;
}

/** A labelled number input, optionally with a ₱ / % symbol inside it. */
export function NumberField({ id, label, value, onChange, min, step, prefix, suffix, compact, below }: NumberFieldProps) {
  // Extra padding keeps the typed number from running under the symbol.
  const inputClass = ['field', prefix && '!pl-8', suffix && '!pr-10', compact && '!py-2.5']
    .filter(Boolean)
    .join(' ');

  return (
    <div>
      <label className="label" htmlFor={id}>{label}</label>
      <div className="relative">
        {prefix && (
          <span className="absolute left-4 top-1/2 -translate-y-1/2 font-extrabold" style={{ color: 'var(--muted)' }}>
            {prefix}
          </span>
        )}
        <input
          id={id}
          className={inputClass}
          type="number"
          min={min}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
        />
        {suffix && (
          <span className="absolute right-4 top-1/2 -translate-y-1/2 font-bold" style={{ color: 'var(--muted)' }}>
            {suffix}
          </span>
        )}
      </div>
      {below}
    </div>
  );
}
