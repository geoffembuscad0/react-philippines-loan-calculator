import { ArrowRight, Plus, X } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { BRAND_GRADIENT, CHART_COLORS, FREQ_KEYS, FREQ_LABEL, PRESET_KEYS, PRESETS } from '../constants';
import { peso } from '../lib/format';
import { calcLoan, termToMonths } from '../lib/loan';
import type { Freq, LoanInputs, LoanResult, PresetKey } from '../types';
import { formatAxisThousands, formatTooltipPeso, TOOLTIP_STYLE } from './charts/chartTheme';
import { Card } from './ui/Card';
import { NumberField } from './ui/NumberField';
import { Pill } from './ui/Pill';

interface CompareScenariosProps {
  /** What the user entered in the main form (Scenario A). */
  inputs: LoanInputs;
  /** The calculation for Scenario A. */
  current: LoanResult;
}

/** The settings for Scenario B. This state lives here because nothing else needs it. */
interface ScenarioB {
  preset: PresetKey;
  amount: number;
  rate: number;
  termMonths: number;
  freq: Freq;
}

const INITIAL_SCENARIO_B: ScenarioB = { preset: 'company', amount: 60000, rate: 6, termMonths: 12, freq: 'monthly' };

/** Lets the user compare the main loan (A) against a second loan (B). */
export function CompareScenarios({ inputs, current }: CompareScenariosProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [b, setB] = useState<ScenarioB>(INITIAL_SCENARIO_B);

  // Scenario B uses the same start date as A, and has no subsidy or fee.
  const scenarioB = useMemo(
    () =>
      calcLoan({
        principal: b.amount,
        annualRatePct: b.rate,
        termMonths: b.termMonths,
        freq: b.freq,
        startDate: inputs.start,
        subsidyPerPayment: 0,
        processingFeePct: 0,
      }),
    [b.amount, b.rate, b.termMonths, b.freq, inputs.start],
  );

  /** Picking a preset also fills in that preset's usual rate and term. */
  const selectPresetB = (key: PresetKey) => setB({ ...b, preset: key, rate: PRESETS[key].rate, termMonths: PRESETS[key].term });

  // Data for the stacked bar chart: principal + interest for each scenario.
  const chartData = [
    { name: 'A • Current', principal: inputs.amount, interest: Math.round(current.totalInterest) },
    { name: 'B • Compare', principal: b.amount, interest: Math.round(scenarioB.totalInterest) },
  ];

  return (
    <Card className="min-w-0 p-5 sm:p-6 mt-5">
      <div className="flex flex-wrap items-center gap-3">
        <h2 className="text-[19px] font-extrabold">Compare scenarios</h2>
        <Pill background="var(--violet-soft)" color="var(--accent-2)">e.g. SSS vs. Company loan</Pill>

        {isOpen ? (
          <button onClick={() => setIsOpen(false)} className="ml-auto inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-[13px] font-bold" style={{ background: 'var(--surface-2)' }}>
            <X className="w-4 h-4" /> Remove comparison
          </button>
        ) : (
          <button onClick={() => setIsOpen(true)} className="ml-auto inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-[13px] font-extrabold text-white" style={{ background: BRAND_GRADIENT }}>
            <Plus className="w-4 h-4" /> Add second scenario
          </button>
        )}
      </div>

      {!isOpen ? (
        <p className="mt-3 text-[14px] font-medium" style={{ color: 'var(--muted)' }}>
          Add a second scenario to see which option costs less in total interest — and which fits payroll better.
        </p>
      ) : (
        <>
          {/* A and B side by side on large screens (lg = 1024px+), stacked below that */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-5">
            {/* Scenario A: read-only summary of the main form */}
            <div className="rounded-[22px] p-4" style={{ background: 'var(--surface-2)' }}>
              <p className="font-extrabold">Scenario A — Current</p>
              <p className="text-[13px] font-semibold" style={{ color: 'var(--muted)' }}>
                {PRESETS[inputs.preset].name} • {peso(inputs.amount)} • {inputs.rate}% • {termToMonths(inputs.termVal, inputs.termUnit)} mo • {FREQ_LABEL[inputs.freq]}
              </p>
              <ScenarioStats result={current} />
            </div>

            {/* Scenario B: editable */}
            <div className="rounded-[22px] p-4 border-2" style={{ borderColor: 'var(--accent)' }}>
              <p className="font-extrabold">Scenario B — Compare</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3">
                <select className="field !py-2.5" aria-label="Scenario B loan type" value={b.preset} onChange={(e) => selectPresetB(e.target.value as PresetKey)}>
                  {PRESET_KEYS.map((key) => (
                    <option key={key} value={key}>{PRESETS[key].name}</option>
                  ))}
                </select>
                <select className="field !py-2.5" aria-label="Scenario B payment frequency" value={b.freq} onChange={(e) => setB({ ...b, freq: e.target.value as Freq })}>
                  {FREQ_KEYS.map((key) => (
                    <option key={key} value={key}>{FREQ_LABEL[key]}</option>
                  ))}
                </select>
                <NumberField compact id="bamt" label="Loan amount (₱)" value={b.amount} onChange={(v) => setB({ ...b, amount: v })} />
                <NumberField compact id="brate" label="Interest rate (% p.a.)" step="0.1" value={b.rate} onChange={(v) => setB({ ...b, rate: v })} />
                <div className="sm:col-span-2">
                  <NumberField compact id="bterm" label="Term (months)" value={b.termMonths} onChange={(v) => setB({ ...b, termMonths: v })} />
                </div>
              </div>
              <ScenarioStats result={scenarioB} />
            </div>
          </div>

          {/* Stacked bar chart: principal (blue) + interest (purple) */}
          <div className="h-[220px] mt-5">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} layout="vertical" margin={{ left: 0, right: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis type="number" tick={{ fontSize: 11, fill: 'var(--muted)' }} tickFormatter={formatAxisThousands} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 12, fill: 'var(--text)', fontWeight: 700 }} width={96} />
                <Tooltip formatter={formatTooltipPeso} contentStyle={TOOLTIP_STYLE} />
                <Bar dataKey="principal" stackId="a" fill={CHART_COLORS.principal} radius={[0, 0, 0, 0]} />
                <Bar dataKey="interest" stackId="a" fill={CHART_COLORS.interest} radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <p className="mt-3 text-[14px] font-semibold flex gap-2 flex-wrap items-center">
            <ArrowRight className="w-4 h-4" style={{ color: 'var(--accent)' }} /> {winnerMessage(current, scenarioB)}{' '}
            <span style={{ color: 'var(--muted)' }}>Payoff B: {scenarioB.payoffDate}.</span>
          </p>
        </>
      )}
    </Card>
  );
}

