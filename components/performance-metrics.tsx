import { BarChart } from 'lucide-react';

import { prisma } from '@/lib/prisma';

export async function PerformanceMetrics() {
  const thisMonth = new Date();
  thisMonth.setDate(1);
  thisMonth.setHours(0, 0, 0, 0);

  const [totalSignals, closedSignals, closedThisMonth] = await Promise.all([
    prisma.signal.count(),
    prisma.signal.count({
      where: { isClosed: true },
    }),
    prisma.signal.count({
      where: {
        isClosed: true,
        closedAt: {
          gte: thisMonth,
        },
      },
    }),
  ]);

  const completionRate = (closedSignals / totalSignals) * 100;

  return (
    <div className="glass-card group h-full relative overflow-hidden p-8 transition-all duration-700 dark:hover:border-white/[0.08] hover:border-border dark:hover:bg-white/[0.02] hover:bg-card/80">
      <div className="flex flex-col justify-between h-full space-y-12">
        <div className="flex items-center justify-between">
          <span className="text-premium-label group-hover:text-blue-500 transition-colors">Success Velocity</span>
          <BarChart className="h-4 w-4 text-muted-foreground/20 group-hover:text-blue-500 transition-colors duration-500" />
        </div>
        <div>
          <div className="text-6xl font-black tracking-tighter text-foreground/90 group-hover:text-foreground transition-all duration-700 mb-2">
            {completionRate ? completionRate.toFixed(1) : '0'}%
          </div>
          <div className="flex items-center justify-between font-black text-[10px] text-muted-foreground/60 uppercase tracking-[0.2em]">
            <span>{closedSignals} Protocols</span>
            <span className="text-blue-500/60">{totalSignals} Integrated</span>
          </div>
        </div>
      </div>
    </div>
  );
}
