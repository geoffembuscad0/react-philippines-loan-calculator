interface SegmentedProps<T extends string> {
  options: { value: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
  /** Accessible name for the group, read by screen readers. */
  ariaLabel: string;
}

/** A pill-shaped "choose one" toggle, e.g. Months | Years. */
export function Segmented<T extends string>({ options, value, onChange, ariaLabel }: SegmentedProps<T>) {
  return (
    <div className="flex p-1.5 rounded-full gap-1" style={{ background: 'var(--surface-2)' }} role="group" aria-label={ariaLabel}>
      {options.map((option) => {
        const isSelected = option.value === value;
        return (
          <button
            key={option.value}
            onClick={() => onChange(option.value)}
            className={`flex-1 px-3 py-2.5 rounded-full text-[13px] font-bold transition ${
              isSelected ? 'bg-white text-slate-900 shadow' : 'text-[var(--muted)]'
            }`}
            style={isSelected ? { background: 'var(--surface)' } : {}}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
