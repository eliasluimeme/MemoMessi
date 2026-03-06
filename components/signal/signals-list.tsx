'use client';

import { useMemo, useState } from 'react';

import { Favorite, Signal, Target } from '@prisma/client';
// import { SignalWithTargets } from '@/types/signal';
import { ArrowDownAZ, ArrowUpAZ, BanknoteIcon, Crown, Filter, Search } from 'lucide-react';

import SignalCard from '@/components/signal/signal-card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { cn } from '@/lib/utils';

// type ViewMode = 'grid' | 'list';
type SortOption = 'newest' | 'oldest' | 'price-high' | 'price-low';

export type SignalWithTargets = Signal & {
  targets: Target[];
  favorites: Favorite[];
  isFavorite?: boolean;
  isLocked?: boolean;
};

export function ContentView({ signals }: { signals: SignalWithTargets[] }) {
  // const router = useRouter();
  // const searchParams = useSearchParams();
  // const [viewMode, setViewMode] = useState<ViewMode>(
  //   (searchParams.get('view') as ViewMode) || 'grid',
  // );
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<SortOption>('newest');

  // const filters = [
  //   { label: 'SPOT', value: 'SPOT' },
  //   { label: 'WITHIN_ENTRY_ZONE', value: 'WITHIN_ENTRY_ZONE' },
  //   { label: 'CLOSED', value: 'CLOSED' },
  //   { label: 'BUY', value: 'BUY' },
  //   { label: 'SELL', value: 'SELL' },
  // ];

  const toggleFilter = (filter: string) => {
    if (filter === 'ALL') {
      setActiveFilters([]);
      return;
    }

    setActiveFilters([filter]); // Only allow one filter at a time
  };

  const filteredSignals = useMemo(() => {
    let filtered = signals;

    // Search filter
    const searchLower = searchQuery.toLowerCase();
    filtered = filtered.filter(
      (signal) =>
        signal.pair.toLowerCase().includes(searchLower) ||
        signal.market.toLowerCase().includes(searchLower) ||
        signal.action.toLowerCase().includes(searchLower) ||
        (signal.note || '').toLowerCase().includes(searchLower),
    );

    // Status/Market/Action filters
    if (activeFilters.length > 0) {
      filtered = filtered.filter((signal) => {
        return activeFilters.some(
          (filter) =>
            signal.status === filter ||
            signal.market === filter ||
            signal.action === filter ||
            (filter === 'VIP' && (signal as any).isVip === true),
        );
      });
    }

    // Sorting
    return filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'oldest':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'price-high':
          return Number(b.entryZone) - Number(a.entryZone);
        case 'price-low':
          return Number(a.entryZone) - Number(b.entryZone);
        default:
          return 0;
      }
    });
  }, [searchQuery, signals, activeFilters, sortBy]);

  // const updateViewMode = useCallback(
  //   (newMode: ViewMode) => {
  //     setViewMode(newMode);
  //     const params = new URLSearchParams(searchParams);
  //     params.set('view', newMode);
  //     router.replace(`?${params.toString()}`, { scroll: false });
  //   },
  //   [router, searchParams],
  // );

  const filterCounts = useMemo(() => {
    const counts = {
      ALL: signals.length,
      SPOT: 0,
      WITHIN_ENTRY_ZONE: 0,
      CLOSED: 0,
      BUY: 0,
      SELL: 0,
      VIP: 0,
    };

    signals.forEach((signal) => {
      if (signal.market === 'SPOT') counts.SPOT++;
      if (signal.status === 'WITHIN_ENTRY_ZONE') counts.WITHIN_ENTRY_ZONE++;
      if (signal.status === 'CLOSED') counts.CLOSED++;
      if (signal.action === 'BUY') counts.BUY++;
      if (signal.action === 'SELL') counts.SELL++;
      if ((signal as any).isVip) counts.VIP++;
    });

    return counts;
  }, [signals]);

  return (
    <div className="space-y-2">
      <header className="flex flex-col gap-16">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-12 pb-16">
          <div className="relative w-full md:max-w-2xl group">
            <div className="absolute inset-0 bg-white/[0.01] blur-2xl rounded-full opacity-0 group-focus-within:opacity-100 transition-opacity duration-1000" />
            <Search className="absolute left-5 top-1/2 h-4 w-4 -translate-y-1/2 dark:text-muted-foreground/20 text-muted-foreground/50 group-focus-within:text-primary group-focus-within:scale-110 transition-all duration-700 z-10" />
            <Input
              placeholder="Search signals..."
              className="relative z-0 pl-12 h-12 rounded-full border dark:border-white/[0.02] border-border/70 dark:bg-white/[0.01] bg-background dark:hover:bg-white/[0.02] hover:bg-muted/30 text-sm font-semibold tracking-[-0.01em] text-foreground dark:placeholder:text-muted-foreground/20 placeholder:text-muted-foreground/60 focus-visible:ring-1 dark:focus-visible:ring-white/[0.05] focus-visible:ring-primary/20 dark:focus-visible:border-white/[0.05] focus-visible:border-primary/30 transition-all duration-700"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-12">
            <Select value={sortBy} onValueChange={(value) => setSortBy(value as SortOption)}>
              <SelectTrigger className="w-auto h-12 px-6 rounded-full border dark:border-white/[0.02] border-border/70 dark:bg-white/[0.01] bg-background gap-3 text-micro dark:text-muted-foreground/30 text-muted-foreground/70 dark:hover:border-white/[0.08] hover:border-border hover:text-foreground dark:hover:bg-white/[0.03] hover:bg-muted/30 transition-all duration-700">
                <SelectValue placeholder="Sequence" />
              </SelectTrigger>
              <SelectContent className="rounded-3xl border dark:border-white/[0.05] border-border/60 bg-background/90 backdrop-blur-3xl p-3">
                <SelectGroup>
                  <SelectItem value="newest" className="rounded-2xl text-micro px-4 py-3 cursor-pointer">Recency Order</SelectItem>
                  <SelectItem value="oldest" className="rounded-2xl text-micro px-4 py-3 cursor-pointer">Legacy Order</SelectItem>
                  <SelectItem value="price-high" className="rounded-2xl text-micro px-4 py-3 cursor-pointer">High Intensity</SelectItem>
                  <SelectItem value="price-low" className="rounded-2xl text-micro px-4 py-3 cursor-pointer">Low Intensity</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>

            <div className="h-4 w-[1px] dark:bg-white/[0.05] bg-border" />

            <div className="flex items-center gap-4 overflow-x-auto scrollbar-hide py-2">
              {['ALL', 'SPOT', 'WITHIN_ENTRY_ZONE', 'CLOSED', 'VIP'].map((filter) => (
                <button
                  key={filter}
                  onClick={() => toggleFilter(filter)}
                  className={cn(
                    "relative overflow-hidden px-8 h-12 rounded-full text-micro transition-all duration-1000 border group/btn flex items-center justify-center gap-1.5",
                    (activeFilters[0] || 'ALL') === filter
                      ? filter === 'VIP'
                        ? "bg-amber-500/5 text-amber-400 border-amber-500/20"
                        : "bg-primary/5 text-primary border-primary/20"
                      : "dark:bg-white/[0.01] bg-background dark:text-muted-foreground/30 text-muted-foreground/70 dark:border-white/[0.02] border-border/60 dark:hover:border-white/[0.08] hover:border-border hover:bg-muted/30 hover:text-foreground"
                  )}
                >
                  {filter === 'VIP' && <Crown className="h-2.5 w-2.5" />}
                  <span className="relative z-10">{filter.replace(/_/g, ' ')}</span>
                  {((activeFilters[0] || 'ALL') === filter) && (
                    <div className="absolute inset-0 bg-primary/10 blur-xl rounded-full" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>

      <div className="@container">
        {filteredSignals.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-4 py-12 text-center">
            <p className="text-lg font-medium text-muted-foreground">No signals found</p>
            <p className="text-sm text-muted-foreground">
              Try adjusting your search or filters to find what you&apos;re looking for
            </p>
          </div>
        ) : (
          <div
            className={cn(
              'gap-8',
              'grid grid-cols-1 @[640px]:grid-cols-2 @[1024px]:grid-cols-3',
              // viewMode === 'grid'
              //   ? 'grid grid-cols-1 @[640px]:grid-cols-2 @[1024px]:grid-cols-3'
              //   : 'flex flex-col',
            )}
          >
            {filteredSignals.map((signal) => (
              <SignalCard key={signal.id} signal={signal} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
