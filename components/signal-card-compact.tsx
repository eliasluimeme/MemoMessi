'use client';

import Link from 'next/link';
import { SignalWithTargets } from '@/types/signal';
import { Clock, Crown, Lock, TrendingUp, TrendingDown } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';
import { TokenImage } from '@/components/token-image';

const statusConfig: Record<string, { label: string; color: string; dot: string }> = {
    WITHIN_ENTRY_ZONE: { label: 'In Entry Zone', color: 'text-emerald-300 bg-emerald-500/10 border-emerald-500/30', dot: 'bg-emerald-400 animate-pulse' },
    CLOSED:            { label: 'Closed',        color: 'text-white/25 bg-white/[0.03] border-white/[0.06]',        dot: 'bg-white/25' },
    TP1:               { label: 'TP1 Hit',       color: 'text-sky-300 bg-sky-500/10 border-sky-500/25',             dot: 'bg-sky-400' },
    TP2:               { label: 'TP2 Hit',       color: 'text-sky-300 bg-sky-500/10 border-sky-500/25',             dot: 'bg-sky-400' },
    TP3:               { label: 'TP3 Hit',       color: 'text-violet-300 bg-violet-500/10 border-violet-500/25',    dot: 'bg-violet-400' },
};
const getStatus = (s: string) =>
    statusConfig[s] ?? { label: s.replace(/_/g, ' '), color: 'text-white/25 bg-white/[0.03] border-white/[0.06]', dot: 'bg-white/25' };

