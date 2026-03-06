import { prisma } from '@/lib/prisma';
import { Zap, Clock, TrendingUp, TrendingDown, Crown } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { TokenImage } from '@/components/token-image';
import { cn } from '@/lib/utils';
import Link from 'next/link';

const STATUS_CONFIG: Record<string, { label: string; color: string; dot: string }> = {
  WITHIN_ENTRY_ZONE: {
    label: 'Entry Zone',
    color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
    dot: 'bg-emerald-400 animate-pulse',
  },
  CLOSED: {
    label: 'Closed',
    color: 'text-white/30 bg-white/[0.03] border-white/[0.06]',
    dot: 'bg-white/30',
  },
  TP1: { label: 'TP1 Hit', color: 'text-sky-300 bg-sky-500/10 border-sky-500/25', dot: 'bg-sky-400' },
  TP2: { label: 'TP2 Hit', color: 'text-sky-300 bg-sky-500/10 border-sky-500/25', dot: 'bg-sky-400' },
  TP3: { label: 'TP3 Hit', color: 'text-violet-300 bg-violet-500/10 border-violet-500/25', dot: 'bg-violet-400' },
};

const getStatusConfig = (s: string) =>
  STATUS_CONFIG[s] ?? {
    label: s.replace(/_/g, ' '),
    color: 'text-white/30 bg-white/[0.03] border-white/[0.06]',
    dot: 'bg-white/30',
  };

export async function RecentSignalsAdmin() {
  const signals = await prisma.signal.findMany({
    take: 6,
    orderBy: { createdAt: 'desc' },
    include: { targets: true },
  });

  return (
    <div className="flex flex-col gap-6">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
            <Zap className="h-3.5 w-3.5 text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-medium tracking-tight">Recent Signals</h2>
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground/50 font-semibold">
              Latest Memecoin Entries
            </p>
          </div>
        </div>
        <Link
          href="/admin/signals"
          className="text-[10px] font-semibold uppercase tracking-widest text-primary/70 hover:text-primary transition-colors flex items-center gap-1.5"
        >
          View All
          <span className="text-base leading-none">→</span>
        </Link>
      </div>

      {/* Grid */}
      {signals.length === 0 ? (
        <div className="rounded-[24px] border border-border/40 bg-card/40 backdrop-blur-xl p-12 flex items-center justify-center">
          <p className="text-xs text-muted-foreground/40 uppercase tracking-widest">No signals posted yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {signals.map(signal => {
            const base = signal.pair.split('/')[0] ?? signal.pair;
            const quote = signal.pair.split('/')[1] ?? 'USDT';
            const isBuy = !signal.action || signal.action.toUpperCase() !== 'SELL';
            const lastTarget = signal.targets[signal.targets.length - 1];
            const hitsCount = signal.targets.filter(t => t.hit).length;
            const st = getStatusConfig(signal.status);

            return (
              <Link key={signal.id} href={`/admin/signals/${signal.id}`} className="group block h-[220px]">
                <div className={cn(
                  'relative h-full flex flex-col rounded-[20px] backdrop-blur-xl p-5 transition-all duration-300 hover:-translate-y-0.5 overflow-hidden border',
                  signal.isVip
                    ? 'border-amber-500/30 bg-amber-500/[0.04] hover:border-amber-500/50 shadow-[0_0_20px_rgba(245,158,11,0.07)]'
                    : 'border-border/50 bg-card/50 hover:border-border hover:bg-card/70'
                )}>
                  {/* Amber accent line for VIP */}
                  {signal.isVip && (
                    <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-amber-500/60 to-transparent" />
                  )}

                  {/* Glow accent */}
                  {signal.status !== 'CLOSED' && !signal.isVip && (
                    <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl pointer-events-none" />
                  )}

                  {/* Header */}
                  <div className="flex items-center gap-3 relative flex-shrink-0">
                    <TokenImage token={base} network={signal.network} contractAddress={signal.contractAddress} className="h-9 w-9 rounded-xl flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline gap-1">
                        <span className="text-[15px] font-bold tracking-tight text-foreground truncate">{base}</span>
                        <span className="text-[11px] text-muted-foreground/40">/{quote}</span>
                      </div>
                      <p className="text-[9px] text-muted-foreground/50 uppercase tracking-wider mt-0.5">
                        {signal.network ?? 'Solana'} · {signal.market}
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      {signal.isVip && (
                        <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-400 text-[9px] font-extrabold uppercase tracking-wider shadow-[0_0_8px_rgba(245,158,11,0.1)]">
                          <Crown className="h-2.5 w-2.5" /> VIP
                        </div>
                      )}
                      <div className={cn('flex items-center gap-1', isBuy ? 'text-emerald-400' : 'text-rose-400')}>
                        {isBuy
                          ? <TrendingUp className="h-3.5 w-3.5" />
                          : <TrendingDown className="h-3.5 w-3.5" />}
                        <span className="text-[10px] font-bold">
                          {isBuy ? 'LONG' : 'SHORT'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Status badge */}
                  <div className="mt-3 flex-shrink-0">
                    <div className={cn(
                      'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] font-semibold uppercase tracking-wider border',
                      st.color
                    )}>
                      <span className={cn('h-1.5 w-1.5 rounded-full', st.dot)} />
                      {st.label}
                    </div>
                  </div>

                  {/* Prices — always Entry + Target, gain shown inline if available */}
                  <div className="flex justify-between items-end border-t border-border/40 pt-3 mt-auto flex-shrink-0">
                    <div>
                      <p className="text-[9px] uppercase tracking-widest text-muted-foreground/50 mb-1">Entry</p>
                      <p className="font-mono text-sm font-bold text-foreground">${signal.entryZone}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[9px] uppercase tracking-widest text-muted-foreground/50 mb-1">Target</p>
                      <p className="font-mono text-sm font-bold text-emerald-400">
                        {lastTarget
                          ? `$${lastTarget.price.toFixed(4).replace(/\.?0+$/, '')}`
                          : <span className="text-muted-foreground/30">—</span>}
                      </p>
                    </div>
                  </div>

                  {/* Target progress — always rendered */}
                  <div className="space-y-1.5 mt-3 flex-shrink-0">
                    <div className="flex gap-1 h-1 w-full">
                      {signal.targets.length > 0
                        ? signal.targets.map((t, i) => (
                            <div
                              key={i}
                              className={cn(
                                'flex-1 h-full rounded-full transition-all duration-500',
                                t.hit ? 'bg-emerald-400' : 'bg-muted-foreground/15'
                              )}
                            />
                          ))
                        : <div className="flex-1 h-full rounded-full bg-muted-foreground/10" />
                      }
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] text-muted-foreground/50 font-medium">
                        {hitsCount}/{signal.targets.length} targets
                      </span>
                      <span className="flex items-center gap-1 text-[9px] text-muted-foreground/50">
                        <Clock className="h-2.5 w-2.5" />
                        {formatDistanceToNow(new Date(signal.createdAt))} ago
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
