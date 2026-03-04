import { notFound, redirect } from 'next/navigation';

import { SignalWithTargets } from '@/types/signal';
import {
  AlertTriangle,
  Copy,
  DollarSign,
  ExternalLink,
  FileText,
  LayoutPanelLeft,
  Target,
  Zap,
  Wallet
} from 'lucide-react';

import TokenChart from '@/components/token-chart';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CopyButton } from '@/components/copy-button';
import JupiterTerminal from '@/components/jupiter-terminal';
import { cn } from '@/lib/utils';
import { getSession } from '@/lib/auth-utils';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

async function getSignal(id: string): Promise<SignalWithTargets | 'unauthorized' | null> {
  const session = await getSession();
  if (!session) return 'unauthorized';

  try {
    return await prisma.signal.findUnique({
      where: { id },
      include: {
        targets: {
          orderBy: {
            number: 'asc',
          },
        },
        favorites: {
          where: {
            userId: session.id as string,
          },
        },
      },
    });
  } catch (error) {
    console.error('[SignalPage] Failed to fetch signal:', id, error);
    return null;
  }
}

export default async function SignalPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const signal = await getSignal(id);
  if (signal === 'unauthorized') redirect('/login');
  if (!signal) notFound();

  const isSolana = signal.network === 'solana';
  const swapUrl = isSolana
    ? `https://jup.ag/swap/SOL-${signal.contractAddress}`
    : `https://app.uniswap.org/#/swap?outputCurrency=${signal.contractAddress}&chain=${signal.network || 'base'}`;

  return (
    <div className="container mx-auto max-w-[1200px] py-12 px-8">
      <div className="flex flex-col gap-16">

        {/* Superior Minimalist Header */}
        <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-[24px] bg-primary/5 border border-primary/10 flex items-center justify-center shadow-2xl">
                <Zap className="h-9 w-9 text-primary fill-primary/10" />
              </div>
              <div className="space-y-1">
                <div className="text-micro text-primary/60">Live Signal Protocol</div>
                <h1 className="text-5xl md:text-7xl font-black tracking-[-0.05em] text-foreground leading-none">
                  {signal.pair.split('/')[0]}<span className="text-muted-foreground/20 text-3xl md:text-5xl ml-2 tracking-tighter">/{signal.pair.split('/')[1]}</span>
                </h1>
              </div>
            </div>
            <div className="flex items-center gap-4 text-premium-label">
              <span className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                Sequence Initialized {new Date(signal.createdAt).toLocaleDateString()}
              </span>
              <span className="h-3 w-[1px] bg-white/10" />
              <span className="text-muted-foreground/20">{signal.id.slice(0, 8)}...</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className={cn(
              "px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-[0.3em] border transition-all duration-700",
              signal.status === 'WITHIN_ENTRY_ZONE'
                ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20 shadow-[0_0_20px_rgba(16,185,129,0.2)]"
                : "bg-white/[0.02] text-muted-foreground/40 border-white/[0.05]"
            )}>
              {signal.status.replace(/_/g, ' ')}
            </div>
            <div className="px-6 py-2.5 rounded-full border border-white/[0.05] bg-white/[0.02] text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/40">
              {signal.network}
            </div>
          </div>
        </div>

        {/* High-Performance Visualizer */}
        <div className="rounded-[32px] overflow-hidden border border-white/[0.02] bg-white/[0.01]">
          <TokenChart
            token={signal.pair.split('/')[0]}
            createdAt={signal.createdAt}
            market={signal.market}
            status={signal.status}
            pair={signal.pair}
            signalId={signal.id}
            initialFavorited={signal.favorites.length > 0}
            network={signal.network || 'solana'}
            contractAddress={signal.contractAddress || undefined}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          {/* Detailed Intelligence Overview */}
          <div className="lg:col-span-8 space-y-16">

            {/* Tactical Execution Hub */}
            <div className="space-y-8">
              <div className="flex items-center gap-4 border-b border-white/[0.03] pb-6">
                <div className="h-10 w-10 rounded-xl bg-blue-500/5 border border-blue-500/10 flex items-center justify-center">
                  <LayoutPanelLeft className="h-5 w-5 text-blue-500" />
                </div>
                <h2 className="text-micro text-muted-foreground/40">Tactical Execution Hub</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                {signal.contractAddress && (
                  <div className="glass-card p-10 space-y-6">
                    <span className="text-micro text-muted-foreground/20">Identified Contract Address</span>
                    <div className="flex items-center gap-4">
                      <code className="flex-1 bg-white/[0.01] border border-white/[0.02] px-6 py-4 rounded-full text-xs font-mono truncate text-muted-foreground/60 shadow-inner">
                        {signal.contractAddress}
                      </code>
                      <CopyButton value={signal.contractAddress} className="h-12 w-12 rounded-full bg-white/[0.01] hover:bg-white/[0.03] border border-white/[0.02] hover:border-white/[0.08] text-muted-foreground/40 hover:text-foreground transition-all duration-1000 flex items-center justify-center" />
                    </div>
                  </div>
                )}

                <div className="glass-card p-10 space-y-6">
                  <span className="text-micro text-muted-foreground/20">Execution Route</span>
                  <Button asChild className="w-full relative overflow-hidden group/btn bg-white/[0.01] hover:bg-white/[0.03] border border-white/[0.02] hover:border-white/[0.08] text-micro text-muted-foreground/30 hover:text-foreground h-16 rounded-full transition-all duration-1000 flex items-center justify-center">
                    <a href={swapUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 z-10 relative">
                      <ExternalLink className="h-4 w-4 opacity-40 group-hover/btn:opacity-100 group-hover/btn:scale-110 transition-all duration-700" />
                      Swap on {isSolana ? 'Jupiter' : 'Uniswap'} Protocol
                    </a>
                  </Button>
                </div>
              </div>
            </div>

            {/* Intelligence Analysis */}
            <div className="space-y-8">
              <div className="flex items-center gap-4 border-b border-white/[0.03] pb-6">
                <div className="h-10 w-10 rounded-xl bg-white/[0.02] border border-white/[0.05] flex items-center justify-center">
                  <FileText className="h-5 w-5 text-muted-foreground/40" />
                </div>
                <h2 className="text-micro text-muted-foreground/40">Operational Analysis</h2>
              </div>
              <div className="glass-card p-10">
                <p className="text-[13px] leading-[1.8] font-bold text-muted-foreground/60 whitespace-pre-wrap uppercase tracking-widest">
                  {signal.note || 'No additional analysis provided for this signal.'}
                </p>
              </div>
            </div>

            {/* Direct Integration */}
            {isSolana && signal.contractAddress && (
              <div className="space-y-10 pt-8">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-[20px] bg-emerald-500/5 border border-emerald-500/10 flex items-center justify-center">
                    <Wallet className="h-5 w-5 text-emerald-500/60" />
                  </div>
                  <h2 className="text-xl font-black tracking-tighter">Terminal Integration</h2>
                </div>
                <div className="rounded-[40px] overflow-hidden border border-white/[0.05]">
                  <JupiterTerminal mint={signal.contractAddress} />
                </div>
              </div>
            )}
          </div>

          {/* Precision Metrics & Sequence Targets */}
          <div className="lg:col-span-4 space-y-12">

            {/* Critical Extraction Zones */}
            <div className="space-y-6">
              <div className="glass-card p-8 border-emerald-500/10 bg-emerald-500/[0.02] space-y-2">
                <span className="text-micro text-emerald-500/40 flex items-center gap-2">
                  <div className="h-1 w-1 rounded-full bg-emerald-500" />
                  Optimal Entry Force
                </span>
                <span className="text-4xl font-black font-mono text-foreground">${signal.entryZone}</span>
              </div>

              {signal.stopLoss && (
                <div className="glass-card p-8 border-red-500/10 bg-red-500/[0.02] space-y-2">
                  <span className="text-micro text-red-500/40 flex items-center gap-2">
                    <div className="h-1 w-1 rounded-full bg-red-500" />
                    Termination Zone
                  </span>
                  <span className="text-4xl font-black font-mono text-foreground/80">${signal.stopLoss}</span>
                </div>
              )}
            </div>

            {/* Profit Extraction Sequence */}
            <div className="glass-card p-10 space-y-12">
              <div className="flex items-center justify-between">
                <h2 className="text-micro text-muted-foreground/40 flex items-center gap-3">
                  <Target className="h-4 w-4" /> Extraction Sequence
                </h2>
                <div className="px-3 py-1 rounded-full bg-white/[0.03] text-[9px] font-black uppercase tracking-widest text-muted-foreground/20 border border-white/[0.05]">
                  {signal.targets.filter(t => t.hit).length} / {signal.targets.length} Complete
                </div>
              </div>

              <div className="space-y-8">
                {signal.targets.map((target, idx) => (
                  <div key={target.id} className="flex items-center justify-between group">
                    <div className="flex items-center gap-6">
                      <div className={cn(
                        "h-12 w-12 rounded-2xl flex items-center justify-center text-[11px] font-black transition-all duration-700",
                        target.hit
                          ? "bg-emerald-500 text-black shadow-[0_0_20px_rgba(16,185,129,0.3)]"
                          : "bg-white/[0.02] text-muted-foreground/20 border border-white/[0.05]"
                      )}>
                        T{target.number}
                      </div>
                      <div className="space-y-1">
                        <span className={cn(
                          "text-xl font-black font-mono transition-colors duration-700",
                          target.hit ? "text-emerald-500" : "text-foreground/40"
                        )}>
                          ${target.price.toFixed(6).replace(/\.?0+$/, '')}
                        </span>
                        <div className="flex items-center gap-2 text-micro text-muted-foreground/20 uppercase">
                          Force Yield: <span className={target.hit ? "text-emerald-500/60" : ""}>+{target.gain}%</span>
                        </div>
                      </div>
                    </div>
                    {target.hit && (
                      <div className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.8)]" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
