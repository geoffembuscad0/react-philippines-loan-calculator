/**
 * App.tsx — the top of the component tree.
 *
 * This file does three things:
 *   1. Keeps the form values (the app's "state").
 *   2. Runs the loan calculation whenever those values change.
 *   3. Lays out the page and hands the data to each section component.
 *
 * Where things live:
 *   constants.ts          presets, labels, business rules
 *   lib/loan.ts           the loan math (no React)
 *   components/           one file per section of the page
 *   components/ui/        small reusable pieces (Card, Pill, Slider, ...)
 *   components/charts/    the three charts
 */
import { useMemo, useState } from 'react';
import { AffordabilityCard } from './components/AffordabilityCard';
import { AmortizationSchedule } from './components/AmortizationSchedule';
import { BalanceChart } from './components/charts/BalanceChart';
import { SpendingDonut } from './components/charts/SpendingDonut';
import { CompareScenarios } from './components/CompareScenarios';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { LoanForm } from './components/LoanForm';
import { PaymentSummary } from './components/PaymentSummary';
import { DEFAULT_INPUTS, PRESETS } from './constants';
import { useTheme } from './hooks/useTheme';
import { calcLoan, termToMonths } from './lib/loan';
import type { LoanInputs, PresetKey } from './types';

export default function App() {
  const { now, themeMode, setThemeMode, resolvedTheme } = useTheme();

  // All form values live in one object. Changing any value re-renders the page.
  const [inputs, setInputs] = useState<LoanInputs>(DEFAULT_INPUTS);

  /** Change a single form field: setInput('salary', 35000). */
  const setInput = <K extends keyof LoanInputs>(field: K, value: LoanInputs[K]) => {
    setInputs((previous) => ({ ...previous, [field]: value }));
  };

  /** Clicking a preset button fills in that loan type's usual rate and term. */
  const selectPreset = (key: PresetKey) => {
    const preset = PRESETS[key];
    setInputs((previous) => ({
      ...previous,
      preset: key,
      rate: preset.rate,
      termVal: preset.term,
      termUnit: 'months',
      // SSS loans are capped at about 2 months of salary, so start with a safe amount.
      ...(key === 'sss' ? { amount: Math.min(60000, previous.salary * 2 || 60000) } : {}),
    }));
  };

  // Recalculate only when a value that affects the loan changes.
  const termMonths = termToMonths(inputs.termVal, inputs.termUnit);
  const loan = useMemo(
    () =>
      calcLoan({
        principal: inputs.amount,
        annualRatePct: inputs.rate,
        termMonths,
        freq: inputs.freq,
        startDate: inputs.start,
        subsidyPerPayment: inputs.subsidy,
        processingFeePct: inputs.feePct,
      }),
    [inputs.amount, inputs.rate, termMonths, inputs.freq, inputs.start, inputs.subsidy, inputs.feePct],
  );

  return (
    // data-theme switches the CSS color variables (see index.css) between light and dark.
    <div data-theme={resolvedTheme} className="overflow-x-clip" style={{ minHeight: '100dvh', background: 'var(--bg)', color: 'var(--text)' }}>
      <Header now={now} themeMode={themeMode} resolvedTheme={resolvedTheme} onThemeModeChange={setThemeMode} />

      <main className="max-w-[1280px] mx-auto px-4 sm:px-6 pb-10 pt-5">
        <Hero freq={inputs.freq} perPeriod={loan.perPeriod} payoffDate={loan.payoffDate} />

        {/* Form on the left, results on the right (stacked on screens narrower than 1024px) */}
        <div className="grid grid-cols-1 lg:grid-cols-[1.05fr_.95fr] gap-5 items-start">
          <LoanForm inputs={inputs} onChange={setInput} onSelectPreset={selectPreset} result={loan} />

          <section className="space-y-5 min-w-0">
            <PaymentSummary result={loan} freq={inputs.freq} subsidy={inputs.subsidy} />
            <AffordabilityCard
              monthlyPayment={loan.monthlyPayment}
              salary={inputs.salary}
              effectiveMonthlyRatePct={loan.effectiveMonthlyRatePct}
              annualRatePct={inputs.rate}
            />
            <SpendingDonut principal={inputs.amount} interest={loan.totalInterest} />
          </section>
        </div>

        {/* Payment-by-payment schedule + balance chart */}
        <div className="grid grid-cols-1 lg:grid-cols-[1.25fr_.75fr] gap-5 mt-5 items-start">
          <AmortizationSchedule schedule={loan.schedule} employeeName={inputs.employee} />
          <BalanceChart schedule={loan.schedule} payoffDate={loan.payoffDate} />
        </div>

        <CompareScenarios inputs={inputs} current={loan} />
        <Footer />
      </main>
    </div>
  );
}
