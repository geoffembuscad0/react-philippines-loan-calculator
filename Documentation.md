# Documentation — PH Employer Loan Calculator

Complete documentation for the **PH Employer Loan Calculator**: a loan calculator for Philippine employers built with **React, HTML5, CSS3, TypeScript & Tailwind CSS**, with a OneUI 8-inspired UI and automatic dark / light mode.

---

## Table of Contents

1. [Overview](#1-overview)
2. [Target Users & Use Cases](#2-target-users--use-cases)
3. [Tech Stack & Architecture](#3-tech-stack--architecture)
4. [Features](#4-features)
5. [UI Design — OneUI 8 Inspiration](#5-ui-design--oneui-8-inspiration)
6. [Dark / Light Mode — 6PM–6AM Rule](#6-dark--light-mode--6pm6am-rule)
7. [Loan Presets — Philippine Context](#7-loan-presets--philippine-context)
8. [Calculation Logic](#8-calculation-logic)
9. [Amortization Schedule](#9-amortization-schedule)
10. [Employer-Specific Logic](#10-employer-specific-logic)
11. [Data, State & Persistence](#11-data-state--persistence)
12. [File Structure](#12-file-structure)
13. [Setup & Development](#13-setup--development)
14. [Testing & Validation](#14-testing--validation)
15. [Accessibility & Responsiveness](#15-accessibility--responsiveness)
16. [Limitations & Disclaimers](#16-limitations--disclaimers)
17. [Roadmap](#17-roadmap)
18. [FAQ](#18-faq)

---

## 1. Overview

### What it is
A single-page loan calculator that lets an employer:

- Enter a loan amount, rate, term, and payment frequency
- Pick a Philippine loan preset (SSS, Pag-IBIG, Company, Bank)
- See the per-period payment, total interest, total repayment, and payoff date instantly
- View a full amortization schedule
- Compare two loan scenarios
- Export the schedule to CSV for HR / payroll

### What it is not
- Not an official SSS / Pag-IBIG / bank system
- Not a loan approval system
- Not a payroll system (yet — see Roadmap)
- Does not store data on a server

### Design goals
- **Fast:** Every input updates results instantly.
- **Clear:** Large numbers, plain language, no jargon.
- **Employer-friendly:** Salary, DTI, subsidy, and fees are first-class inputs.
- **Mobile-friendly:** Usable on a phone during a face-to-face employee inquiry.

---

## 2. Target Users & Use Cases

### Primary users
- HR officers
- Payroll officers
- Finance / Accounting staff
- Small business owners / employers
- Team leads handling employee cash advances

### Common use cases

| Use Case | How the app helps |
| --- | --- |
| Employee asks: “How much will I pay monthly for ₱50,000?” | Enter amount + preset, read monthly payment instantly |
| Compare SSS vs Company loan | Use Comparison Mode |
| Check if employee can afford it | Enter salary, check DTI warning |
| Prepare payroll deduction list | Export amortization CSV |
| Explain total cost | Show Principal vs Interest donut + total repayment |

---

## 3. Tech Stack & Architecture

| Layer | Technology |
| --- | --- |
| UI Framework | React |
| Language | TypeScript |
| Markup | HTML5 |
| Styling | CSS3 + Tailwind CSS |
| State | React state (`useState` / `useMemo`) |
| Charts | Lightweight SVG / Canvas charts (no heavy dependency required) |
| Persistence | `localStorage` (theme override only) |
| Export | CSV via Blob download |

### Architecture principles
- **Presentational + Logic separation:** Calculation lives in `lib/loanMath.ts`, not inside components.
- **Derived state:** Results are computed with `useMemo` from inputs — no manual syncing.
- **No backend:** All calculations run client-side. No data leaves the browser.
- **Type-safe:** All loan inputs, presets, and schedule rows are typed in TypeScript.

### Recommended dependencies
```json
{
  "dependencies": {
    "react": "^18.0.0",
    "react-dom": "^18.0.0"
  },
  "devDependencies": {
    "typescript": "^5.0.0",
    "tailwindcss": "^3.0.0",
    "vite": "^5.0.0"
  }
}
```
> Exact versions depend on your scaffolding. Vite + React + TS is recommended.

---

## 4. Features

### 4.1 Core Calculator Inputs

| Input | Type | Description |
| --- | --- | --- |
| Loan Amount | Number + Slider | Principal in PHP (₱). Min ₱1,000. |
| Annual Interest Rate | Number | % per annum. Preset fills this, user can override. |
| Loan Term | Number + Toggle | In months or years. |
| Payment Frequency | Select / Pills | Monthly, Semi-monthly, Bi-weekly, Weekly |
| Start Date | Date | First due date basis. |
| Loan Type | Preset Cards | SSS, Pag-IBIG MPL, Pag-IBIG Calamity, Company, Bank |

### 4.2 Employer Inputs

| Input | Type | Description |
| --- | --- | --- |
| Employee Name | Text (optional) | For labeling exports / printouts. |
| Monthly Salary | Number (optional) | Used for DTI check. |
| Employer Subsidy | Number | Amount employer shoulders per payment. Reduces employee's out-of-pocket. |
| Processing Fee | % | Added to total cost display. Does not change amortization unless configured to. |

### 4.3 Results Panel

| Output | Description |
| --- | --- |
| Per-Period Payment | Amount due each period (employee + employer split shown if subsidy exists). |
| Total Interest | Sum of all interest across schedule. |
| Total Repayment | Principal + Interest (+ fee if applicable). |
| Payoff Date | Date of last payment. |
| Effective Monthly Rate | Annual rate / 12. |
| DTI Status | `Payment / Monthly Salary`. Warns if > 30%. |

### 4.4 Visualizations
- **Donut Chart:** Principal vs Interest share of total repayment.
- **Balance Chart:** Remaining balance over time — should trend down to ₱0.

### 4.5 Comparison Mode
- Second scenario with its own amount / rate / term / frequency.
- Side-by-side table: Payment, Total Interest, Total Repayment, Payoff Date.
- “Cheaper by ₱X” callout.

### 4.6 Export
- **CSV:** Full amortization schedule. Columns: Period, Due Date, Payment, Principal, Interest, Employer Share, Employee Share, Remaining Balance.

---

## 5. UI Design — OneUI 8 Inspiration

Inspiration: Samsung OneUI 8.

### Principles
- **Large touch targets:** Inputs and toggles are easy to tap.
- **Rounded geometry:** Cards `24–32px` radius, pills for toggles.
- **Layered surfaces:** Background → Card → Inner card / chip.
- **Breathing room:** Generous padding, one primary action per section.
- **Friendly type:** Large headings, medium-weight labels, tabular numbers for money.

### Layout
```
┌──────────────────────────────────────────────┐
│ Header: LoanCalc PH • Theme badge • Override │
├──────────────────────┬───────────────────────┤
│  Calculator Inputs   │  Results Summary      │
│  - Amount / Slider   │  - Payment            │
│  - Rate / Term       │  - Total Interest     │
│  - Frequency        │  - Payoff Date        │
│  - Presets          │  - Donut Chart        │
│  - Employer fields  │                       │
├──────────────────────────────────────────────┤
│  Balance Chart                                 │
├──────────────────────────────────────────────┤
│  Amortization Table + Export CSV               │
├──────────────────────────────────────────────┤
│  Comparison Mode                               │
└──────────────────────────────────────────────┘
```

### Color tokens

| Token | Light Mode | Dark Mode |
| --- | --- | --- |
| Background | `#F5F6F8` | `#0B0F1A` |
| Card | `#FFFFFF` | `#151A28` / `#1A2133` |
| Text Primary | `#111827` | `#F8FAFC` |
| Text Secondary | `#6B7280` | `#9CA3AF` |
| Accent | `#2563EB` → `#7C3AED` gradient | `#60A5FA` → `#A78BFA` |
| Success | `#16A34A` | `#22C55E` |
| Warning | `#D97706` | `#F59E0B` |
| Danger | `#DC2626` | `#EF4444` |

---

## 6. Dark / Light Mode — 6PM–6AM Rule

### Rule
- **Dark Mode:** `18:00 – 05:59` (6:00 PM to 6:00 AM)
- **Light Mode:** `06:00 – 17:59` (6:00 AM to 6:00 PM)
- Based on **device local datetime** (`new Date().getHours()`).

### Behavior
1. On load, check current hour.
2. Apply theme: `dark` if `hour >= 18 || hour < 6`, else `light`.
3. Re-check every 60 seconds with `setInterval`.
4. Show badge: `Auto • Dark (6PM–6AM)` or `Auto • Light (6AM–6PM)` + current time.
5. Manual override options: `Auto / Light / Dark`.
6. Override persists in `localStorage` under key `loan-calc-theme` (`auto | light | dark`).
7. If override is `auto`, the time rule controls the theme. If `light` / `dark`, manual choice wins until user returns to `auto`.

### Pseudocode

```ts
function getAutoTheme(date = new Date()): 'dark' | 'light' {
  const hour = date.getHours(); // 0-23, local time
  return (hour >= 18 || hour < 6) ? 'dark' : 'light';
}

function resolveTheme(mode: 'auto' | 'light' | 'dark'): 'dark' | 'light' {
  return mode === 'auto' ? getAutoTheme() : mode;
}

// Re-check every minute
useEffect(() => {
  const id = setInterval(() => setNow(new Date()), 60_000);
  return () => clearInterval(id);
}, []);
```

### Implementation notes
- Use `class` strategy in Tailwind: toggle `dark` class on `<html>` / root element.
- Or use CSS variables: `--bg`, `--card`, `--text` switched by `[data-theme="dark"]`.
- Do **not** use `prefers-color-scheme` as the primary source — the spec requires fixed 6PM–6AM time, not OS preference. OS preference can be a fallback only if you choose to add it.
- Avoid flash-of-wrong-theme: apply theme as early as possible on load.

---

## 7. Loan Presets — Philippine Context

Presets are starting points. Users can edit rate / term after selecting one.

### 7.1 SSS Salary Loan
- **Default rate:** 10% p.a.
- **Typical max:** Up to 2 months salary (1-month / 2-month loan depending on contributions)
- **Notes:** Requires active SSS membership and qualifying contributions. Repayment is usually via employer payroll deduction.

### 7.2 Pag-IBIG Multi-Purpose Loan (MPL)
- **Default rate:** 10.5% p.a.
- **Typical max:** Up to 80% of total accumulated savings (TAV)
- **Notes:** Requires at least 24 monthly savings, active membership. Often repaid in 24 months.

### 7.3 Pag-IBIG Calamity Loan
- **Default rate:** 5.95% p.a.
- **Notes:** For members in calamity-declared areas. Lower rate than MPL. Check current Pag-IBIG circulars.

### 7.4 Company / In-house Loan
- **Default rate:** Custom (often 0% – 12%)
- **Notes:** Employer-defined. May be interest-free, salary-deducted, or with company subsidy. Use the Employer Subsidy field to model this.

### 7.5 Bank / Personal Loan
- **Default rate:** Custom
- **Notes:** Bank rates vary widely. Enter the bank's stated annual rate.

> ⚠️ Preset rates change over time. The app should show a footnote: “Rates are defaults for estimation. Confirm with SSS / Pag-IBIG / lender.”

---

## 8. Calculation Logic

### 8.1 Core formula

Standard amortizing loan:

```
PMT = P * r / (1 - (1 + r) ^ -n)
```

| Symbol | Meaning |
| --- | --- |
| `PMT` | Payment per period |
| `P` | Principal (loan amount) |
| `r` | Periodic interest rate |
| `n` | Total number of payments |

### 8.2 Periodic rate

```
monthlyRate = annualRate / 12 / 100
```

Then:

| Frequency | Payments per year | Periodic rate | Total payments |
| --- | --- | --- | --- |
| Monthly | 12 | `annual / 12` | `termMonths` |
| Semi-monthly | 24 | `annual / 24` | `termMonths * 2` |
| Bi-weekly | 26 | `annual / 26` | `termYears * 26` |
| Weekly | 52 | `annual / 52` | `termYears * 52` |

> Alternative implementation used in the UI: compute monthly PMT first, then convert:
> - Semi-monthly = `monthly / 2`
> - Bi-weekly = `monthly * 12 / 26`
> - Weekly = `monthly * 12 / 52`
>
> Both approaches are acceptable if documented and consistent. Prefer the periodic-rate method for the amortization table so interest accrues correctly per period.

### 8.3 Zero-interest edge case

If `annualRate === 0`:

```
PMT = P / n
Interest per period = 0
```

Avoid division by zero in the main formula.

### 8.4 Rounding

- Display: `₱` with 2 decimals, thousands separators.
- Internal: Keep full float precision during schedule generation. Round only for display, except final period — adjust final payment so remaining balance becomes exactly `₱0.00`.
- Final period adjustment is required to avoid a small residual like `₱0.03` due to rounding.

### 8.5 Employer subsidy

```
employeeShare = max(0, payment - employerSubsidyPerPeriod)
employerShare = min(payment, employerSubsidyPerPeriod)
```

Subsidy does **not** change total payment or amortization — it only splits who pays. If you want subsidy to shorten the loan, that is a separate feature (extra payment) and should be labeled as such.

### 8.6 Processing fee

```
feeAmount = principal * (feePercent / 100)
totalCostWithFee = totalRepayment + feeAmount
```

Show fee separately. Do not silently add it to principal unless the lender actually capitalizes it.

### 8.7 Worked example

**Input:**
- Principal: ₱50,000
- Annual Rate: 10%
- Term: 12 months
- Frequency: Monthly

**Math:**
- `r = 0.10 / 12 = 0.008333...`
- `n = 12`
- `PMT = 50000 * 0.008333 / (1 - (1.008333)^-12) = ₱4,395.79` (approx)

**Results:**
- Monthly Payment: ~₱4,395.79
- Total Repayment: ~₱52,749.48
- Total Interest: ~₱2,749.48
- Payoff: Start Date + 12 months

Verify with: `PMT * n - P = Total Interest`.

---

## 9. Amortization Schedule

### Generation algorithm

```ts
type ScheduleRow = {
  period: number;
  dueDate: Date;
  payment: number;
  principal: number;
  interest: number;
  employerShare: number;
  employeeShare: number;
  remainingBalance: number;
};

function buildSchedule(input): ScheduleRow[] {
  let balance = principal;
  const rows: ScheduleRow[] = [];

  for (let i = 1; i <= n; i++) {
    const interest = balance * periodicRate;
    let principalPart = payment - interest;

    // Final period: clear the balance
    if (i === n) {
      principalPart = balance;
      payment = principalPart + interest;
    }

    balance -= principalPart;

    rows.push({
      period: i,
      dueDate: addPeriod(startDate, i, frequency),
      payment,
      principal: principalPart,
      interest,
      employerShare: Math.min(employerSubsidy, payment),
      employeeShare: Math.max(0, payment - employerSubsidy),
      remainingBalance: Math.max(0, balance),
    });
  }
  return rows;
}
```

### Due dates

| Frequency | Due date rule |
| --- | --- |
| Monthly | Same day each month from start date |
| Semi-monthly | 15th and last day of month (or 15th & 30th) |
| Bi-weekly | Every 14 days from start date |
| Weekly | Every 7 days from start date |

Handle month-end overflow: e.g. Jan 31 → Feb 28 (clamp to last day of month).

---

## 10. Employer-Specific Logic

### 10.1 Debt-to-Income (DTI)

```
DTI = monthlyPayment / monthlySalary
```

| DTI | Status |
| --- | --- |
| ≤ 30% | ✅ Affordable |
| 31% – 40% | ⚠️ Tight — review |
| > 40% | 🛑 High risk — consider longer term / lower amount |

For non-monthly frequencies, convert payment to monthly equivalent first:
`monthlyEquivalent = payment * paymentsPerYear / 12`.

### 10.2 Payroll deduction view
The amortization table is the payroll deduction list. Each row's `Employee Share` is the amount to deduct from payroll that period.

### 10.3 What the app does NOT decide
- Approval / denial
- Eligibility (contribution months, employment tenure)
- Actual SSS / Pag-IBIG computation

Those remain with HR + the lending agency.

---

## 11. Data, State & Persistence

| Data | Stored? | Where |
| --- | --- | --- |
| Loan inputs | No (session only) | React state |
| Comparison scenario | No | React state |
| Theme override | Yes | `localStorage: loan-calc-theme` |
| Employee data | No | Never persisted, never sent to server |

### Privacy
- No backend, no analytics, no tracking in the base version.
- If you add analytics later, do not send employee names or salaries.

### Type definitions (example)

```ts
type Frequency = 'monthly' | 'semi-monthly' | 'bi-weekly' | 'weekly';

type LoanPresetId = 'sss' | 'pagibig-mpl' | 'pagibig-calamity' | 'company' | 'bank';

type LoanInput = {
  principal: number;
  annualRate: number;
  termMonths: number;
  frequency: Frequency;
  startDate: string; // ISO date
  presetId: LoanPresetId;
  employeeName?: string;
  monthlySalary?: number;
  employerSubsidyPerPeriod?: number;
  processingFeePercent?: number;
};

type LoanResult = {
  paymentPerPeriod: number;
  totalInterest: number;
  totalRepayment: number;
  payoffDate: string;
  schedule: ScheduleRow[];
};
```

---

## 12. File Structure

Recommended:

```text
.
├── README.md
├── Documentation.md
├── public/
│   └── favicon.ico
├── src/
│   ├── App.tsx                 # Layout + theme provider
│   ├── main.tsx                # Entry
│   ├── index.css               # Tailwind + CSS variables + OneUI tokens
│   ├── components/
│   │   ├── Header.tsx
│   │   ├── LoanForm.tsx        # Inputs + presets + sliders
│   │   ├── ResultsPanel.tsx    # Summary cards + donut
│   │   ├── BalanceChart.tsx
│   │   ├── AmortizationTable.tsx
│   │   └── ComparisonView.tsx
│   ├── lib/
│   │   ├── loanMath.ts         # PMT, schedule, DTI, payoff
│   │   ├── presets.ts          # SSS / Pag-IBIG / Company / Bank
│   │   ├── format.ts           # PHP formatting, dates
│   │   └── exportCsv.ts
│   └── hooks/
│       ├── useTheme.ts         # 6PM-6AM auto theme + override
│       └── useLoanCalc.ts      # Memoized calculation
├── package.json
└── tsconfig.json
```

---

## 13. Setup & Development

### Prerequisites
- Node.js 18+ (20+ recommended)
- npm / yarn / pnpm / bun

### Commands

```bash
# Install
npm install

# Dev
npm run dev

# Build
npm run build

# Preview
npm run preview

# Type check
npx tsc --noEmit

# Lint (if configured)
npm run lint
```

### Tailwind setup
- Tailwind v3: `tailwind.config.js` with `darkMode: 'class'`
- Tailwind v4: `@custom-variant dark (&:where(.dark, .dark *));` in CSS
- Use `dark:` variants for all themed surfaces.

---

## 14. Testing & Validation

### Manual test cases

| Case | Expected |
| --- | --- |
| ₱50,000, 10%, 12 mo, monthly | ~₱4,395.79 / mo, total interest ~₱2,749 |
| ₱100,000, 0%, 10 mo | ₱10,000 / mo, ₱0 interest |
| ₱10,000, 12%, 1 mo | ₱10,100 total |
| Semi-monthly ₱50,000, 10%, 12 mo | ~₱2,197.90 per pay period, 24 rows |
| Salary ₱20,000, payment ₱7,000 | DTI 35% → Warning |
| Final row | Remaining balance = ₱0.00 exactly |

### Unit tests to add (recommended)
- `calculatePayment()` — normal, zero-rate, 1-period
- `buildSchedule()` — sum(principal) = principal, final balance 0, row count = n
- `getAutoTheme()` — 05:59 dark, 06:00 light, 17:59 light, 18:00 dark
- `formatPHP()` — ₱1,234.56, ₱0.00
- `calculateDTI()` — thresholds

### Cross-check
Compare 2–3 cases against a spreadsheet `PMT()` function or an online amortizing loan calculator.

---

## 15. Accessibility & Responsiveness

- **Labels:** Every input has a visible `<label>` + `aria-label` where needed.
- **Contrast:** Text meets WCAG AA in both light and dark modes.
- **Keyboard:** Sliders, toggles, selects, and buttons are keyboard-operable.
- **Focus:** Visible focus ring.
- **Numbers:** Use `tabular-nums` for money so columns align.
- **Mobile:** Single-column layout < 768px, table scrolls horizontally.
- **Reduced motion:** Respect `prefers-reduced-motion` for chart animations.

---

## 16. Limitations & Disclaimers

- Estimates only. Not an official SSS, Pag-IBIG, or bank calculator.
- Preset rates are defaults and may be outdated — verify with official circulars.
- Does not handle: penalties, late fees, restructuring, balloon payments, variable rates, or early payoff with rebates — unless added later.
- Does not verify eligibility or approve loans.
- Semi-monthly / bi-weekly conversions assume equal periods; actual payroll calendars may vary (e.g. months with 3 paydays).

---

## 17. Roadmap

- [ ] SSS / Pag-IBIG contribution deduction checker
- [ ] Multiple employees / payroll batch mode
- [ ] Loan eligibility rules (minimum contribution months, tenure)
- [ ] PDF summary export
- [ ] Saved employee profiles (local only)
- [ ] Early payoff / extra payment simulator
- [ ] Late penalty calculator

---

## 18. FAQ

**Q: Does it save employee data?**
No. Everything runs in the browser. Only the theme override is saved in `localStorage`.

**Q: Why does dark mode turn on at 6PM?**
By design: fixed 6PM–6AM dark mode based on device time, not OS preference.

**Q: Can I change the 6PM–6AM window?**
Yes — edit `getAutoTheme()` in `hooks/useTheme.ts`. Change `18` and `6` to your preferred hours.

**Q: Can I add a new preset?**
Yes — add an entry in `lib/presets.ts` with `id`, `label`, `defaultRate`, `description`, and `maxTermMonths` if needed.

**Q: Is the CSV safe for payroll?**
It is a starting point. Always review against your payroll calendar (paydays, holidays, cutoffs) before deducting.

---

## Changelog

| Version | Date | Notes |
| --- | --- | --- |
| 1.0.0 | 2026-11-22 | Initial version — calculator, presets, amortization, comparison, CSV, auto theme |
