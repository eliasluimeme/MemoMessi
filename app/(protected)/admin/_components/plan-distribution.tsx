import { prisma } from '@/lib/prisma';
import { LayoutGrid } from 'lucide-react';

const PLAN_LABELS: Record<string, string> = {
  ONE_MONTH: '1 Month',
  THREE_MONTHS: '3 Months',
  SIX_MONTHS: '6 Months',
  ONE_YEAR: '1 Year',
};

const PLAN_COLORS: Record<string, string> = {
  ONE_MONTH: 'bg-sky-500',
  THREE_MONTHS: 'bg-violet-500',
  SIX_MONTHS: 'bg-amber-500',
  ONE_YEAR: 'bg-emerald-500',
};

const PLAN_TEXT_COLORS: Record<string, string> = {
  ONE_MONTH: 'text-sky-500',
  THREE_MONTHS: 'text-violet-500',
  SIX_MONTHS: 'text-amber-500',
  ONE_YEAR: 'text-emerald-500',
};

interface PlanRow {
  plan: string;
  count: number;
}

export async function PlanDistribution() {
  const rows = await prisma.$queryRaw<PlanRow[]>`
    SELECT 
      s.plan::text as plan,
      CAST(COUNT(*) AS INTEGER) as count
    FROM "subscriptions" s
    JOIN "profiles" u ON u.id = s.user_id
    WHERE s.status = 'ACTIVE' AND u.role = 'USER'
    GROUP BY s.plan
    ORDER BY count DESC
  `;

  const total = rows.reduce((s, r) => s + Number(r.count), 0);

  // Ensure all plans are represented
  const allPlans = ['ONE_MONTH', 'THREE_MONTHS', 'SIX_MONTHS', 'ONE_YEAR'];
  const planMap = new Map(rows.map(r => [r.plan, Number(r.count)]));

  return (
    <div className="flex flex-col h-full rounded-[24px] border border-border/40 bg-card/40 backdrop-blur-xl p-8 gap-8 group transition-all hover:bg-card/60">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">
            Plan Distribution
          </span>
          <p className="text-3xl font-light tracking-tight text-foreground">{total}</p>
          <p className="text-xs text-muted-foreground/60">active subscribers</p>
        </div>
        <div className="w-10 h-10 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
          <LayoutGrid className="h-4 w-4 text-primary" />
        </div>
      </div>

      {/* Stacked bar */}
      {total > 0 && (
        <div className="flex h-2 rounded-full overflow-hidden gap-0.5">
          {allPlans.map(plan => {
            const count = planMap.get(plan) ?? 0;
            const pct = total > 0 ? (count / total) * 100 : 0;
            if (pct === 0) return null;
            return (
              <div
                key={plan}
                className={`${PLAN_COLORS[plan]} h-full rounded-full transition-all duration-700`}
                style={{ width: `${pct}%` }}
              />
            );
          })}
        </div>
      )}

      {/* Legend */}
      <div className="space-y-3 flex-1">
        {allPlans.map(plan => {
          const count = planMap.get(plan) ?? 0;
          const pct = total > 0 ? (count / total) * 100 : 0;
          return (
            <div key={plan} className="flex items-center justify-between group/row">
              <div className="flex items-center gap-2.5">
                <div className={`w-2 h-2 rounded-full ${PLAN_COLORS[plan]}`} />
                <span className="text-xs text-muted-foreground/80 font-medium">
                  {PLAN_LABELS[plan]}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className={`text-[10px] font-semibold uppercase tracking-wider ${PLAN_TEXT_COLORS[plan]}`}>
                  {pct.toFixed(0)}%
                </span>
                <span className="text-xs font-bold text-foreground w-6 text-right">{count}</span>
              </div>
            </div>
          );
        })}
      </div>

      {total === 0 && (
        <div className="flex-1 flex items-center justify-center text-xs text-muted-foreground/40 uppercase tracking-widest">
          No active subscriptions
        </div>
      )}
    </div>
  );
}
