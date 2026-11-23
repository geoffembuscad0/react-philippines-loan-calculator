/** Small helpers that turn numbers and dates into display text. */
import { FREQ_LABEL } from '../constants';
import type { Freq } from '../types';

/** 1234.5 -> "₱1,234.50" */
export function peso(amount: number): string {
  return '₱' + amount.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

/** 1234.5 -> "₱1,235" (rounded, no centavos) */
export function peso0(amount: number): string {
  return '₱' + Math.round(amount).toLocaleString('en-PH');
}

/** Date -> "Jun 15, 2026" */
export function formatDate(date: Date): string {
  return date.toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: 'numeric' });
}

/** "Semi-monthly • 15th & 30th" -> "Semi-monthly" (the part before the bullet). */
export function freqShortLabel(freq: Freq): string {
  return FREQ_LABEL[freq].split('•')[0].trim();
}
