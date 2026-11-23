import { TrendingDown } from 'lucide-react';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { CHART_COLORS } from '../../constants';
import { peso } from '../../lib/format';
import type { ScheduleRow } from '../../types';
import { Card } from '../ui/Card';
import { formatAxisThousands, formatTooltipPeso, TOOLTIP_STYLE } from './chartTheme';

interface BalanceChartProps {
  schedule: ScheduleRow[];
  payoffDate: string;
}

/** Area chart of the remaining loan balance after each payment. */
export function BalanceChart({ schedule, payoffDate }: BalanceChartProps) {
  // A 60-payment loan would crowd the chart, so keep roughly 12 evenly spaced points
  // (and always the final one).
  const step = Math.max(1, Math.floor(schedule.length / 12));
  const chartData = schedule
    .filter((_, index) => index % step === 0 || index === schedule.length - 1)
    .map((row) => ({ name: `#${row.period}`, balance: Math.round(row.balance) }));

  return (
    <Card className="min-w-0 p-5 sm:p-6">
      <h3 className="font-extrabold flex items-center gap-2">
        <TrendingDown className="w-5 h-5" style={{ color: 'var(--accent)' }} /> Balance over time
      </h3>
      <p className="text-[13px] font-medium mt-1" style={{ color: 'var(--muted)' }}>Remaining balance falls to zero by {payoffDate}.</p>

      <div className="h-[280px] mt-3">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            {/* Gradient fill under the line */}
            <defs>
              <linearGradient id="balanceFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={CHART_COLORS.balance} stopOpacity={0.35} />
                <stop offset="100%" stopColor={CHART_COLORS.principal} stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis dataKey="name" tick={{ fontSize: 11, fill: 'var(--muted)' }} minTickGap={14} />
            <YAxis tick={{ fontSize: 11, fill: 'var(--muted)' }} tickFormatter={formatAxisThousands} width={48} />
            <Tooltip formatter={formatTooltipPeso} contentStyle={TOOLTIP_STYLE} />
            <Area type="monotone" dataKey="balance" stroke={CHART_COLORS.balance} strokeWidth={3} fill="url(#balanceFill)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-2 gap-3 mt-4">
        <MiniStat label="First payment interest" value={peso(schedule[0]?.interest || 0)} />
        <MiniStat label="Last payment" value={peso(schedule[schedule.length - 1]?.payment || 0)} />
      </div>
    </Card>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[16px] p-3" style={{ background: 'var(--surface-2)' }}>
      <p className="text-[12px] font-bold" style={{ color: 'var(--muted)' }}>{label}</p>
      <p className="font-extrabold">{value}</p>
    </div>
  );
}
