import type { ReactNode } from 'react';

interface PillProps {
  children: ReactNode;
  /** Background color (a CSS color or variable, e.g. "var(--accent-soft)"). */
  background: string;
  /** Text color. Leave out to use the normal text color. */
  color?: string;
  /** Font weight class. Defaults to "font-bold". */
  weight?: string;
}

/** A small rounded badge such as "SSS preset" or "24 payments". */
export function Pill({ children, background, color, weight = 'font-bold' }: PillProps) {
  return (
    <span className={`text-[12px] ${weight} px-3 py-1.5 rounded-full`} style={{ background, color }}>
      {children}
    </span>
  );
}