/** Says which scenario costs less overall, and by how much. */
function winnerMessage(a: LoanResult, b: LoanResult): string {
  if (b.totalRepayment < a.totalRepayment) return `Scenario B saves ${peso(a.totalRepayment - b.totalRepayment)} overall.`;
  if (b.totalRepayment > a.totalRepayment) return `Scenario A saves ${peso(b.totalRepayment - a.totalRepayment)} overall.`;
  return 'Both scenarios cost the same overall.';
}

/** The three small number tiles (per payment / total interest / total). */
function ScenarioStats({ result }: { result: LoanResult }) {
  const stats = [
    { label: 'Per payment', value: peso(result.perPeriod) },
    { label: 'Total interest', value: peso(result.totalInterest) },
    { label: 'Total', value: peso(result.totalRepayment) },
  ];

  return (
    <div className="grid grid-cols-1 min-[480px]:grid-cols-3 gap-2 mt-3 text-center">
      {stats.map((stat) => (
        <div key={stat.label} className="rounded-[16px] p-3" style={{ background: 'var(--surface)' }}>
          <p className="text-[11px] font-bold" style={{ color: 'var(--muted)' }}>{stat.label}</p>
          <p className="font-extrabold [overflow-wrap:anywhere]">{stat.value}</p>
        </div>
      ))}
    </div>
  );
}
