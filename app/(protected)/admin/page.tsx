import { getGeneralAnalytics } from '@/actions/analytics';
import { BarChart2 } from 'lucide-react';
import { MotionContainer, MotionItem } from '@/components/motion-container';
import { SidebarTrigger } from '@/components/ui/sidebar';

import AnalyticsCards from './_components/analytics-cards';

export default async function AdminDashboard() {
  const analytics = await getGeneralAnalytics();

  return (
    <div className="container mx-auto py-12 px-6 md:px-12 max-w-[1400px]">
      <MotionContainer className="space-y-12">
        <MotionItem className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-12 border-b border-border/40">
          <div className="space-y-4 max-w-xl">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="-ml-2 h-10 w-10 rounded-xl border-border/40 bg-secondary/50 hover:bg-secondary transition-colors" />
              {/* <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 text-red-500 text-[10px] uppercase tracking-widest font-semibold border border-red-500/20">
                <BarChart2 className="h-3 w-3" />
                System Intelligence
              </div> */}
            </div>
            <h1 className="text-5xl md:text-7xl font-light tracking-tight text-foreground">
              Admin Console
            </h1>
            <p className="text-muted-foreground/60 text-sm md:text-base font-light tracking-wide leading-relaxed">
              Global overview of operational metrics and platform infrastructure health.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="px-5 py-3 rounded-2xl bg-secondary/30 border border-border/40 backdrop-blur-md flex flex-col items-end">
              <span className="text-xs text-muted-foreground uppercase tracking-widest font-semibold">System Load</span>
              <span className="text-sm font-medium text-emerald-500 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Optimal
              </span>
            </div>
          </div>
        </MotionItem>

        <MotionItem>
          <AnalyticsCards analytics={analytics} />
        </MotionItem>
      </MotionContainer>
    </div>
  );
}
