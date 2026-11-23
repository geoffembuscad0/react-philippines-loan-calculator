import { AlertTriangle, Calculator, Info } from 'lucide-react';
import type { ReactNode } from 'react';
import {
  FREQ_KEYS,
  FREQ_LABEL,
  PERIODS_PER_YEAR,
  PRESET_KEYS,
  PRESETS,
  SSS_CAP_MONTHS_OF_SALARY,
} from '../constants';
import { peso, peso0 } from '../lib/format';
import { termToMonths } from '../lib/loan';
import type { LoanInputs, LoanResult, PresetKey, TermUnit } from '../types';
import { Card } from './ui/Card';
import { NumberField } from './ui/NumberField';
import { Pill } from './ui/Pill';
import { Segmented } from './ui/Segmented';
import { Slider } from './ui/Slider';

interface LoanFormProps {
  inputs: LoanInputs;
  /** Update ONE field: onChange('salary', 35000). */
  onChange: <K extends keyof LoanInputs>(field: K, value: LoanInputs[K]) => void;
  /** Clicking a preset changes several fields at once, so it has its own handler. */
  onSelectPreset: (key: PresetKey) => void;
  /** The current calculation (used for the small "One-time fee" and "late payment" notes). */
  result: LoanResult;
}

const TERM_UNIT_OPTIONS: { value: TermUnit; label: string }[] = [
  { value: 'months', label: 'Months' },
  { value: 'years', label: 'Years' },
];

/** Border + background for a "selected / not selected" option button. */
function choiceStyle(isSelected: boolean) {
  return {
    borderColor: isSelected ? 'var(--accent)' : 'var(--border)',
    background: isSelected ? 'var(--accent-soft)' : 'var(--surface)',
  };
}

