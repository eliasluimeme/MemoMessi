'use client';

import Link from 'next/link';
import { SignalWithTargets } from '@/types/signal';
import { Clock, Zap } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';

export default function SignalCardCompact({ signal }: { signal: SignalWithTargets }) {
    return (
        <Link href={`/signals/${signal.id}`} className="group block">
            <div className="relative overflow-hidden rounded-[24px] border border-white/[0.02] bg-white/[0.01] p-8 transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] hover:border-white/[0.05] hover:bg-white/[0.02] hover:-translate-y-1">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-5">
                        <div className="h-14 w-14 rounded-[20px] bg-primary/5 border border-primary/10 flex items-center justify-center group-hover:bg-primary/10 transition-colors duration-700">
                            <Zap className="h-7 w-7 text-primary fill-primary/10" />
                        </div>
                        <div className="space-y-1">
                            <h3 className="text-2xl font-black tracking-[-0.05em] text-foreground group-hover:text-primary transition-colors duration-700 leading-none">
                                {signal.pair}
                            </h3>
                            <p className="text-micro text-muted-foreground/20 group-hover:text-muted-foreground/40 transition-colors duration-700">
                                {signal.network || 'Solana'} • {signal.market}
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-col items-end gap-2 text-right">
                        <div className={cn(
                            "px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-[0.2em] border transition-all duration-700",
                            signal.status === 'WITHIN_ENTRY_ZONE'
                                ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20 shadow-[0_0_20px_rgba(16,185,129,0.1)]"
                                : "bg-white/[0.03] text-muted-foreground/20 border-white/[0.05]"
                        )}>
                            {signal.status.replace(/_/g, ' ')}
                        </div>
                        <span className="text-micro text-muted-foreground/10 flex items-center gap-2 group-hover:text-muted-foreground/30 transition-colors">
                            <Clock className="h-2 w-2" />
                            {formatDistanceToNow(new Date(signal.createdAt))}
                        </span>
                    </div>
                </div>

                <div className="mt-8 grid grid-cols-2 gap-10 pt-8 border-t border-white/[0.02]">
                    <div className="space-y-2">
                        <span className="text-premium-label transition-colors duration-700 group-hover:text-muted-foreground/60">Entry Protocol</span>
                        <p className="font-mono text-[14px] font-black text-foreground/70 leading-none group-hover:text-foreground transition-colors duration-700">${signal.entryZone}</p>
                    </div>
                    <div className="space-y-2 text-right">
                        <span className="text-premium-label transition-colors duration-700 group-hover:text-muted-foreground/60">Yield Objective</span>
                        <p className="font-mono text-[14px] font-black text-emerald-500 leading-none group-hover:text-emerald-400 transition-colors duration-700">
                            ${signal.targets[signal.targets.length - 1]?.price.toFixed(4).replace(/\.?0+$/, '')}
                        </p>
                    </div>
                </div>
            </div>
        </Link>
    );
}
