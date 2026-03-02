import { getAllSignals } from '@/actions/signals';
import { Activity } from 'lucide-react';
import { MotionContainer, MotionItem } from '@/components/motion-container';
import { ContentView } from '@/components/signal/signals-list';

export default async function SignalsPage() {
  const signals = await getAllSignals();

  return (
    <div className="container mx-auto py-12 px-6 md:px-12 max-w-[1400px]">
      <MotionContainer className="space-y-12">
        <MotionItem className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-12 border-b border-border/40">
          <div className="space-y-4 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/50 text-muted-foreground text-[10px] uppercase tracking-widest font-semibold border border-border/50">
              Market Intelligence Protocol
            </div>
            <h1 className="text-5xl md:text-7xl font-light tracking-tight text-foreground flex items-center gap-4">
              Terminal
              <Activity className="h-8 w-8 text-primary opacity-50" />
            </h1>
            <p className="text-muted-foreground/60 text-sm md:text-base font-light tracking-wide leading-relaxed">
              Institutional-grade entry points and profit targets across all major markets, verified by the Alpha Protocol.
            </p>
          </div>
        </MotionItem>

        <MotionItem>
          <ContentView signals={signals} />
        </MotionItem>
      </MotionContainer>
    </div>
  );
}
