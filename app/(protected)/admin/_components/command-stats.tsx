import { prisma } from '@/lib/prisma';
import { Activity, Clock, UserCheck, Zap } from 'lucide-react';

interface StatItem {
  label: string;
  value: number;
  sublabel: string;
  icon: React.ElementType;
  accent: string;
  pulse?: boolean;
}

export async function CommandStats() {
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  // Batch all counts in a single transaction so they share one DB connection,
  // preventing MaxClientsInSessionMode pool exhaustion.
  const [pendingCount, signalsToday, urgentExpiring, degen24h] = await prisma.$transaction([
    prisma.subscription.count({ where: { status: 'PENDING' } }),
    prisma.signal.count({ where: { createdAt: { gte: startOfToday } } }),
    prisma.subscription.count({
      where: {
        status: 'ACTIVE',
        expiresAt: {
          gt: now,
          lte: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000),
        },
      },
    }),
    prisma.user.count({
      where: {
        createdAt: { gte: new Date(now.getTime() - 24 * 60 * 60 * 1000) },
        role: 'USER',
      },
    }),
  ]);

  const stats: StatItem[] = [
    {
      label: 'Pending Approvals',
      value: pendingCount,
      sublabel: 'awaiting action',
      icon: UserCheck,
      accent: pendingCount > 0 ? 'text-amber-400 bg-amber-500/10 border-amber-500/20' : 'text-muted-foreground bg-secondary/40 border-border/40',
      pulse: pendingCount > 0,
    },
    {
      label: 'Signals Today',
      value: signalsToday,
      sublabel: 'posted today',
      icon: Activity,
      accent: signalsToday > 0 ? 'text-primary bg-primary/10 border-primary/20' : 'text-muted-foreground bg-secondary/40 border-border/40',
      pulse: signalsToday > 0,
    },
    {
      label: 'Expiring in 7d',
      value: urgentExpiring,
      sublabel: 'at-risk degens',
      icon: Clock,
      accent: urgentExpiring > 0 ? 'text-rose-400 bg-rose-500/10 border-rose-500/20' : 'text-muted-foreground bg-secondary/40 border-border/40',
      pulse: urgentExpiring > 0,
    },
    {
      label: 'New Degens (24h)',
      value: degen24h,
      sublabel: 'registrations',
      icon: Zap,
      accent: degen24h > 0 ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' : 'text-muted-foreground bg-secondary/40 border-border/40',
      pulse: degen24h > 0,
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {stats.map(stat => {
        const Icon = stat.icon;
        return (
          <div
            key={stat.label}
            className={`flex items-center gap-3 rounded-2xl border px-5 py-4 backdrop-blur-md transition-all ${stat.accent}`}
          >
            <div className="relative flex-shrink-0">
              <Icon className="h-4 w-4" />
              {stat.pulse && (
                <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-current animate-ping opacity-75" />
              )}
            </div>
            <div className="min-w-0">
              <p className="text-xl font-bold tracking-tight leading-none">{stat.value}</p>
              <p className="text-[9px] uppercase tracking-widest opacity-60 font-semibold mt-1 truncate">{stat.label}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
