import { prisma } from '@/lib/prisma';
import { TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
import { RevenueBarChart, MonthlyRevenueData } from './revenue-chart-client';

const PRICES: Record<string, number> = {
  ONE_MONTH: Number(process.env.NEXT_PUBLIC_ONE_MONTH ?? 0),
  THREE_MONTHS: Number(process.env.NEXT_PUBLIC_THREE_MONTHS ?? 0),
  SIX_MONTHS: Number(process.env.NEXT_PUBLIC_SIX_MONTHS ?? 0),
  ONE_YEAR: Number(process.env.NEXT_PUBLIC_ONE_YEAR ?? 0),
};

interface MonthlyRow {
  month_label: string;
  month_date: Date;
  one_month_count: number;
  three_months_count: number;
  six_months_count: number;
  one_year_count: number;
}

export async function MonthlyRevenue() {
  const rows = await prisma.$queryRaw<MonthlyRow[]>`
    SELECT
      TO_CHAR(DATE_TRUNC('month', s.created_at), 'Mon ''YY') as month_label,
      DATE_TRUNC('month', s.created_at)                       as month_date,
      COALESCE(CAST(COUNT(*) FILTER (WHERE s.plan = 'ONE_MONTH')     AS INTEGER), 0) as one_month_count,
      COALESCE(CAST(COUNT(*) FILTER (WHERE s.plan = 'THREE_MONTHS')  AS INTEGER), 0) as three_months_count,
      COALESCE(CAST(COUNT(*) FILTER (WHERE s.plan = 'SIX_MONTHS')    AS INTEGER), 0) as six_months_count,
      COALESCE(CAST(COUNT(*) FILTER (WHERE s.plan = 'ONE_YEAR')      AS INTEGER), 0) as one_year_count
    FROM "subscriptions" s
    JOIN "profiles" u ON u.id = s.user_id
    WHERE s.created_at >= NOW() - INTERVAL '6 months'
      AND u.role = 'USER'
    GROUP BY month_label, month_date
    ORDER BY month_date ASC
  `;

  const chartData: MonthlyRevenueData[] = rows.map(r => ({
    month: r.month_label,
    revenue:
      Number(r.one_month_count) * PRICES.ONE_MONTH +
      Number(r.three_months_count) * PRICES.THREE_MONTHS +
      Number(r.six_months_count) * PRICES.SIX_MONTHS +
      Number(r.one_year_count) * PRICES.ONE_YEAR,
  }));

  const totalRevenue = chartData.reduce((s, d) => s + d.revenue, 0);
  const lastMonth = chartData[chartData.length - 2]?.revenue ?? 0;
  const thisMonth = chartData[chartData.length - 1]?.revenue ?? 0;
  const trend = lastMonth > 0 ? ((thisMonth - lastMonth) / lastMonth) * 100 : 0;
  const isPositive = trend >= 0;

  return (
    <div className="flex flex-col h-full rounded-[24px] border border-border/40 bg-card/40 backdrop-blur-xl p-8 gap-8 group transition-all hover:bg-card/60">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">
            Revenue Intelligence
          </span>
          <p className="text-3xl font-light tracking-tight text-foreground">
            {totalRevenue.toLocaleString('en-US', { style: 'currency', currency: 'MAD', maximumFractionDigits: 0 })}
          </p>
          <p className="text-xs text-muted-foreground/60">6-month cumulative</p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <div className="w-10 h-10 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
            <DollarSign className="h-4 w-4 text-primary" />
          </div>
          <div className={`flex items-center gap-1 text-xs font-semibold ${isPositive ? 'text-emerald-500' : 'text-rose-500'}`}>
            {isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
            {Math.abs(trend).toFixed(1)}% MoM
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="flex-1 min-h-0">
        {chartData.length > 0 ? (
          <RevenueBarChart data={chartData} />
        ) : (
          <div className="h-full flex items-center justify-center text-xs text-muted-foreground/40 uppercase tracking-widest">
            No data available
          </div>
        )}
      </div>

      {/* This month highlight */}
      <div className="pt-4 border-t border-border/40 flex items-center justify-between">
        <span className="text-[10px] uppercase tracking-widest text-muted-foreground/60 font-semibold">
          This Month
        </span>
        <span className="font-bold text-sm text-foreground">
          {thisMonth.toLocaleString('en-US', { style: 'currency', currency: 'MAD', maximumFractionDigits: 0 })}
        </span>
      </div>
    </div>
  );
}
