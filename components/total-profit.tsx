import { TrendingUp } from 'lucide-react';

import { prisma } from '@/lib/prisma';

export async function TotalProfit() {
  const profitSignals = await prisma.signal.findMany({
    select: {
      createdAt: true,
      targets: {
        select: {
          gain: true,
        },
      },
    },
  });

  const lastMonthDate = new Date(new Date().setMonth(new Date().getMonth() - 1));
  const lastMonthSignals = profitSignals.filter((signal) => signal.createdAt > lastMonthDate);

  const totalProfit = profitSignals.reduce(
    (sum, signal) => sum + signal.targets.reduce((targetSum, target) => targetSum + target.gain, 0),
    0,
  );

  const lastMonthProfit = lastMonthSignals.reduce(
    (sum, signal) => sum + signal.targets.reduce((targetSum, target) => targetSum + target.gain, 0),
    0,
  );

  return (
    <div className="glass-card group h-full relative overflow-hidden p-8 transition-all duration-700 dark:hover:border-white/[0.08] hover:border-border dark:hover:bg-white/[0.02] hover:bg-card/80">
      <div className="flex flex-col justify-between h-full space-y-12">
        <div className="flex items-center justify-between">
          <span className="text-premium-label group-hover:text-emerald-500 transition-colors">Yield Aggregate</span>
          <TrendingUp className="h-4 w-4 text-muted-foreground/20 group-hover:text-emerald-500 transition-colors duration-500" />
        </div>
        <div>
          <div className="text-6xl font-black tracking-tighter text-foreground/90 group-hover:text-foreground transition-all duration-700 mb-2">
            +{totalProfit.toFixed(1)}%
          </div>
          <div className="flex items-center justify-between font-black text-[10px] text-muted-foreground/60 uppercase tracking-[0.2em]">
            <span>Past 30d Velocity</span>
            <span className="text-emerald-500/60">+{lastMonthProfit.toFixed(1)}%</span>
          </div>
        </div>
      </div>
    </div>
  );
}
