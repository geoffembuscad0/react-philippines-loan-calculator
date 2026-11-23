/**
 * Shared TypeScript types.
 * Keeping them in one file means every other file can import them
 * without creating circular imports.
 */

/** How often the employee pays back the loan. */
export type Freq = 'monthly' | 'semi' | 'biweekly' | 'weekly';

/** The built-in loan products the user can pick from. */
export type PresetKey = 'sss' | 'mpl' | 'calamity' | 'company' | 'personal';

/** What the user chose in the Auto / Light / Dark toggle. */
export type ThemeMode = 'auto' | 'light' | 'dark';

/** The theme that is actually applied ("auto" is resolved to one of these). */
export type ResolvedTheme = 'light' | 'dark';

export type TermUnit = 'months' | 'years';

/** Default values a preset fills in when the user clicks it. */
export interface Preset {
  name: string;
  /** Annual interest rate in percent (10 = 10% per year). */
  rate: number;
  /** Term in months. */
  term: number;
  /** Helper text shown under the preset buttons. */
  hint: string;
  /** Short badge text, e.g. "SSS". */
  tag: string;
}

/** Everything the user can type or select in the calculator form. */
export interface LoanInputs {
  preset: PresetKey;
  employee: string;
  /** Monthly salary in PHP. */
  salary: number;
  /** Loan amount (principal) in PHP. */
  amount: number;
  /** Annual interest rate in percent. */
  rate: number;
  /** Term number as typed/slid; its unit is `termUnit`. */
  termVal: number;
  termUnit: TermUnit;
  freq: Freq;
  /** First day of the loan, as "YYYY-MM-DD" (the format <input type="date"> uses). */
  start: string;
  /** Pesos the employer pays toward each payment. */
  subsidy: number;
  /** One-time processing fee in percent of the loan amount. */
  feePct: number;
  /** Late penalty in percent per month (information only). */
  latePct: number;
}

/** One line of the amortization schedule. */
export interface ScheduleRow {
  /** Payment number, starting at 1. */
  period: number;
  /** Due date, already formatted for display. */
  due: string;
  payment: number;
  principal: number;
  interest: number;
  /** Part of the payment covered by the employer subsidy. */
  employer: number;
  /** Part of the payment the employee pays. */
  employee: number;
  /** Loan balance left after this payment. */
  balance: number;
}

/** The result of a loan calculation. */
export interface LoanResult {
  /** Monthly payment (before converting to the chosen frequency). */
  monthlyPayment: number;
  /** Payment amount for one period of the chosen frequency. */
  perPeriod: number;
  /** How many payments there are in total. */
  paymentCount: number;
  totalRepayment: number;
  totalInterest: number;
  /** One-time processing fee in pesos. */
  processingFee: number;
  /** Date of the final payment, formatted for display. */
  payoffDate: string;
  /** The annual rate converted to its compounding monthly equivalent, in percent. */
  effectiveMonthlyRatePct: number;
  schedule: ScheduleRow[];
  /** Sum of all employer subsidies over the life of the loan. */
  employerTotal: number;
}
