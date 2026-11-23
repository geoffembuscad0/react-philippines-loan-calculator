import type { ReactNode } from 'react';
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import { CHART_COLORS } from '../../constants';
import { peso } from '../../lib/format';
import { Card } from '../ui/Card';
import { formatTooltipPeso, TOOLTIP_STYLE } from './chartTheme';

interface SpendingDonutProps {
  principal: number;
  interest: number;
}

/** Donut chart: how much of everything repaid is principal vs. interest. */
export function SpendingDonut({ principal, interest }: SpendingDonutProps) {
  const data = [
    { name: 'Principal', value: principal },
    { name: 'Interest', value: interest },
  ];

  return (
    <Card as="div" className="p-5">
      <h3 className="font-extrabold mb-1">Where the money goes</h3>
      <p className="text-[13px] font-medium" style={{ color: 'var(--muted)' }}>Principal vs. interest over the life of the loan</p>

      <div className="h-[210px] mt-2">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} dataKey="value" nameKey="name" innerRadius={62} outerRadius={88} paddingAngle={3} strokeWidth={0}>
              <Cell fill={CHART_COLORS.principal} />
              <Cell fill={CHART_COLORS.interest} />
            </Pie>
            <Tooltip formatter={formatTooltipPeso} contentStyle={TOOLTIP_STYLE} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Legend (wraps onto two lines on narrow screens) */}
      <div className="flex flex-wrap justify-center gap-x-5 gap-y-2 text-[13px] font-bold">
        <LegendItem color={CHART_COLORS.principal}>Principal {peso(principal)}</LegendItem>
        <LegendItem color={CHART_COLORS.interest}>Interest {peso(interest)}</LegendItem>
      </div>
    </Card>
  );
}

function LegendItem({ color, children }: { color: string; children: ReactNode }) {
  return (
    <span className="flex items-center gap-2">
      <i className="w-3 h-3 rounded-full inline-block" style={{ background: color }} />
      {children}
    </span>
  );
}
