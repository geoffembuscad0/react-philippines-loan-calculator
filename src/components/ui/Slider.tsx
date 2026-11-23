import type { CSSProperties } from 'react';

interface SliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
  /** Turns the number into the big text on the right, e.g. 60000 -> "₱60,000". */
  format: (value: number) => string;
}

/** A labelled range slider. The filled part of the track is drawn in index.css via --fill. */
export function Slider({ label, value, min, max, step, onChange, format }: SliderProps) {
  // How far along the track the thumb is, 0–100. index.css uses it to color the filled part.
  const fillPercent = ((value - min) / (max - min)) * 100;

  return (
    <div>
      <div className="flex items-end justify-between mb-2">
        <span className="label !mb-0">{label}</span>
        <span className="text-[18px] font-extrabold">{format(value)}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{ '--fill': fillPercent + '%' } as CSSProperties}
        aria-label={label}
      />
    </div>
  );
}
