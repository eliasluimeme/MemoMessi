'use client';

import Link from 'next/link';

import { Favorite, Signal, Target } from '@prisma/client';
import { formatDistanceToNow } from 'date-fns';
import { Clock, Crown, Lock, TrendingUp, TrendingDown } from 'lucide-react';

import LivePrice from '@/components/live-price';
import { cn } from '@/lib/utils';
// triggered refresh

import { TokenImage } from '../token-image';
import { FavoriteButton } from './favorite-button';

export type SignalWithTargets = Signal & {
  targets: Target[];
  favorites: Favorite[];
  isFavorite?: boolean;
  isLocked?: boolean;
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
  const isLocked  = signal.isLocked;

  if (isLocked) {
    return (
      <div className="relative flex flex-col h-full rounded-2xl border border-amber-500/25 dark:bg-[#0a0a0a2d] bg-card backdrop-blur-xl overflow-hidden shadow-[0_0_28px_rgba(245,158,11,0.06)] dark:shadow-[0_0_28px_rgba(245,158,11,0.08)] select-none">
        {/* Amber top accent line */}
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-amber-500/50 to-transparent z-10" />

        {/* Blurred background content */}
        <div className="blur-md pointer-events-none opacity-50 p-5 flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl dark:bg-white/[0.06] bg-muted/50 flex-shrink-0" />
            <div className="flex-1">
              <div className="h-4 w-28 dark:bg-white/[0.08] bg-muted/60 rounded mb-1.5" />
              <div className="h-3 w-16 dark:bg-white/[0.05] bg-muted/40 rounded" />
            </div>
            <div className="h-5 w-14 dark:bg-emerald-500/15 bg-emerald-500/10 rounded-full" />
          </div>
          <div className="h-6 w-24 dark:bg-white/[0.04] bg-muted/30 rounded-full" />
          <div className="flex justify-between items-end border-t dark:border-white/[0.04] border-border/50 pt-4">
            <div>
              <div className="h-2.5 w-14 dark:bg-white/[0.04] bg-muted/30 rounded mb-2" />
              <div className="h-6 w-24 dark:bg-amber-400/10 bg-amber-400/8 rounded" />
            </div>
            <div className="text-right">
              <div className="h-2.5 w-14 dark:bg-white/[0.04] bg-muted/30 rounded mb-2 ml-auto" />
              <div className="h-6 w-20 dark:bg-sky-400/10 bg-sky-400/8 rounded" />
            </div>
          </div>
          <div className="flex gap-1 h-1 w-full">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="flex-1 h-full rounded-full dark:bg-white/[0.05] bg-muted/30" />
            ))}
          </div>
          <div className="h-3 w-28 dark:bg-white/[0.03] bg-muted/20 rounded" />
        </div>

        {/* Amber gradient wash — dark mode only to avoid cream bleed in light mode */}
        <div className="absolute inset-0 dark:bg-gradient-to-b dark:from-amber-950/40 dark:via-black/20 dark:to-amber-950/30 bg-background/60" />

        {/* Lock overlay */}
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3.5 px-5">
          {/* VIP badge */}
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 dark:border-amber-500/35 text-amber-600 dark:text-amber-400 text-[10px] font-extrabold uppercase tracking-[0.12em] dark:shadow-[0_0_16px_rgba(245,158,11,0.15)]">
            <Crown className="h-3 w-3" /> VIP
          </div>

          {/* Token pair hint */}
          {/* <p className="text-[15px] font-bold dark:text-white/65 text-foreground/70 tracking-tight leading-none">
            {base}<span className="dark:text-white/20 text-muted-foreground/35 font-normal text-[11px]">/{quote}</span>
          </p> */}

          {/* Lock icon with glow */}
          <div className="relative">
            <div className="absolute inset-0 rounded-2xl dark:bg-amber-500/30 bg-amber-500/10 blur-xl" />
            <div className="relative h-12 w-12 rounded-2xl bg-gradient-to-br from-amber-500/20 to-amber-600/10 border border-amber-500/40 flex items-center justify-center">
              <Lock className="h-5 w-5 text-amber-600 dark:text-amber-400" />
            </div>
          </div>

          <p className="text-[11px] dark:text-white/35 text-muted-foreground/55 text-center max-w-[160px] leading-relaxed">
            Subscribe to VIP to unlock this signal
          </p>

          <Link
            href="/upgrade"
            className="inline-flex items-center gap-1.5 h-8 px-5 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-700 dark:text-amber-300 text-[11px] font-bold hover:bg-amber-500/30 hover:border-amber-500/60 transition-all duration-200 dark:shadow-[0_2px_14px_rgba(245,158,11,0.18)]"
          >
            <Crown className="h-3 w-3" /> Upgrade
          </Link>
        </div>
      </div>
    );
  }

  return (
    <Link href={`/signals/${signal.id}`} className="block group h-full">
      <div className={cn(
        'relative flex flex-col h-full rounded-2xl backdrop-blur-xl p-5 gap-4 transition-all duration-300 hover:-translate-y-0.5 overflow-hidden border',
        signal.isVip
          ? 'border-amber-500/20 dark:bg-amber-500/[0.02] bg-card hover:border-amber-500/35 dark:shadow-[0_0_28px_rgba(245,158,11,0.06)]'
          : 'dark:border-white/[0.06] border-border dark:bg-[#0a0a0a2d] bg-card dark:hover:border-white/[0.1] hover:border-border/80 shadow-sm dark:shadow-none'
      )}>
        {/* Amber accent line for VIP signals */}
        {signal.isVip && (
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-amber-500/50 to-transparent" />
        )}

        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="relative flex-shrink-0">
            <TokenImage token={base} network={signal.network} contractAddress={signal.contractAddress} className="h-10 w-10 rounded-xl" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-baseline gap-1 leading-none">
              <span className="text-[16px] font-bold dark:text-white text-foreground truncate">{base}</span>
              <span className="text-[11px] dark:text-white/20 text-muted-foreground/50">/{quote}</span>
            </div>
            <p className="text-[10px] dark:text-white/30 text-muted-foreground/60 mt-0.5">{signal.network ?? 'Solana'} · {signal.market}</p>
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
              <span className={cn('text-[10px] font-bold')}>
                {isBuy ? 'LONG' : 'SHORT'}
              </span>
            </div>
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
