/**
 * App-wide constants: loan presets, labels, and "magic numbers" with names.
 * If a business rule changes (for example the 30% affordability guide),
 * this is the one place to edit.
 */
import type { Freq, LoanInputs, Preset, PresetKey } from './types';

/** Built-in Philippine loan products. Rates are defaults for estimation only. */
export const PRESETS: Record<PresetKey, Preset> = {
  sss: { name: 'SSS Salary Loan', rate: 10, term: 24, hint: 'Up to 2 months’ salary. 10% p.a. over 24 months, service fee deducted from proceeds.', tag: 'SSS' },
  mpl: { name: 'Pag-IBIG Multi-Purpose Loan', rate: 10.5, term: 24, hint: 'Up to 80% of total savings. 10.5% p.a. Repaid through payroll deduction.', tag: 'Pag-IBIG' },
  calamity: { name: 'Pag-IBIG Calamity Loan', rate: 5.95, term: 24, hint: 'For members in a declared calamity area. Lower 5.95% p.a. rate.', tag: 'Pag-IBIG' },
  company: { name: 'Company / In-house Loan', rate: 6, term: 12, hint: 'Set your own company rate, cap, and subsidy. Terms are set by company policy.', tag: 'In-house' },
  personal: { name: 'Personal / Bank Loan', rate: 15, term: 24, hint: 'Use a bank or lender quote. Compare it against SSS / Pag-IBIG before approval.', tag: 'Bank' },
};

/** Preset keys in display order (used to render the buttons / <option>s). */
export const PRESET_KEYS = Object.keys(PRESETS) as PresetKey[];

/** Text shown for each payment frequency. */
export const FREQ_LABEL: Record<Freq, string> = {
  monthly: 'Monthly',
  semi: 'Semi-monthly • 15th & 30th',
  biweekly: 'Bi-weekly',
  weekly: 'Weekly',
};

/** Frequency keys in display order. */
export const FREQ_KEYS = Object.keys(FREQ_LABEL) as Freq[];

/** How many payments happen in one year for each frequency. */
export const PERIODS_PER_YEAR: Record<Freq, number> = {
  monthly: 12,
  semi: 24,
  biweekly: 26,
  weekly: 52,
};

/* ---------- Business rules ---------- */

/** A payment above this % of monthly salary is flagged as "Review needed". */
export const AFFORDABILITY_LIMIT_PCT = 30;

/** The usual SSS salary-loan cap, in months of salary. */
export const SSS_CAP_MONTHS_OF_SALARY = 2;

/* ---------- UI settings ---------- */

/** How many schedule rows are shown before the user clicks "Show all". */
export const SCHEDULE_PREVIEW_ROWS = 12;

/** "Auto" theme switches to dark from 6 PM until 6 AM. */
export const NIGHT_STARTS_AT_HOUR = 18;
export const NIGHT_ENDS_AT_HOUR = 6;

/* ---------- Brand colors (also used by the charts) ---------- */

export const BRAND_GRADIENT = 'linear-gradient(135deg,#2563EB,#7C3AED)';

export const CHART_COLORS = {
  principal: '#2563EB',
  interest: '#A78BFA',
  balance: '#7C3AED',
} as const;

/** What the form shows the first time the page loads. */
export const DEFAULT_INPUTS: LoanInputs = {
  preset: 'sss',
  employee: '',
  salary: 32000,
  amount: 60000,
  rate: 10,
  termVal: 24,
  termUnit: 'months',
  freq: 'monthly',
  start: '2026-06-15',
  subsidy: 0,
  feePct: 1,
  latePct: 1,
};
