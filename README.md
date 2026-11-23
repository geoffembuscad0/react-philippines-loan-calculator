# PH Employer Loan Calculator

A loan calculator application for **Philippine employers**, built with **React, HTML5, CSS3, TypeScript & Tailwind CSS**.

It helps employers estimate employee loan repayments, compare loan types, and generate a full amortization schedule — with a clean, OneUI 8-inspired interface and automatic dark / light mode.

> Built for estimation and HR / payroll planning. Always verify final figures with SSS, Pag-IBIG, or your company's official loan policy.

---

## ✨ Features

### Loan Calculator
- Loan Amount in PHP (₱) with slider + manual input
- Annual Interest Rate (%) with presets
- Loan Term in months / years
- Payment Frequency:
  - Monthly
  - Semi-monthly (15th & 30th)
  - Bi-weekly
  - Weekly
- Start Date + automatic due dates

### Philippine Loan Presets
| Preset | Default Rate | Notes |
| --- | --- | --- |
| SSS Salary Loan | 10% p.a. | Up to 2 months salary |
| Pag-IBIG Multi-Purpose Loan | 10.5% p.a. | Up to 80% of savings |
| Pag-IBIG Calamity Loan | 5.95% p.a. | Calamity-affected members |
| Company / In-house Loan | Custom | Employer-defined terms |
| Bank / Personal Loan | Custom | Bank-defined terms |

> Preset rates are defaults for estimation only. They can change — confirm with the official agency.

### Employer Tools
- Employee Name (optional)
- Monthly Salary input
- Debt-to-Income (DTI) check — warns if payment > 30% of salary
- Employer subsidy / contribution per payment
- Processing Fee (%)

### Results
- Per-period Payment
- Total Interest
- Total Repayment
- Payoff Date
- Effective Monthly Rate
- Principal vs Interest donut chart
- Balance-over-time chart

### Amortization Schedule
- Period #, Due Date, Payment, Principal, Interest, Employer Share, Remaining Balance
- Export to CSV

### Comparison Mode
- Add a second scenario to compare e.g. SSS vs Company Loan side-by-side.

---

## 🎨 UI / UX

- **Design inspiration:** Samsung OneUI 8
  - Large rounded corners (24–32px)
  - Soft layered cards
  - Generous spacing
  - Pill-shaped toggles
  - Large, friendly typography
  - Subtle shadows

- **Automatic Dark / Light Mode**
  - **Dark Mode:** 6:00 PM – 6:00 AM
  - **Light Mode:** 6:00 AM – 6:00 PM
  - Based on device datetime, re-checked every minute
  - Manual override: `Auto / Light / Dark`
  - Override is saved in `localStorage`

- **Responsive:** Mobile-first, works on phone, tablet, and desktop.

---

## 🛠️ Tech Stack

- **React**
- **TypeScript**
- **HTML5**
- **CSS3**
- **Tailwind CSS**

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ (recommended: 20+)
- npm / yarn / pnpm / bun

### Install

```bash
npm install
```

### Run in development

```bash
npm run dev
```

### Build for production

```bash
npm run build
```

### Preview production build

```bash
npm run preview
```

> Commands may vary slightly depending on your scaffolding (Vite / Next.js / CRA). Adjust to your setup.

---

## 📁 Project Structure

```text
src/
├── main.tsx                  Entry point: mounts <App /> into index.html
├── App.tsx                   Holds the form state, runs the calculation, lays out the page
├── index.css                 Tailwind import, light/dark color variables, shared classes (.field, .label, .chip)
├── types.ts                  Shared TypeScript types (LoanInputs, LoanResult, ScheduleRow, ...)
├── constants.ts              Loan presets, labels, business rules (30% limit, SSS cap), brand colors
│
├── lib/                      Plain TypeScript — no React, easy to read and test
│   ├── loan.ts               ★ The loan math: payment formula + amortization schedule
│   ├── dates.ts              Builds the list of due dates for each payment frequency
│   ├── format.ts             peso(), formatDate(), ...
│   └── exportCsv.ts          Builds and downloads the CSV file
│
├── hooks/
│   └── useTheme.ts           Auto / Light / Dark theme (auto = dark from 6 PM to 6 AM)
│
└── components/
    ├── Header.tsx            Logo, clock badge, theme switch
    ├── Hero.tsx              Headline + two quick-glance numbers
    ├── LoanForm.tsx          Left card: all the inputs
    ├── PaymentSummary.tsx    Blue card: payment, total interest, total repayment, payoff
    ├── AffordabilityCard.tsx Debt-to-income (DTI) check
    ├── AmortizationSchedule.tsx  Schedule: table on tablets/desktops, cards on phones
    ├── CompareScenarios.tsx  Scenario A vs. Scenario B
    ├── Footer.tsx            Disclaimer + formula
    ├── charts/               SpendingDonut, BalanceChart, shared chart styling
    └── ui/                   Small reusable pieces: Card, Pill, Slider, Segmented, NumberField
```

