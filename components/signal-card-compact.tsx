'use client';

import Link from 'next/link';
import { SignalWithTargets } from '@/types/signal';
import { Clock, TrendingUp, TrendingDown } from 'lucide-react';
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

    return (
        <Link href={`/signals/${signal.id}`} className="group block h-full">
            <div className="relative flex flex-col h-full rounded-2xl border border-border/60 dark:border-white/[0.06] bg-card/60 dark:bg-[#0a0a0a2d] backdrop-blur-xl p-5 gap-4 transition-all duration-300 hover:border-border dark:hover:border-white/[0.1] hover:-translate-y-0.5 overflow-hidden">

                {/* Header */}
                <div className="flex items-center gap-3">
                    <TokenImage token={base} className="h-9 w-9 rounded-xl flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                        <div className="flex items-baseline gap-1 leading-none">
                            <span className="text-[15px] font-bold tracking-tight text-foreground truncate">{base}</span>
                            <span className="text-[11px] text-muted-foreground/50">/{quote}</span>
                        </div>
                        <p className="text-[10px] text-muted-foreground/50 mt-0.5">{signal.network ?? 'Solana'} · {signal.market}</p>
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
