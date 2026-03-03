import { Skeleton } from '@/components/ui/skeleton';

export default function AdminSignalDetailLoading() {
  return (
    <div className="container mx-auto max-w-5xl py-8 px-6">
      <div className="flex flex-col gap-8">
        {/* Header */}
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <Skeleton className="h-8 w-8 rounded-lg" />
            <Skeleton className="h-9 w-48 rounded-xl" />
          </div>
          <Skeleton className="h-4 w-64 rounded-lg" />
        </div>

        {/* Chart placeholder */}
        <Skeleton className="w-full h-[380px] rounded-[24px]" />

        {/* Targets */}
        <div className="rounded-[20px] border border-border/40 bg-card/30 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-4 rounded-sm" />
              <Skeleton className="h-5 w-20 rounded-lg" />
            </div>
            <Skeleton className="h-6 w-28 rounded-full" />
          </div>
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="flex items-center justify-between py-3 border-b border-border/20 last:border-0"
              >
                <div className="flex items-center gap-3">
                  <Skeleton className="h-6 w-6 rounded-full" />
                  <Skeleton className="h-4 w-20 rounded-lg" />
                </div>
                <div className="flex items-center gap-3">
                  <Skeleton className="h-4 w-24 rounded-lg" />
                  <Skeleton className="h-4 w-24 rounded-lg" />
                  <Skeleton className="h-6 w-16 rounded-full" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Details grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Stop Loss */}
          <div className="rounded-[20px] border border-border/40 bg-card/30 p-6 space-y-3">
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-4 rounded-sm" />
              <Skeleton className="h-4 w-20 rounded-lg" />
            </div>
            <Skeleton className="h-8 w-32 rounded-xl" />
          </div>

          {/* Notes */}
          <div className="rounded-[20px] border border-border/40 bg-card/30 p-6 space-y-3">
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-4 rounded-sm" />
              <Skeleton className="h-4 w-16 rounded-lg" />
            </div>
            <Skeleton className="h-4 w-full rounded-lg" />
            <Skeleton className="h-4 w-5/6 rounded-lg" />
            <Skeleton className="h-4 w-2/3 rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  );
}
