/**
 * The loan math. This file has NO React in it, so it is easy to read,
 * test, and reuse on its own.
 *
 * The standard loan-payment formula (PMT) is:
 *
 *     payment = P × r ÷ (1 − (1 + r) ^ −n)
 *
 *   P = amount borrowed (principal)
 *   r = interest rate per period (annual rate ÷ periods per year)
 *   n = number of payments
 */
import { PERIODS_PER_YEAR } from '../constants';
import type { Freq, LoanResult, ScheduleRow, TermUnit } from '../types';
import { buildDueDates } from './dates';
import { formatDate } from './format';

/** Everything `calcLoan` needs. */
export interface LoanParams {
  /** Amount borrowed, in pesos. */
  principal: number;
  /** Annual interest rate in percent (10 = 10%). */
  annualRatePct: number;
  termMonths: number;
  freq: Freq;
  /** "YYYY-MM-DD" from the date input. Empty string means "today". */
  startDate: string;
  /** Pesos per payment the employer covers. */
  subsidyPerPayment: number;
  /** One-time fee, in percent of the principal. */
  processingFeePct: number;
}

/** Converts the term the user entered (months or years) into months. */
export function termToMonths(value: number, unit: TermUnit): number {
  return unit === 'years' ? value * 12 : value;
}

/** The monthly payment for a standard amortized loan. */
function monthlyPaymentFor(principal: number, annualRatePct: number, termMonths: number): number {
  const monthlyRate = annualRatePct / 100 / 12;
  const months = Math.max(1, termMonths);

  // 0% interest: the formula would divide by zero, so just split evenly.
  if (monthlyRate === 0) return principal / months;

  return (principal * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -months));
}

/** Converts the monthly payment into the payment for one period of `freq`. */
function perPeriodPayment(monthly: number, freq: Freq): number {
  switch (freq) {
    case 'monthly':
      return monthly;
    case 'semi':
      return monthly / 2;
    case 'biweekly':
      return (monthly * 12) / 26;
    case 'weekly':
      return (monthly * 12) / 52;
  }
}

/** Calculates the payment, totals, and the full amortization schedule. */
export function calcLoan(params: LoanParams): LoanResult {
  const { annualRatePct, termMonths, freq, subsidyPerPayment, processingFeePct } = params;

  const principal = Math.max(0, params.principal);
  const paymentCount = Math.max(1, Math.round((termMonths * PERIODS_PER_YEAR[freq]) / 12));

  const monthlyPayment = monthlyPaymentFor(principal, annualRatePct, termMonths);
  const perPeriod = perPeriodPayment(monthlyPayment, freq);

  const startDate = params.startDate ? new Date(params.startDate + 'T00:00:00') : new Date();
  const dueDates = buildDueDates(startDate, paymentCount, freq);
  const ratePerPeriod = annualRatePct / 100 / PERIODS_PER_YEAR[freq];

  // Walk through every payment: interest is charged on the remaining balance,
  // and whatever is left of the payment reduces the balance.
  const schedule: ScheduleRow[] = [];
  let balance = principal;

  for (let i = 0; i < paymentCount; i++) {
    const interest = balance * ratePerPeriod;

    // The last payment clears whatever is left (absorbs rounding drift).
    let payment = i === paymentCount - 1 ? balance + interest : perPeriod;
    // Safety net: a payment must at least cover the interest.
    if (payment < interest) payment = interest + 0.01;

    const principalPaid = Math.min(balance, payment - interest);
    balance = Math.max(0, balance - principalPaid);

    const employer = Math.min(subsidyPerPayment, payment);

    schedule.push({
      period: i + 1,
      due: formatDate(dueDates[i]),
      payment,
      principal: principalPaid,
      interest,
      employer,
      employee: Math.max(0, payment - employer),
      balance,
    });
  }

  const totalRepayment = schedule.reduce((sum, row) => sum + row.payment, 0);

  return {
    monthlyPayment,
    perPeriod,
    paymentCount,
    totalRepayment,
    totalInterest: Math.max(0, totalRepayment - principal),
    processingFee: (principal * processingFeePct) / 100,
    payoffDate: schedule.length ? schedule[schedule.length - 1].due : '—',
    effectiveMonthlyRatePct: (Math.pow(1 + annualRatePct / 100, 1 / 12) - 1) * 100,
    schedule,
    employerTotal: schedule.reduce((sum, row) => sum + row.employer, 0),
  };
}
