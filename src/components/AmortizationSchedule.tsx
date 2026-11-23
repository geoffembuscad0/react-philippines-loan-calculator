import { CalendarDays, Download, Search } from 'lucide-react';
import { useState } from 'react';
import { BRAND_GRADIENT, SCHEDULE_PREVIEW_ROWS } from '../constants';
import { downloadScheduleCsv } from '../lib/exportCsv';
import { peso } from '../lib/format';
import type { ScheduleRow } from '../types';
import { Card } from './ui/Card';
import { Pill } from './ui/Pill';

interface AmortizationScheduleProps {
  schedule: ScheduleRow[];
  /** Only used to name the exported CSV file. */
  employeeName: string;
}

/**
 * Payment-by-payment breakdown.
 * Phones get a list of cards; tablets and desktops get a table (see the two
 * components at the bottom of this file).
 */
export function AmortizationSchedule({ schedule, employeeName }: AmortizationScheduleProps) {
  const [query, setQuery] = useState('');
  const [showAll, setShowAll] = useState(false);
  const [exportMessage, setExportMessage] = useState('');

  // Search matches either the payment number or the due-date text.
  const matchingRows = schedule.filter(
    (row) => String(row.period).includes(query) || row.due.toLowerCase().includes(query.toLowerCase()),
  );
  const visibleRows = showAll ? matchingRows : matchingRows.slice(0, SCHEDULE_PREVIEW_ROWS);

  const handleExport = () => {
    downloadScheduleCsv(schedule, employeeName);
    setExportMessage(`Exported ${schedule.length} periods as CSV.`);
  };

  return (
    <Card className="min-w-0 p-5 sm:p-6">
      {/* Title, count, search, and export button */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <h2 className="text-[19px] font-extrabold flex items-center gap-2">
          <CalendarDays className="w-5 h-5" style={{ color: 'var(--accent)' }} /> Amortization schedule
        </h2>
        <Pill background="var(--surface-2)">{schedule.length} payments</Pill>

        <div className="sm:ml-auto flex gap-2 flex-wrap w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-none min-w-[160px]">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: 'var(--muted)' }} />
            {/* 16px text on phones stops iPhones from zooming in when the field is tapped. */}
            <input
              className="field !py-2.5 !pl-9 !rounded-full !text-[16px] sm:!text-[13px] sm:w-[190px]"
              placeholder="Search period or date"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <button
            onClick={handleExport}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-[13px] font-extrabold text-white"
            style={{ background: BRAND_GRADIENT }}
          >
            <Download className="w-4 h-4" /> Export CSV
          </button>
        </div>
      </div>

      {exportMessage && <p className="text-[13px] font-bold mb-3" style={{ color: 'var(--success)' }}>{exportMessage}</p>}

      <ScheduleTable rows={visibleRows} />
      <ScheduleCards rows={visibleRows} />

      {matchingRows.length === 0 && (
        <p className="py-8 text-center font-semibold" style={{ color: 'var(--muted)' }}>No periods match “{query}”.</p>
      )}

      {matchingRows.length > SCHEDULE_PREVIEW_ROWS && (
        <button onClick={() => setShowAll(!showAll)} className="mt-4 w-full py-3 rounded-full font-bold text-[13px]" style={{ background: 'var(--surface-2)' }}>
          {showAll ? 'Show fewer periods' : `Show all ${matchingRows.length} periods`}
        </button>
      )}
    </Card>
  );
}

/** Table layout. Hidden below 768px ("hidden md:block") because it is too wide for phones. */
function ScheduleTable({ rows }: { rows: ScheduleRow[] }) {
  return (
    <div className="hidden md:block overflow-x-auto">
      <table className="w-full min-w-[620px] lg:min-w-[700px] text-[12px] lg:text-[13px] whitespace-nowrap">
        <thead>
          <tr className="text-left" style={{ color: 'var(--muted)' }}>
            <th className="py-2.5 pr-2 font-extrabold">#</th>
            <th className="py-2.5 pr-2 font-extrabold">Due date</th>
            <th className="py-2.5 pr-2 font-extrabold text-right">Payment</th>
            <th className="py-2.5 pr-2 font-extrabold text-right">Principal</th>
            <th className="py-2.5 pr-2 font-extrabold text-right">Interest</th>
            <th className="py-2.5 pr-2 font-extrabold text-right">Employer</th>
            <th className="py-2.5 pr-2 font-extrabold text-right">Employee</th>
            <th className="py-2.5 font-extrabold text-right">Balance</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.period} className="border-t" style={{ borderColor: 'var(--border)' }}>
              <td className="py-2.5 pr-2 font-bold">{row.period}</td>
              <td className="py-2.5 pr-2 font-semibold">{row.due}</td>
              <td className="py-2.5 pr-2 text-right font-bold">{peso(row.payment)}</td>
              <td className="py-2.5 pr-2 text-right">{peso(row.principal)}</td>
              <td className="py-2.5 pr-2 text-right">{peso(row.interest)}</td>
              <td className="py-2.5 pr-2 text-right" style={{ color: 'var(--success)' }}>{peso(row.employer)}</td>
              <td className="py-2.5 pr-2 text-right">{peso(row.employee)}</td>
              <td className="py-2.5 text-right font-bold">{peso(row.balance)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/** Card layout for phones. Hidden from 768px up ("md:hidden"). */
function ScheduleCards({ rows }: { rows: ScheduleRow[] }) {
  return (
    <ul className="md:hidden space-y-3">
      {rows.map((row) => (
        <li key={row.period} className="rounded-[20px] p-4" style={{ background: 'var(--surface-2)' }}>
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-[12px] font-extrabold uppercase tracking-wider" style={{ color: 'var(--muted)' }}>Payment #{row.period}</p>
              <p className="text-[14px] font-bold mt-0.5">{row.due}</p>
            </div>
            <p className="text-[18px] font-extrabold text-right">{peso(row.payment)}</p>
          </div>

          <dl className="grid grid-cols-2 gap-x-4 gap-y-2 mt-3 pt-3 text-[13px] border-t" style={{ borderColor: 'var(--border)' }}>
            <CardDetail label="Principal" value={peso(row.principal)} />
            <CardDetail label="Interest" value={peso(row.interest)} />
            <CardDetail label="Employer" value={peso(row.employer)} color="var(--success)" />
            <CardDetail label="Employee" value={peso(row.employee)} />
            <CardDetail label="Remaining balance" value={peso(row.balance)} className="col-span-2" large />
          </dl>
        </li>
      ))}
    </ul>
  );
}

interface CardDetailProps {
  label: string;
  value: string;
  color?: string;
  className?: string;
  large?: boolean;
}

function CardDetail({ label, value, color, className, large }: CardDetailProps) {
  return (
    <div className={className}>
      <dt style={{ color: 'var(--muted)' }}>{label}</dt>
      <dd className={large ? 'font-extrabold text-[15px]' : 'font-bold'} style={{ color }}>{value}</dd>
    </div>
  );
}
