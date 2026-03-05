'use client';

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export interface MonthlyRevenueData {
  month: string;
  revenue: number;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ value: number }>;
  label?: string;
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-xl border border-border/60 bg-card/90 backdrop-blur-md px-4 py-3 text-xs shadow-xl">
        <p className="text-[10px] uppercase tracking-widest text-muted-foreground/60 mb-1">{label}</p>
        <p className="font-bold text-foreground text-sm">
          {Number(payload[0].value).toLocaleString('en-US', { style: 'currency', currency: 'MAD', maximumFractionDigits: 0 })}
        </p>
      </div>
    );
  }
  return null;
}

export function RevenueBarChart({ data, currency = 'MAD' }: { data: MonthlyRevenueData[]; currency?: string }) {
  const maxVal = Math.max(...data.map(d => d.revenue), 1);

  return (
    <ResponsiveContainer width="100%" height={180}>
      <BarChart data={data} barSize={32} margin={{ top: 4, right: 0, left: -24, bottom: 0 }}>
        <XAxis
          dataKey="month"
          tick={{ fontSize: 9, fill: 'hsl(var(--muted-foreground))', fontWeight: 700, letterSpacing: '0.12em' }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis hide domain={[0, maxVal * 1.15]} />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'hsl(var(--muted))', opacity: 0.25, radius: 6 }} />
        <Bar dataKey="revenue" radius={[8, 8, 3, 3]}>
          {data.map((_, i) => (
            <Cell
              key={i}
              fill={
                i === data.length - 1
                  ? 'hsl(var(--primary))'
                  : `hsl(var(--primary) / ${0.18 + (i / data.length) * 0.45})`
              }
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
