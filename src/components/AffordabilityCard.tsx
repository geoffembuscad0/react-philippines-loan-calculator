import { AlertTriangle, ShieldCheck, Users } from 'lucide-react';
import { AFFORDABILITY_LIMIT_PCT } from '../constants';
import { peso } from '../lib/format';
import { Card } from './ui/Card';
import { Pill } from './ui/Pill';

interface AffordabilityCardProps {
  monthlyPayment: number;
  salary: number;
  effectiveMonthlyRatePct: number;
  annualRatePct: number;
}

/** Debt-to-income (DTI) check: is the monthly payment a safe share of the salary? */
export function AffordabilityCard({ monthlyPayment, salary, effectiveMonthlyRatePct, annualRatePct }: AffordabilityCardProps) {
  // DTI = monthly payment as a percentage of monthly salary.
  const dti = salary > 0 ? (monthlyPayment / salary) * 100 : 0;
  const maxAffordable = salary * (AFFORDABILITY_LIMIT_PCT / 100);
  const needsReview = dti > AFFORDABILITY_LIMIT_PCT;

  return (
    <Card as="div" className="p-5">
      <div className="flex items-center justify-between">
        <h3 className="font-extrabold flex items-center gap-2">
          <Users className="w-5 h-5" style={{ color: 'var(--accent)' }} /> Affordability check
        </h3>
        <Pill
          weight="font-extrabold"
          background={needsReview ? 'var(--danger-soft)' : 'var(--success-soft)'}
          color={needsReview ? 'var(--danger)' : 'var(--success)'}
        >
          {needsReview ? 'Review needed' : `Within ${AFFORDABILITY_LIMIT_PCT}% guide`}
        </Pill>
      </div>

      <div className="mt-4">
        <div className="flex justify-between text-[13px] font-bold mb-2">
          <span>Debt-to-income</span>
          <span>{dti.toFixed(1)}% of salary</span>
        </div>

        {/* Progress bar: its width is the DTI, capped at 100%. */}
        <div className="h-3 rounded-full overflow-hidden" style={{ background: 'var(--surface-3)' }}>
          <div
            className="h-full rounded-full transition-all"
            style={{
              width: `${Math.min(100, dti)}%`,
              background: needsReview ? 'linear-gradient(90deg,#F59E0B,#E03131)' : 'linear-gradient(90deg,#2563EB,#7C3AED)',
            }}
          />
        </div>

        <div className="grid grid-cols-1 min-[420px]:grid-cols-2 gap-3 mt-4 text-[13px]">
          <div className="rounded-[16px] p-3" style={{ background: 'var(--surface-2)' }}>
            <p style={{ color: 'var(--muted)' }}>Max affordable ({AFFORDABILITY_LIMIT_PCT}%)</p>
            <p className="font-extrabold text-[16px] mt-0.5">{peso(maxAffordable)} / mo</p>
          </div>
          <div className="rounded-[16px] p-3" style={{ background: 'var(--surface-2)' }}>
            <p style={{ color: 'var(--muted)' }}>Effective monthly rate</p>
            <p className="font-extrabold text-[16px] mt-0.5">{effectiveMonthlyRatePct.toFixed(3)}% • {annualRatePct.toFixed(2)}% p.a.</p>
          </div>
        </div>

        {needsReview ? (
          <p className="mt-3 text-[13px] font-semibold flex gap-2" style={{ color: 'var(--warn)' }}>
            <AlertTriangle className="w-4 h-4 shrink-0" /> Payment is above {AFFORDABILITY_LIMIT_PCT}% of salary. Consider a longer term, smaller amount, or an employer subsidy.
          </p>
        ) : (
          <p className="mt-3 text-[13px] font-semibold flex gap-2" style={{ color: 'var(--success)' }}>
            <ShieldCheck className="w-4 h-4 shrink-0" /> This schedule keeps the monthly payment within the {AFFORDABILITY_LIMIT_PCT}% affordability guide.
          </p>
        )}
      </div>
    </Card>
  );
}
