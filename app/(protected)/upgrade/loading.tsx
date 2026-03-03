import { Skeleton } from '@/components/ui/skeleton';

export default function UpgradeLoading() {
  return (
    <main className="min-h-screen bg-black/60">
      <div className="container mx-auto px-4 py-8">
        {/* Logo area */}
        <div className="mb-8 flex justify-center">
          <Skeleton className="h-16 w-36 rounded-2xl" />
        </div>

        {/* Pricing header */}
        <div className="text-center space-y-4 mb-12">
          <Skeleton className="h-6 w-32 rounded-full mx-auto" />
          <Skeleton className="h-14 w-72 rounded-[16px] mx-auto" />
          <Skeleton className="h-4 w-96 rounded-lg mx-auto" />
        </div>

        {/* Plan cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className={`rounded-[28px] border p-8 space-y-6 ${
                i === 1
                  ? 'border-primary/30 bg-primary/5'
                  : 'border-border/40 bg-card/30'
              }`}
            >
              <div className="space-y-2">
                <Skeleton className="h-5 w-24 rounded-lg" />
                <Skeleton className="h-10 w-32 rounded-xl" />
                <Skeleton className="h-3 w-36 rounded-full" />
              </div>
              <div className="h-px w-full bg-border/30" />
              <div className="space-y-3">
                {Array.from({ length: 5 }).map((_, j) => (
                  <div key={j} className="flex items-center gap-3">
                    <Skeleton className="h-4 w-4 rounded-full flex-shrink-0" />
                    <Skeleton className="h-3 w-full rounded-full" />
                  </div>
                ))}
              </div>
              <Skeleton className="h-12 w-full rounded-xl" />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
