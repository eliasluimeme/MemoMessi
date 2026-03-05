import { getGeneralAnalytics } from '@/actions/analytics';
import { Suspense } from 'react';
import { MotionContainer, MotionItem } from '@/components/motion-container';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Flame, Activity } from 'lucide-react';

import AnalyticsCards from './_components/analytics-cards';
import { CommandStats } from './_components/command-stats';
import { MonthlyRevenue } from './_components/monthly-revenue';
import { PlanDistribution } from './_components/plan-distribution';
import { TopPairs } from './_components/top-pairs';
import { ExpiringUsers } from './_components/expiring-users';
import { RecentSignalsAdmin } from './_components/recent-signals-admin';

export const dynamic = 'force-dynamic';

function SectionSkeleton({ className = '' }: { className?: string }) {
  return (
    <div className={`rounded-[24px] border border-border/40 bg-card/20 animate-pulse ${className}`} />
  );
}

export default async function AdminDashboard() {
  const analytics = await getGeneralAnalytics();

  return (
    <div className="container mx-auto py-12 px-6 md:px-12 max-w-[1400px]">
      <MotionContainer className="space-y-16">

        {/* ── Header ─────────────────────────────────────────────── */}
        <MotionItem className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-12 border-b border-border/40">
          <div className="space-y-4 max-w-xl">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="-ml-2 h-10 w-10 rounded-xl border-border/40 bg-secondary/50 hover:bg-secondary transition-colors" />
            </div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-500 text-[10px] uppercase tracking-widest font-semibold border border-amber-500/20">
              <Flame className="h-3 w-3" />
              Degen Command Center
            </div>
            <h1 className="text-5xl md:text-7xl font-light tracking-tight text-foreground">
              Admin Console
            </h1>
            <p className="text-muted-foreground/60 text-sm md:text-base font-light tracking-wide leading-relaxed">
              Real-time intelligence across memecoin signals, degen community health, and revenue flows.
            </p>
          </div>
          <div className="flex items-center gap-4 flex-shrink-0">
            <div className="px-5 py-4 rounded-2xl bg-secondary/30 border border-border/40 backdrop-blur-md flex flex-col items-end gap-2">
              <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold">Alpha Protocol</span>
              <span className="text-sm font-medium text-emerald-500 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Live
              </span>
            </div>
            {/* <div className="px-5 py-4 rounded-2xl bg-secondary/30 border border-border/40 backdrop-blur-md flex flex-col items-end gap-2">
              <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold">Network</span>
              <span className="text-sm font-medium text-sky-400 flex items-center gap-2">
                <Activity className="h-3.5 w-3.5" />
                Solana
              </span>
            </div> */}
          </div>
        </MotionItem>

        {/* ── Command Stats Bar ────────────────────────────────────── */}
        <MotionItem>
          <Suspense fallback={<SectionSkeleton className="h-20" />}>
            <CommandStats />
          </Suspense>
        </MotionItem>

        {/* ── KPI Analytics Cards ──────────────────────────────────── */}
        <MotionItem>
          <div className="space-y-3">
            <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">
              Platform Overview
            </p>
            <AnalyticsCards analytics={analytics} />
          </div>
        </MotionItem>

        {/* ── Revenue + Plan Distribution ──────────────────────────── */}
        <MotionItem>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-8">
              <Suspense fallback={<SectionSkeleton className="h-80" />}>
                <MonthlyRevenue />
              </Suspense>
            </div>
            <div className="lg:col-span-4">
              <Suspense fallback={<SectionSkeleton className="h-80" />}>
                <PlanDistribution />
              </Suspense>
            </div>
          </div>
        </MotionItem>

        {/* ── Top Pairs + Expiring Users ───────────────────────────── */}
        <MotionItem>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7">
              <Suspense fallback={<SectionSkeleton className="h-96" />}>
                <TopPairs />
              </Suspense>
            </div>
            <div className="lg:col-span-5">
              <Suspense fallback={<SectionSkeleton className="h-96" />}>
                <ExpiringUsers />
              </Suspense>
            </div>
          </div>
        </MotionItem>

        {/* ── Recent Signals Feed ──────────────────────────────────── */}
        <MotionItem>
          <Suspense fallback={
            <div className="space-y-4">
              <SectionSkeleton className="h-8 w-48" />
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[...Array(6)].map((_, i) => <SectionSkeleton key={i} className="h-52" />)}
              </div>
            </div>
          }>
            <RecentSignalsAdmin />
          </Suspense>
        </MotionItem>

      </MotionContainer>
    </div>
  );
}