### How data flows

```text
 User types in LoanForm
        │  onChange('salary', 35000)
        ▼
 App.tsx  ── inputs (state) ──►  calcLoan()  ──►  loan (result)
                                                    │
        ┌───────────────┬───────────────┬──────────┴────────┐
        ▼               ▼               ▼                   ▼
  PaymentSummary  AffordabilityCard  AmortizationSchedule  charts ...
```

Components only **receive props and draw them**. All the calculation happens in
`lib/loan.ts`, so if a number looks wrong, start there.

### Where do I change…?

| I want to… | Edit |
| --- | --- |
| Change a preset's rate or term | `constants.ts` → `PRESETS` |
| Change the 30% affordability guide | `constants.ts` → `AFFORDABILITY_LIMIT_PCT` |
| Change how a payment is calculated | `lib/loan.ts` |
| Change colors or dark mode | `index.css` (CSS variables) |
| Change how the schedule looks on phones | `components/AmortizationSchedule.tsx` → `ScheduleCards` |
| Add a new input field | `types.ts` (`LoanInputs`), `constants.ts` (`DEFAULT_INPUTS`), then `components/LoanForm.tsx` |

### Responsive breakpoints (Tailwind)

| Prefix | Starts at | Used for |
| --- | --- | --- |
| *(none)* | 0 px | Phones (portrait) |
| `sm:` | 640 px | Large phones — 2-column form fields |
| `md:` | 768 px | Tablets (portrait) — schedule switches from cards to a table |
| `lg:` | 1024 px | Desktops — form and results sit side by side |

---

## 🧮 Calculation Formula

Standard amortizing loan formula:

```
PMT = P * r / (1 - (1 + r) ^ -n)
```

Where:
- `P` = Loan principal
- `r` = Periodic interest rate
- `n` = Total number of payments

Frequency conversion (from monthly payment):
- Semi-monthly: `monthly / 2`
- Bi-weekly: `monthly * 12 / 26`
- Weekly: `monthly * 12 / 52`

If interest is `0%`, payment is simply `P / n`.

See `Documentation.md` for full calculation details, edge cases, and examples.

---

## 📦 Export

- **CSV Export:** Downloads the full amortization schedule for payroll / HR records.

---

## 🐞 Known Issues

These exist in the app today and are documented here so nobody is surprised:

1. **Semi-monthly dates skip February.** The 30th is computed with `setDate(30)`, and JavaScript
   rolls Feb 30 over into March. A schedule starting Jan 15 goes `Jan 30 → Mar 15`, skipping both
   February pay dates. Fix idea: for each month use `Math.min(30, lastDayOfMonth)`. See `lib/dates.ts`.
2. **The header does not stay pinned when scrolling.** It has the class `sticky` but no `top-*`
   class, so it has no effect. To pin it, change the classes in `components/Header.tsx` to
   `sticky top-0 z-30`.

---

## ⚠️ Disclaimer

This app provides estimates only. It is not an official SSS, Pag-IBIG, or bank calculator. Loan approval, final interest, fees, and eligibility depend on the lending institution and the employee's actual records.

---

## 🗺️ Roadmap

- [ ] SSS / Pag-IBIG contribution deduction checker
- [ ] Multiple employees / payroll batch mode
- [ ] Loan eligibility rules (minimum contribution months)
- [ ] PDF summary export
- [ ] Saved employee profiles

---

## 📄 License

MIT — free to use and modify. Add your preferred license file if different.

---

## 👤 Author

Built for Philippine employers / HR & payroll use.
