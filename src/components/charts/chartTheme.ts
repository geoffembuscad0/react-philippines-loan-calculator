import type { CSSProperties } from 'react';
import { peso } from '../../lib/format';

/** Look of the hover tooltip shared by all charts (follows the light/dark theme via CSS variables). */
export const TOOLTIP_STYLE: CSSProperties = {
  borderRadius: 16,
  border: '1px solid var(--border)',
  background: 'var(--surface)',
  color: 'var(--text)',
};

/** Formats a chart value as pesos for the tooltip. */
export function formatTooltipPeso(value: unknown): string {
  return peso(Number(value ?? 0));
}

/** Axis label such as 45000 -> "₱45k". */
export function formatAxisThousands(value: number): string {
  return `₱${Math.round(value / 1000)}k`;
}
