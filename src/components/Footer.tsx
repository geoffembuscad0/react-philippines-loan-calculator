import { Building2 } from 'lucide-react';

/** Disclaimer plus the formula the calculator uses. */
export function Footer() {
  return (
    <footer className="mt-6 rounded-[24px] p-5 flex flex-wrap gap-3 items-center" style={{ background: 'var(--surface-2)' }}>
      <Building2 className="w-5 h-5 shrink-0" style={{ color: 'var(--accent)' }} />
      <p className="text-[13px] font-medium leading-relaxed flex-1 min-w-[260px]" style={{ color: 'var(--muted)' }}>
        For estimation only. Verify eligibility, caps, fees and repayment rules with the official SSS and Pag-IBIG guidelines, and with your company policy, before approving or deducting any loan.
      </p>
      <span className="text-[12px] font-bold px-3 py-2 rounded-full" style={{ background: 'var(--surface)' }}>
        PMT = P × r ÷ (1 − (1+r)<sup>−n</sup>) • 0% handled
      </span>
    </footer>
  );
}
