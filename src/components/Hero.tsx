import { Sparkles } from 'lucide-react';
import { freqShortLabel, peso } from '../lib/format';
import type { Freq } from '../types';

interface HeroProps {
  freq: Freq;
  perPeriod: number;
  payoffDate: string;
}

/** The big headline plus two quick-glance numbers. */
export function Hero({ freq, perPeriod, payoffDate }: HeroProps) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4 mb-5">
      <div className="max-w-[720px]">
        <span
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-extrabold"
          style={{ background: 'var(--violet-soft)', color: 'var(--accent-2)' }}
        >
          <Sparkles className="w-3.5 h-3.5" /> SSS • Pag-IBIG • In-house • Bank
        </span>

        {/* clamp(min, preferred, max) makes the font grow smoothly with the screen width. */}
        <h1 className="font-extrabold leading-[1.02] mt-3" style={{ fontSize: 'clamp(32px,5vw,54px)' }}>
          Work out the loan<br />before payroll does.
        </h1>
        <p className="mt-3 text-[15px] sm:text-[17px] leading-relaxed font-medium max-w-[620px]" style={{ color: 'var(--muted)' }}>
          Set the amount, rate and schedule once. See exactly what the employee pays, what the company shoulders, and when the balance reaches zero.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-2 w-full sm:w-auto">
        <QuickStat label={`Per ${freqShortLabel(freq)}`} value={peso(perPeriod)} />
        <QuickStat label="Payoff" value={payoffDate} />
      </div>
    </div>
  );
}

function QuickStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[20px] px-4 py-3 text-center" style={{ background: 'var(--surface)', boxShadow: 'var(--shadow)' }}>
      <p className="text-[11px] font-extrabold uppercase tracking-wider" style={{ color: 'var(--muted)' }}>{label}</p>
      <p className="text-[20px] font-extrabold">{value}</p>
    </div>
  );
}
