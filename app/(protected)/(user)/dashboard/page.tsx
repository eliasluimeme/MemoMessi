import { MotionContainer, MotionItem } from '@/components/motion-container';
import { PerformanceMetrics } from '@/components/performance-metrics';
import { SignalFeed } from '@/components/signal-feed';
import { TotalProfit } from '@/components/total-profit';
import { ShieldCheck, TrendingUp, ArrowUpRight, Zap, Crown, Check } from 'lucide-react';
import { getSession } from '@/lib/auth-utils';
import { isVipUser } from '@/actions/signals';
import Link from 'next/link';

export default async function Dashboard() {
  let vip = false;
  try {
    const session = await getSession();
    if (session?.id) {
      const role = session.role;
      vip = role === 'ADMIN' || role === 'PRIVATE' || await isVipUser(session.id as string);
    }
  } catch {
    // unauthenticated
  }

  return (
    <div className="container mx-auto py-12 px-6 md:px-12 max-w-[1400px]">
      <MotionContainer className="flex flex-col gap-20">
        {/* Header */}
        <MotionItem className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-12 border-b border-border/40">
          <div className="space-y-4 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/5 text-primary text-[10px] uppercase tracking-widest font-semibold border border-primary/10">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              Live Terminal
            </div>
            <h1 className="text-5xl md:text-7xl font-light tracking-tight text-foreground">
              Overview
            </h1>
            <p className="text-muted-foreground/70 text-sm md:text-base font-light tracking-wide leading-relaxed">
              Institutional-grade market intelligence and real-time signal verification for elite operators.
            </p>
          </div>
        </MotionItem>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MotionItem>
            <TotalProfit />
          </MotionItem>
          <MotionItem>
            <PerformanceMetrics />
          </MotionItem>

          <MotionItem>
            <div className="h-full rounded-[24px] border border-border/40 bg-card/40 backdrop-blur-xl p-8 transition-all hover:bg-card/60 flex flex-col justify-between group">
              <div className="flex items-center justify-between mb-8">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Yield Optimization</span>
                <TrendingUp className="h-4 w-4 text-primary/50 group-hover:text-primary transition-colors" />
              </div>
              <div>
                <div className="text-4xl lg:text-5xl font-light tracking-tight text-foreground mb-3">84.2%</div>
                <div className="flex items-center gap-1.5 text-emerald-500 font-medium text-xs">
                  <ArrowUpRight className="h-3 w-3" />
                  <span>Superior to Baseline</span>
                </div>
              </div>
            </div>
          </MotionItem>

          <MotionItem>
            <div className="h-full rounded-[24px] border border-border/40 bg-card/40 backdrop-blur-xl p-8 transition-all hover:bg-card/60 flex flex-col justify-between group">
              <div className="flex items-center justify-between mb-8">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Protocol Integrity</span>
                <ShieldCheck className="h-4 w-4 text-cyan-500/50 group-hover:text-cyan-500 transition-colors" />
              </div>
              <div>
                <div className="text-4xl lg:text-5xl font-light tracking-tight text-foreground mb-3">99.1%</div>
                <div className="text-xs font-medium text-muted-foreground">
                  Audited Infrastructure
                </div>
              </div>
            </div>
          </MotionItem>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
          <MotionItem className="lg:col-span-8 flex flex-col gap-8">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-medium tracking-tight">Alpha Stream</h2>
              <div className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary/50" />
                Real-time Sequence
              </div>
            </div>
            <SignalFeed />
          </MotionItem>

          <MotionItem className="lg:col-span-4">
            {vip ? (
              /* VIP Active card */
              <div className="sticky top-24 rounded-[32px] border border-amber-500/30 bg-amber-500/5 p-10 overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 opacity-20 group-hover:opacity-40 transition-opacity duration-700">
                  <Crown className="w-48 h-48 text-amber-400 blur-3xl" />
                </div>
                <div className="relative z-10 flex flex-col gap-8">
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                    <Crown className="h-5 w-5 text-amber-400" />
                  </div>
                  <div className="space-y-3">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[10px] font-bold uppercase tracking-widest">
                      VIP Active
                    </div>
                    <h3 className="text-3xl font-light tracking-tight">Full<br />Access Unlocked</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      You have unrestricted access to all VIP signals, exclusive alpha streams, and priority market intelligence.
                    </p>
                  </div>
                  <div className="space-y-3 pt-4 border-t border-amber-500/10">
                    {['All VIP Signals Unlocked', 'Priority Telegram Alerts', 'Exclusive Alpha Stream', 'Expert Verification'].map((feat, i) => (
                      <div key={i} className="flex items-center gap-3 text-sm text-foreground/80">
                        <Check className="w-4 h-4 text-amber-400 flex-shrink-0" />
                        {feat}
                      </div>
                    ))}
                  </div>
                  <Link
                    href="/signals"
                    className="w-full py-4 mt-4 rounded-xl bg-amber-500 text-black font-semibold text-sm hover:bg-amber-400 transition-colors text-center block"
                  >
                    View All VIP Signals
                  </Link>
                </div>
              </div>
            ) : (
              /* Free tier upgrade card */
              <div className="sticky top-24 rounded-[32px] border border-primary/20 bg-primary/5 p-10 overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 opacity-20 group-hover:opacity-40 transition-opacity duration-700">
                  <Zap className="w-48 h-48 text-primary blur-3xl" />
                </div>
                <div className="relative z-10 flex flex-col gap-8">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                    <Zap className="h-5 w-5 text-primary" />
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-3xl font-light tracking-tight">Institutional<br />Access</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Unlock proprietary VIP signal streams and exclusive alpha for maximum edge in the market.
                    </p>
                  </div>
                  <div className="space-y-3 pt-4 border-t border-primary/10">
                    {[' VIP Exclusive Signals', ' Priority Telegram Alerts', ' Full Alpha Stream'].map((feat, i) => (
                      <div key={i} className="flex items-center gap-3 text-sm text-foreground/60">
                        <div className="w-1 h-1 rounded-full bg-primary/50" />
                        {feat}
                      </div>
                    ))}
                  </div>
                  <Link
                    href="/upgrade"
                    className="w-full py-4 mt-4 rounded-xl bg-primary text-primary-foreground font-medium text-sm hover:opacity-90 transition-opacity text-center block"
                  >
                    Upgrade to VIP
                  </Link>
                </div>
              </div>
            )}
          </MotionItem>
        </div>
      </MotionContainer>
    </div>
  );
}