/** The left card: every input the user can change. */
export function LoanForm({ inputs, onChange, onSelectPreset, result }: LoanFormProps) {
  const { preset, salary, amount, termVal, termUnit, freq } = inputs;
  const termMonths = termToMonths(termVal, termUnit);
  const isOverSssCap = preset === 'sss' && amount > salary * SSS_CAP_MONTHS_OF_SALARY;

  return (
    <Card className="min-w-0 p-5 sm:p-6">
      {/* Card title + current preset badge */}
      <div className="flex items-center justify-between gap-3 mb-5">
        <h2 className="text-[19px] font-extrabold flex items-center gap-2">
          <Calculator className="w-5 h-5" style={{ color: 'var(--accent)' }} /> Calculator
        </h2>
        <Pill background="var(--accent-soft)" color="var(--accent)">{PRESETS[preset].tag} preset</Pill>
      </div>

      {/* 1. Loan type presets (swipe sideways on small screens) */}
      <p className="label">Loan type preset</p>
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1 -mx-1 px-1 mb-5">
        {PRESET_KEYS.map((key) => (
          <button
            key={key}
            onClick={() => onSelectPreset(key)}
            className="shrink-0 text-left rounded-[20px] px-4 py-3 border-2 min-w-[168px]"
            style={choiceStyle(preset === key)}
          >
            <span className="block text-[13px] font-extrabold leading-tight">{PRESETS[key].name}</span>
            <span className="block text-[12px] font-semibold mt-1" style={{ color: 'var(--muted)' }}>
              {PRESETS[key].rate}% p.a. • {PRESETS[key].term} mo
            </span>
          </button>
        ))}
      </div>
      <p className="text-[13px] font-medium leading-relaxed rounded-[16px] px-3.5 py-3 mb-5 flex gap-2" style={{ background: 'var(--surface-2)', color: 'var(--muted)' }}>
        <Info className="w-4 h-4 shrink-0 mt-0.5" />
        {PRESETS[preset].hint}
      </p>

      {/* 2. Employee info */}
      <div className="grid sm:grid-cols-2 gap-4 mb-5">
        <div>
          <label className="label" htmlFor="emp">
            Employee name <span style={{ color: 'var(--muted-2)' }}>(optional)</span>
          </label>
          <input id="emp" className="field" value={inputs.employee} onChange={(e) => onChange('employee', e.target.value)} placeholder="e.g. Maria Santos" />
        </div>
        <NumberField id="salary" label="Monthly salary" prefix="₱" min={0} value={salary} onChange={(v) => onChange('salary', v)} />
      </div>

      <div className="space-y-5">
        {/* 3. Amount and rate */}
        <Slider label="Loan amount" value={amount} min={5000} max={500000} step={1000} onChange={(v) => onChange('amount', v)} format={peso0} />
        <div className="grid sm:grid-cols-2 gap-4">
          <NumberField
            id="amt"
            label="Exact amount"
            min={0}
            value={amount}
            onChange={(v) => onChange('amount', v)}
            below={
              isOverSssCap && (
                <p className="text-[12px] font-bold mt-1.5 flex gap-1" style={{ color: 'var(--warn)' }}>
                  <AlertTriangle className="w-3.5 h-3.5" /> Above the usual 2-month SSS cap of {peso0(salary * SSS_CAP_MONTHS_OF_SALARY)}.
                </p>
              )
            }
          />
          <NumberField id="rate" label="Annual interest rate" suffix="%" step="0.01" min={0} value={inputs.rate} onChange={(v) => onChange('rate', v)} />
        </div>

        {/* 4. Term */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="label !mb-0">Loan term</span>
            <span className="text-[15px] font-extrabold">{termMonths} months</span>
          </div>
          <Segmented options={TERM_UNIT_OPTIONS} value={termUnit} onChange={(v) => onChange('termUnit', v)} ariaLabel="Term unit" />
          <div className="mt-3">
            <Slider
              label={termUnit === 'months' ? 'Term in months' : 'Term in years'}
              value={termVal}
              min={1}
              max={termUnit === 'months' ? 60 : 5}
              step={1}
              onChange={(v) => onChange('termVal', v)}
              format={(v) => (termUnit === 'months' ? `${v} mo` : `${v} yr`)}
            />
          </div>
        </div>

        {/* 5. Payment frequency */}
        <div>
          <label className="label">Payment frequency</label>
          <div className="grid grid-cols-2 gap-2">
            {FREQ_KEYS.map((key) => (
              <button
                key={key}
                onClick={() => onChange('freq', key)}
                className="rounded-[16px] px-3 py-3 text-left border-2 text-[13px] font-bold"
                style={choiceStyle(freq === key)}
              >
                {FREQ_LABEL[key]}
                <span className="block text-[11px] font-semibold mt-0.5" style={{ color: 'var(--muted)' }}>
                  {PERIODS_PER_YEAR[key]} payments / year
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* 6. Start date and employer subsidy */}
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="label" htmlFor="start">Start date</label>
            <input id="start" className="field" type="date" value={inputs.start} onChange={(e) => onChange('start', e.target.value)} />
          </div>
          <NumberField id="sub" label="Employer subsidy / payment" prefix="₱" min={0} value={inputs.subsidy} onChange={(v) => onChange('subsidy', v)} />
        </div>

        {/* 7. Fees and penalties */}
        <div className="grid sm:grid-cols-2 gap-4">
          <NumberField
            id="fee"
            label="Processing fee"
            suffix="%"
            min={0}
            step="0.1"
            value={inputs.feePct}
            onChange={(v) => onChange('feePct', v)}
            below={<HelperText>One-time: {peso(result.processingFee)}</HelperText>}
          />
          <NumberField
            id="late"
            label="Late penalty info"
            suffix="% / mo"
            min={0}
            step="0.1"
            value={inputs.latePct}
            onChange={(v) => onChange('latePct', v)}
            below={<HelperText>On a missed {peso(result.perPeriod)} payment: {peso((result.perPeriod * inputs.latePct) / 100)}</HelperText>}
          />
        </div>
      </div>
    </Card>
  );
}

/** Small gray note under an input. */
function HelperText({ children }: { children: ReactNode }) {
  return <p className="text-[12px] font-semibold mt-1.5" style={{ color: 'var(--muted)' }}>{children}</p>;
}
