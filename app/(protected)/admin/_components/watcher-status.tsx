import { prisma } from '@/lib/prisma';
import { Crosshair, Target, TrendingUp, ExternalLink } from 'lucide-react';

export async function WatcherStatus() {
  const now = new Date();
  void now;

  const [activeSignals, tpHitsTotal, pendingTargets] = await Promise.all([
    // Signals the watcher is actively monitoring
    prisma.signal.count({
      where: { isClosed: false },
    }),
    // Total targets hit (hitAt filter enabled once dev server restarts with new Prisma client)
    prisma.target.count({
      where: { hit: true },
    }),
    // Total un-hit targets across all open signals
    prisma.target.count({
      where: {
        hit: false,
        signal: { isClosed: false },
      },
    }),
  ]);

  return (
    <div className="rounded-[20px] border border-border/40 bg-card/20 p-6 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
            <Crosshair className="h-4 w-4 text-emerald-400" />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">TP Watcher</p>
            <p className="text-[10px] text-muted-foreground uppercase tracking-widest">
              Background price monitor
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-semibold text-emerald-400 uppercase tracking-widest">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          Running · 1 min
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3">
        <Stat
          icon={Target}
          value={activeSignals}
          label="Signals tracked"
          accent="text-sky-400"
          bg="bg-sky-500/10 border-sky-500/20"
        />
        <Stat
          icon={TrendingUp}
          value={pendingTargets}
          label="Pending TPs"
          accent="text-amber-400"
          bg="bg-amber-500/10 border-amber-500/20"
        />
        <Stat
          icon={Crosshair}
          value={tpHitsTotal}
          label="Total TPs hit"
          accent="text-emerald-400"
          bg="bg-emerald-500/10 border-emerald-500/20"
        />
      </div>

      {/* Inngest dashboard link */}
      <a
        href="https://app.inngest.com/env/production/functions"
        target="_blank"
        rel="noreferrer"
        className="flex items-center gap-2 text-[10px] text-muted-foreground/60 hover:text-muted-foreground transition-colors group"
      >
        <ExternalLink className="h-3 w-3 group-hover:text-primary transition-colors" />
        View function runs on Inngest dashboard
      </a>
    </div>
  );
}

interface StatProps {
  icon: React.ElementType;
  value: number;
  label: string;
  accent: string;
  bg: string;
}

function Stat({ icon: Icon, value, label, accent, bg }: StatProps) {
  return (
    <div className={`rounded-xl border p-3 flex flex-col gap-1.5 ${bg}`}>
      <Icon className={`h-3.5 w-3.5 ${accent}`} />
      <p className={`text-2xl font-light tabular-nums ${accent}`}>{value}</p>
      <p className="text-[10px] text-muted-foreground/70 leading-tight">{label}</p>
    </div>
  );
}
