import { getFavoriteSignals } from '@/actions/signals';
import { Star } from 'lucide-react';
import { ContentView } from '@/components/signal/signals-list';

export default async function FavoritesPage() {
  const signals = await getFavoriteSignals();

  return (
    <div className="container mx-auto py-12 px-6 md:px-12 max-w-[1400px]">
      <div className="flex flex-col gap-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-12 border-b border-border/40">
          <div className="space-y-4 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/50 text-muted-foreground text-[10px] uppercase tracking-widest font-semibold border border-border/50">
              Personalized Data Stream
            </div>
            <h1 className="text-5xl md:text-7xl font-light tracking-tight text-foreground flex items-center gap-4">
              Favorites
              <Star className="h-8 w-8 text-primary opacity-50" />
            </h1>
            <p className="text-muted-foreground/60 text-sm md:text-base font-light tracking-wide leading-relaxed">
              Your curated collection of high-conviction signals and market opportunities.
            </p>
          </div>
        </div>

        <div>
          <ContentView signals={signals} />
        </div>
      </div>
    </div>
  );
}
