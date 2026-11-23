import { Wallet } from 'lucide-react';
import { BRAND_GRADIENT } from '../constants';
import { freqShortLabel, peso } from '../lib/format';
import type { Freq, LoanResult } from '../types';

interface PaymentSummaryProps {
  result: LoanResult;
  freq: Freq;
  /** Pesos the employer pays per payment. */
  subsidy: number;
}

/** The blue gradient card with the headline payment and totals. */
export function PaymentSummary({ result, freq, subsidy }: PaymentSummaryProps) {
  return (
    <div className="rounded-[28px] p-5 sm:p-6 text-white" style={{ background: BRAND_GRADIENT, boxShadow: 'var(--shadow-lg)' }}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[12px] font-extrabold uppercase tracking-[.12em] opacity-80">
            Payment per {freqShortLabel(freq).toLowerCase()}
          </p>
          <p className="font-extrabold leading-none mt-2" style={{ fontSize: 'clamp(34px,6vw,48px)' }}>
            {peso(result.perPeriod)}
          </p>
          <p className="text-[13px] font-medium mt-2 opacity-85">
            Monthly equivalent {peso(result.monthlyPayment)} • {result.paymentCount} payments
          </p>
        </div>
        <div className="w-12 h-12 rounded-[16px] bg-white/20 flex items-center justify-center shrink-0">
          <Wallet className="w-6 h-6" />
        </div>
      </div>

      {/* 2 columns on phones (Payoff spans the full row), 3 columns from sm up */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-5 text-center">
        <Stat label="Total interest" value={peso(result.totalInterest)} />
        <Stat label="Total repayment" value={peso(result.totalRepayment)} />
        <Stat label="Payoff" value={result.payoffDate} className="col-span-2 sm:col-span-1" allowBreak={false} />
      </div>

      {subsidy > 0 && (
        <p className="mt-4 text-[13px] font-semibold bg-black/15 rounded-[14px] px-3 py-2.5">
          Employer covers {peso(subsidy)} / payment — employee pays {peso(Math.max(0, result.perPeriod - subsidy))}. Company total: {peso(result.employerTotal)}.
        </p>
      )}
    </div>
  );
}

interface StatProps {
  label: string;
  value: string;
  className?: string;
  /** Allow long numbers to wrap mid-number instead of overflowing. */
  allowBreak?: boolean;
}

function Stat({ label, value, className = '', allowBreak = true }: StatProps) {
  return (
    <div className={`${className} rounded-[18px] bg-white/15 px-2 py-3`}>
      <p className="text-[11px] font-bold opacity-80">{label}</p>
      <p className={`font-extrabold mt-1 ${allowBreak ? '[overflow-wrap:anywhere]' : ''}`}>{value}</p>
    </div>
  );
}