export default function SignalCardCompact({ signal }: { signal: SignalWithTargets }) {
    const base       = signal.pair.split('/')[0] ?? signal.pair;
    const quote      = signal.pair.split('/')[1] ?? 'USDT';
    const isBuy      = !signal.action || signal.action.toUpperCase() !== 'SELL';
    const lastTarget = signal.targets[signal.targets.length - 1];
    const hitsCount  = signal.targets.filter(t => t.hit).length;
    const st         = getStatus(signal.status);
    const isLocked   = signal.isLocked;

    if (isLocked) {
        return (
            <div className="relative flex flex-col h-full rounded-2xl border border-amber-500/25 dark:bg-[#0a0a0a2d] bg-card/60 backdrop-blur-xl overflow-hidden shadow-[0_0_20px_rgba(245,158,11,0.06)] select-none">
                {/* Amber top accent line */}
                <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-amber-500/50 to-transparent z-10" />

                {/* Blurred background content */}
                <div className="blur-md pointer-events-none opacity-50 p-5 flex flex-col gap-4">
                    <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-xl dark:bg-white/[0.06] bg-muted/50 flex-shrink-0" />
                        <div className="flex-1">
                            <div className="h-4 w-20 dark:bg-white/[0.08] bg-muted/60 rounded mb-1.5" />
                            <div className="h-3 w-14 dark:bg-white/[0.05] bg-muted/40 rounded" />
                        </div>
                        <div className="h-4 w-12 dark:bg-emerald-500/15 bg-emerald-500/10 rounded-full" />
                    </div>
                    <div className="flex justify-between pt-3 border-t dark:border-white/[0.04] border-border/50">
                        <div className="h-4 w-16 dark:bg-amber-400/10 bg-amber-400/8 rounded" />
                        <div className="h-4 w-16 dark:bg-emerald-400/10 bg-emerald-400/8 rounded" />
                    </div>
                    <div className="flex gap-1 h-1 w-full">
                        {[1, 2, 3].map(i => <div key={i} className="flex-1 h-full rounded-full dark:bg-white/[0.05] bg-muted/30" />)}
                    </div>
                </div>

                {/* Amber gradient wash — dark mode only to avoid cream bleed in light mode */}
                <div className="absolute inset-0 dark:bg-gradient-to-b dark:from-amber-950/40 dark:via-black/20 dark:to-amber-950/30 bg-background/60" />

                {/* Lock overlay */}
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2.5">
                    {/* VIP badge */}
                    <div className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 dark:border-amber-500/35 text-amber-600 dark:text-amber-400 text-[9px] font-extrabold uppercase tracking-[0.1em] dark:shadow-[0_0_10px_rgba(245,158,11,0.12)]">
                        <Crown className="h-2.5 w-2.5" /> VIP
                    </div>

                    {/* Token pair hint */}
                    {/* <p className="text-[13px] font-bold dark:text-white/65 text-foreground/70 tracking-tight leading-none">
                        {base}<span className="dark:text-white/20 text-muted-foreground/35 font-normal text-[10px]">/{quote}</span>
                    </p> */}

                    {/* Lock icon with glow */}
                    <div className="relative">
                        <div className="absolute inset-0 rounded-xl dark:bg-amber-500/25 bg-amber-500/10 blur-lg" />
                        <div className="relative h-9 w-9 rounded-xl bg-gradient-to-br from-amber-500/20 to-amber-600/10 border border-amber-500/40 flex items-center justify-center">
                            <Lock className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                        </div>
                    </div>

                    <Link
                        href="/upgrade"
                        className="inline-flex items-center gap-1 h-7 px-3.5 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-700 dark:text-amber-300 text-[10px] font-bold hover:bg-amber-500/30 hover:border-amber-500/60 transition-all duration-200 dark:shadow-[0_1px_10px_rgba(245,158,11,0.15)]"
                    >
                        <Crown className="h-2.5 w-2.5" /> Upgrade
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <Link href={`/signals/${signal.id}`} className="group block h-full">
            <div className={cn(
                'relative flex flex-col h-full rounded-2xl backdrop-blur-xl p-5 gap-4 transition-all duration-300 hover:-translate-y-0.5 overflow-hidden border',
                signal.isVip
                    ? 'border-amber-500/20 dark:bg-amber-500/[0.02] bg-card/60 hover:border-amber-500/35 dark:shadow-[0_0_24px_rgba(245,158,11,0.05)]'
                    : 'border-border/60 dark:border-white/[0.06] bg-card/60 dark:bg-[#0a0a0a2d] hover:border-border dark:hover:border-white/[0.1]'
            )}>
                {/* Amber accent line for VIP signals */}
                {signal.isVip && (
                    <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-amber-500/50 to-transparent" />
                )}

                {/* Header */}
                <div className="flex items-center gap-3">
                    <TokenImage token={base} network={signal.network} contractAddress={signal.contractAddress} className="h-9 w-9 rounded-xl flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                        <div className="flex items-baseline gap-1 leading-none">
                            <span className="text-[15px] font-bold tracking-tight text-foreground truncate">{base}</span>
                            <span className="text-[11px] text-muted-foreground/50">/{quote}</span>
                        </div>
                        <p className="text-[10px] text-muted-foreground/50 mt-0.5">{signal.network ?? 'Solana'} · {signal.market}</p>
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
                {/* <div className={cn(
                    'inline-flex self-start items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider border',
                    st.color
                )}>
                    <span className={cn('h-1.5 w-1.5 rounded-full', st.dot)} />
                    {st.label}
                </div> */}

                {/* Prices */}
                <div className="flex justify-between items-end border-t border-border/50 pt-3">
                    <div>
                        <p className="text-[9px] uppercase tracking-widest text-muted-foreground/60 mb-1.5">Entry</p>
                        <p className="font-mono text-[15px] font-bold text-foreground leading-none">${signal.entryZone}</p>
                    </div>
                    {lastTarget && (
                        <div className="text-right">
                            <p className="text-[9px] uppercase tracking-widest text-muted-foreground/60 mb-1.5">Final Target</p>
                            <p className="font-mono text-[15px] font-bold text-emerald-400 leading-none">
                                ${lastTarget.price.toFixed(4).replace(/\.?0+$/, '')}
                            </p>
                        </div>
                    )}
                </div>

                {/* Target progress */}
                <div className="space-y-1.5 mt-auto">
                    <div className="flex gap-1 h-1 w-full">
                        {signal.targets.map((t, i) => (
                            <div key={i} className={cn(
                                'flex-1 h-full rounded-full transition-all duration-700',
                                t.hit ? 'bg-emerald-400' : 'bg-muted-foreground/20'
                            )} style={{ transitionDelay: `${i * 60}ms` }} />
                        ))}
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-[10px] text-muted-foreground/60">{hitsCount}/{signal.targets.length} targets</span>
                        <span className="flex items-center gap-1 text-[10px] text-muted-foreground/60">
                            <Clock className="h-2.5 w-2.5" />
                            {formatDistanceToNow(new Date(signal.createdAt))} ago
                        </span>
                    </div>
                </div>
            </div>
        </Link>
    );
}
