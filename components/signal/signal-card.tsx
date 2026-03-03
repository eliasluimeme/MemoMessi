'use client';

import Link from 'next/link';

import { Favorite, Signal, Target } from '@prisma/client';
import { formatDistanceToNow } from 'date-fns';
import { Clock, TrendingUp, TrendingDown } from 'lucide-react';

import LivePrice from '@/components/live-price';
import { cn } from '@/lib/utils';
// triggered refresh

import { TokenImage } from '../token-image';
import { FavoriteButton } from './favorite-button';

export type SignalWithTargets = Signal & {
  targets: Target[];
  favorites: Favorite[];
  isFavorite?: boolean;
};

interface SignalCardProps {
  signal: SignalWithTargets;
}

const statusConfig: Record<string, { label: string; color: string; dot: string }> = {
  WITHIN_ENTRY_ZONE: { label: 'In Entry Zone', color: 'dark:text-emerald-300 text-emerald-600 bg-emerald-500/10 dark:border-emerald-500/30 border-emerald-500/40', dot: 'bg-emerald-400 animate-pulse' },
  CLOSED:            { label: 'Closed',        color: 'dark:text-white/25 text-muted-foreground/50 dark:bg-white/[0.03] bg-muted/30 dark:border-white/[0.06] border-border/50', dot: 'dark:bg-white/25 bg-muted-foreground/30' },
  TP1:               { label: 'TP1 Hit',       color: 'dark:text-sky-300 text-sky-600 bg-sky-500/10 border-sky-500/25',             dot: 'bg-sky-400' },
  TP2:               { label: 'TP2 Hit',       color: 'dark:text-sky-300 text-sky-600 bg-sky-500/10 border-sky-500/25',             dot: 'bg-sky-400' },
  TP3:               { label: 'TP3 Hit',       color: 'dark:text-violet-300 text-violet-600 bg-violet-500/10 border-violet-500/25',    dot: 'bg-violet-400' },
};
const getStatus = (s: string) =>
  statusConfig[s] ?? { label: s.replace(/_/g, ' '), color: 'dark:text-white/25 text-muted-foreground/50 dark:bg-white/[0.03] bg-muted/30 dark:border-white/[0.06] border-border/50', dot: 'dark:bg-white/25 bg-muted-foreground/30' };

export default function SignalCard({ signal }: SignalCardProps) {
  const base      = signal.pair.split('/')[0] ?? signal.pair;
  const quote     = signal.pair.split('/')[1] ?? 'USDT';
  const isBuy     = !signal.action || signal.action.toUpperCase() !== 'SELL';
  const hitsCount = signal.targets.filter(t => t.hit).length;
  const lastTarget = signal.targets[signal.targets.length - 1];
  const st        = getStatus(signal.status);

  return (
    <Link href={`/signals/${signal.id}`} className="block group h-full">
      <div className="relative flex flex-col h-full rounded-2xl border dark:border-white/[0.06] border-border dark:bg-[#0a0a0a] bg-card backdrop-blur-xl p-5 gap-4 transition-all duration-300 dark:hover:border-white/[0.1] hover:border-border/80 hover:-translate-y-0.5 overflow-hidden shadow-sm dark:shadow-none">

        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="relative flex-shrink-0">
            <TokenImage token={base} className="h-10 w-10 rounded-xl" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-baseline gap-1 leading-none">
              <span className="text-[16px] font-bold dark:text-white text-foreground truncate">{base}</span>
              <span className="text-[11px] dark:text-white/20 text-muted-foreground/50">/{quote}</span>
            </div>
            <p className="text-[10px] dark:text-white/30 text-muted-foreground/60 mt-0.5">{signal.network ?? 'Solana'} · {signal.market}</p>
          </div>
          <div className="flex items-center gap-1.5 flex-shrink-0">
            {isBuy
              ? <TrendingUp className="h-3.5 w-3.5 text-emerald-400" />
              : <TrendingDown className="h-3.5 w-3.5 text-rose-400" />}
            <span className={cn('text-[10px] font-bold', isBuy ? 'text-emerald-400' : 'text-rose-400')}>
              {isBuy ? 'LONG' : 'SHORT'}
            </span>
          </div>
        </div>

        {/* Status badge */}
        <div className={cn(
          'inline-flex self-start items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider border',
          st.color
        )}>
          <span className={cn('h-1.5 w-1.5 rounded-full', st.dot)} />
          {st.label}
        </div>

        {/* Prices */}
        <div className="flex justify-between items-end border-t dark:border-white/[0.04] border-border/50 pt-4">
          <div>
            <p className="text-[9px] uppercase tracking-widest dark:text-white/20 text-muted-foreground/60 mb-1.5">Entry Zone</p>
            <p className="font-mono text-[18px] font-bold tracking-tight dark:text-white/80 text-foreground">${Number(signal.entryZone).toLocaleString()}</p>
          </div>
          <div className="text-right">
            <p className="text-[9px] uppercase tracking-widest dark:text-white/20 text-muted-foreground/60 mb-1.5">Live Price</p>
            <LivePrice token={base} className="font-mono text-[18px] font-bold text-sky-400 justify-end leading-none tracking-tight" />
          </div>
        </div>

        {/* Target progress */}
        <div className="space-y-2 mt-auto">
          <div className="flex gap-1 h-1 w-full">
            {signal.targets.map((t, i) => (
              <div key={i} className={cn(
                'flex-1 h-full rounded-full transition-all duration-700',
                t.hit ? 'bg-emerald-400' : 'dark:bg-white/[0.06] bg-muted/60'
              )} style={{ transitionDelay: `${i * 80}ms` }} />
            ))}
          </div>
          <div className="flex justify-between text-[10px] dark:text-white/20 text-muted-foreground/60">
            <span>{hitsCount}/{signal.targets.length} targets hit</span>
            {lastTarget && <span className="text-emerald-400/60">TP {lastTarget.price.toLocaleString()}</span>}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-1 border-t dark:border-white/[0.04] border-border/50">
          <span className="flex items-center gap-1.5 text-[10px] dark:text-white/20 text-muted-foreground/60">
            <Clock className="h-3 w-3" />
            {formatDistanceToNow(new Date(signal.createdAt))} ago
          </span>
          <div onClick={(e) => e.preventDefault()} className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <FavoriteButton signalId={signal.id} initialFavorited={signal.isFavorite || false} />
          </div>
        </div>
      </div>
    </Link>
  );
}
