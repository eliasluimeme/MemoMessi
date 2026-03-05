import { notFound } from 'next/navigation';
import Link from 'next/link';

import { SignalWithTargets } from '@/types/signal';
import {
  AlertTriangle, DollarSign, FileText, Target,
  TrendingUp, TrendingDown, ChevronLeft, Clock,
  CheckCircle2, XCircle, Activity,
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

import TokenChart from '@/components/token-chart';
import CurrentPrice from '@/components/live-price';
import { TokenImage } from '@/components/token-image';
import { MotionContainer, MotionItem } from '@/components/motion-container';
import { cn } from '@/lib/utils';

import { getSession } from '@/lib/auth-utils';
import { prisma } from '@/lib/prisma';

const STATUS_CONFIG: Record<string, { label: string; color: string; dot: string }> = {
  WITHIN_ENTRY_ZONE: { label: 'In Entry Zone', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30', dot: 'bg-emerald-400 animate-pulse' },
  CLOSED:            { label: 'Closed',        color: 'text-white/40 bg-white/[0.04] border-white/[0.08]',       dot: 'bg-white/40' },
  TP1:               { label: 'TP1 Hit',       color: 'text-sky-400 bg-sky-500/10 border-sky-500/25',            dot: 'bg-sky-400' },
  TP2:               { label: 'TP2 Hit',       color: 'text-sky-400 bg-sky-500/10 border-sky-500/25',            dot: 'bg-sky-400' },
  TP3:               { label: 'TP3 Hit',       color: 'text-violet-400 bg-violet-500/10 border-violet-500/25',   dot: 'bg-violet-400' },
};
const getStatus = (s: string) =>
  STATUS_CONFIG[s] ?? { label: s.replace(/_/g, ' '), color: 'text-white/40 bg-white/[0.04] border-white/[0.08]', dot: 'bg-white/40' };

async function getSignal(id: string): Promise<SignalWithTargets | null> {
  const session = await getSession();
  if (!session) return null;

  return await prisma.signal.findUnique({
    where: { id },
    include: {
      targets: { orderBy: { number: 'asc' } },
      favorites: { where: { userId: session.id as string } },
    },
  });
}

export default async function SignalPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const signal = await getSignal(id);
  if (!signal) notFound();

  const base = signal.pair.split('/')[0] ?? signal.pair;
  const quote = signal.pair.split('/')[1] ?? 'USDT';
  const isBuy = !signal.action || signal.action.toUpperCase() !== 'SELL';
  const st = getStatus(signal.status);
  const hitsCount = signal.targets.filter(t => t.hit).length;
  const totalGain = signal.targets.reduce((s, t) => s + (t.hit ? t.gain : 0), 0);
  const allHit = signal.targets.length > 0 && signal.targets.every(t => t.hit);

  return (
    <div className="container mx-auto py-12 px-6 md:px-12 max-w-[1400px]">
      <MotionContainer className="space-y-10">

        {/* ── Back + Header ─────────────────────────────────────── */}
        <MotionItem className="space-y-6 pb-10 border-b border-border/40">
          <Link
            href="/admin/signals"
            className="inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60 hover:text-foreground transition-colors"
          >
            <ChevronLeft className="h-3 w-3" />
            Back to Signals
          </Link>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="flex items-center gap-5">
              <TokenImage token={base} className="h-16 w-16 rounded-2xl flex-shrink-0" />
              <div className="space-y-2">
                <div className="flex items-center gap-3 flex-wrap">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 text-[10px] uppercase tracking-widest font-semibold border border-emerald-500/20">
                    <Activity className="h-3 w-3" />
                    Signal Details
                  </div>
                  <div className={cn('inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] font-semibold uppercase tracking-wider border', st.color)}>
                    <span className={cn('h-1.5 w-1.5 rounded-full', st.dot)} />
                    {st.label}
                  </div>
                </div>
                <div className="flex items-baseline gap-4 flex-wrap">
                  <h1 className="text-4xl md:text-6xl font-light tracking-tight text-foreground flex items-baseline gap-2">
                    {base}
                    <span className="text-xl text-muted-foreground/40">/{quote}</span>
                  </h1>
                  <CurrentPrice
                    token={base}
                    contractAddress={signal.contractAddress}
                    network={signal.network}
                    className="text-2xl md:text-3xl"
                  />
                </div>
                <p className="text-xs text-muted-foreground/50 uppercase tracking-widest font-semibold">
                  {signal.network ?? 'Solana'} · {signal.market} · {formatDistanceToNow(new Date(signal.createdAt))} ago
                </p>
              </div>
            </div>

            {/* Quick stats */}
            <div className="flex items-center gap-3 flex-shrink-0">
              <div className="px-5 py-3 rounded-2xl bg-secondary/30 border border-border/40 backdrop-blur-md flex flex-col items-end gap-1">
                <span className="text-[9px] text-muted-foreground uppercase tracking-widest font-semibold">Direction</span>
                <span className={cn('text-sm font-bold flex items-center gap-1.5', isBuy ? 'text-emerald-400' : 'text-rose-400')}>
                  {isBuy ? <TrendingUp className="h-3.5 w-3.5" /> : <TrendingDown className="h-3.5 w-3.5" />}
                  {isBuy ? 'LONG' : 'SHORT'}
                </span>
              </div>
              {totalGain > 0 && (
                <div className="px-5 py-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex flex-col items-end gap-1">
                  <span className="text-[9px] text-muted-foreground uppercase tracking-widest font-semibold">Total Gain</span>
                  <span className="text-sm font-bold text-emerald-400">+{totalGain.toFixed(1)}%</span>
                </div>
              )}
            </div>
          </div>
        </MotionItem>

        {/* ── Chart ─────────────────────────────────────────────── */}
        <MotionItem>
          <div className="overflow-hidden">
            <TokenChart
              token={base}
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
        </MotionItem>

        {/* ── Targets + Info row ─────────────────────────────────── */}
        <MotionItem>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

            {/* Targets */}
            <div className="lg:col-span-7 p-8 space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                    <Target className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">Targets</p>
                    <p className="text-[9px] uppercase tracking-widest text-muted-foreground/50 font-semibold">
                      {hitsCount}/{signal.targets.length} hit
                    </p>
                  </div>
                </div>
                {allHit ? (
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    All targets hit
                  </div>
                ) : signal.status === 'CLOSED' ? (
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-secondary/30 border border-border/40 text-muted-foreground text-xs font-semibold">
                    <XCircle className="h-3.5 w-3.5" />
                    Closed
                  </div>
                ) : null}
              </div>

              {/* Progress bar */}
              {signal.targets.length > 0 && (
                <div className="flex gap-1.5 h-1.5 w-full">
                  {signal.targets.map((t, i) => (
                    <div key={i} className={cn('flex-1 h-full rounded-full transition-all duration-700', t.hit ? 'bg-emerald-400' : 'bg-muted-foreground/15')} style={{ transitionDelay: `${i * 60}ms` }} />
                  ))}
                </div>
              )}

              {/* Target rows */}
              <div className="space-y-2">
                {signal.targets.map((target) => (
                  <div
                    key={target.id}
                    className={cn(
                      'flex items-center justify-between px-4 py-3 rounded-2xl border transition-all',
                      target.hit
                        ? 'bg-emerald-500/5 border-emerald-500/20'
                        : 'bg-secondary/20 border-border/40'
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        'w-7 h-7 rounded-xl flex items-center justify-center text-[10px] font-bold flex-shrink-0',
                        target.hit ? 'bg-emerald-500/20 text-emerald-400' : 'bg-secondary/50 text-muted-foreground/60'
                      )}>
                        {target.hit ? '✓' : `T${target.number}`}
                      </div>
                      <div>
                        <p className={cn('text-xs font-semibold uppercase tracking-wider', target.hit ? 'text-emerald-400' : 'text-muted-foreground/60')}>
                          TP{target.number}
                        </p>
                        {target.gain > 0 && (
                          <p className={cn('text-[10px] font-bold', target.hit ? 'text-emerald-500' : 'text-muted-foreground/40')}>
                            +{target.gain}%
                          </p>
                        )}
                      </div>
                    </div>
                    <p className={cn('font-mono text-sm font-bold', target.hit ? 'text-foreground' : 'text-muted-foreground/50')}>
                      ${target.price}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Info panel */}
            <div className="lg:col-span-5 flex flex-col gap-4">

              {/* Entry + Stop Loss */}
              <div className="rounded-[24px] border border-border/40 bg-card/40 backdrop-blur-xl p-6 space-y-4">
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground/50 font-semibold">Price Levels</p>
                <div className="flex gap-3">
                  <div className="flex-1 rounded-2xl bg-secondary/30 border border-border/40 p-4 space-y-1.5">
                    <div className="flex items-center gap-1.5 text-muted-foreground/60">
                      <DollarSign className="h-3.5 w-3.5" />
                      <span className="text-[9px] uppercase tracking-widest font-semibold">Entry Zone</span>
                    </div>
                    <p className="font-mono text-base font-bold text-foreground">${signal.entryZone}</p>
                  </div>
                  {signal.stopLoss && (
                    <div className="flex-1 rounded-2xl bg-rose-500/5 border border-rose-500/20 p-4 space-y-1.5">
                      <div className="flex items-center gap-1.5 text-rose-500/70">
                        <AlertTriangle className="h-3.5 w-3.5" />
                        <span className="text-[9px] uppercase tracking-widest font-semibold">Stop Loss</span>
                      </div>
                      <p className="font-mono text-base font-bold text-rose-400">${signal.stopLoss}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Meta */}
              <div className="rounded-[24px] border border-border/40 bg-card/40 backdrop-blur-xl p-6 space-y-4">
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground/50 font-semibold">Signal Meta</p>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: 'Market', value: signal.market },
                    { label: 'Network', value: signal.network ?? 'Solana' },
                    { label: 'Action', value: signal.action ?? 'BUY' },
                    { label: 'Created', value: formatDistanceToNow(new Date(signal.createdAt)) + ' ago' },
                  ].map(item => (
                    <div key={item.label} className="rounded-2xl bg-secondary/20 border border-border/40 px-3 py-2.5">
                      <p className="text-[9px] uppercase tracking-widest text-muted-foreground/50 font-semibold mb-0.5">{item.label}</p>
                      <p className="text-xs font-semibold text-foreground">{item.value}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Note */}
              {signal.note && (
                <div className="rounded-[24px] border border-border/40 bg-card/40 backdrop-blur-xl p-6 space-y-3">
                  <div className="flex items-center gap-2 text-muted-foreground/60">
                    <FileText className="h-3.5 w-3.5" />
                    <p className="text-[10px] uppercase tracking-widest font-semibold">Alpha Note</p>
                  </div>
                  <p className="text-sm text-foreground/80 leading-relaxed">{signal.note}</p>
                </div>
              )}

              {/* Contract address */}
              {signal.contractAddress && (
                <div className="rounded-[24px] border border-border/40 bg-card/40 backdrop-blur-xl p-6 space-y-2">
                  <p className="text-[9px] uppercase tracking-widest text-muted-foreground/50 font-semibold">Contract Address</p>
                  <p className="font-mono text-[11px] text-muted-foreground/80 break-all">{signal.contractAddress}</p>
                </div>
              )}
            </div>
          </div>
        </MotionItem>

      </MotionContainer>
    </div>
  );
}
