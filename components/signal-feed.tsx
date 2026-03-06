import { SignalWithTargets } from '@/types/signal';
import { prisma, withRetry } from '@/lib/prisma';
import SignalCard from './signal-card-compact';
import { Button } from './ui/button';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { getSession } from '@/lib/auth-utils';
import { isVipUser } from '@/actions/signals';

export async function SignalFeed() {
    let latestSignals: SignalWithTargets[] = [];
    let error = false;

    try {
        const rawSignals = await withRetry(() =>
            prisma.signal.findMany({
                take: 3,
                orderBy: { createdAt: 'desc' },
                include: {
                    targets: { orderBy: { number: 'asc' } },
                    favorites: true,
                },
            })
        ) as SignalWithTargets[];

        // Determine VIP status for the current user
        let vip = false;
        try {
            const session = await getSession();
            if (session?.id) {
                const role = session.role;
                vip = role === 'ADMIN' || role === 'PRIVATE' || await isVipUser(session.id as string);
            }
        } catch {
            // not authenticated – treat as free
        }

        // Strip sensitive data from VIP signals for free users
        latestSignals = rawSignals.map((signal) => {
            if (signal.isVip && !vip) {
                return {
                    ...signal,
                    entryZone: 0,
                    stopLoss: null,
                    targets: [],
                    contractAddress: null,
                    note: null,
                    imageURL: null,
                    isLocked: true,
                };
            }
            return { ...signal, isLocked: false };
        });
    } catch (e) {
        console.error('[SignalFeed] DB error:', e);
        error = true;
    }

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between border-b border-border/40 pb-6">
                <div className="flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-primary" />
                    <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground/70">Latest Alpha</h2>
                </div>
                <Button variant="ghost" size="sm" asChild className="hover:bg-accent rounded-full">
                    <Link href="/signals" className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground/70 hover:text-primary transition-all group">
                        Live Stream <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
                    </Link>
                </Button>
            </div>
            <div className="flex flex-col gap-6">
                {error ? (
                    <div className="flex flex-col items-center justify-center py-20 bg-muted/20 rounded-[32px] border border-dashed border-border/50">
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/50">Unable to load signals — connection error</span>
                    </div>
                ) : latestSignals.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 bg-muted/20 rounded-[32px] border border-dashed border-border/50">
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/50">No active signals detected</span>
                    </div>
                ) : (
                    latestSignals.map((signal) => (
                        //@ts-ignore
                        <SignalCard key={signal.id} signal={signal} />
                    ))
                )}
            </div>
        </div>
    );
}
