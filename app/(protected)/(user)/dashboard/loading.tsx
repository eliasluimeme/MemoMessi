import { Skeleton } from '@/components/ui/skeleton';

export default function DashboardLoading() {
  return (
    <div className="container mx-auto py-12 px-6 md:px-12 max-w-[1400px]">
      <div className="flex flex-col gap-20">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-12 border-b border-border/40">
          <div className="space-y-4 max-w-xl">
            <Skeleton className="h-6 w-36 rounded-full" />
            <Skeleton className="h-16 md:h-20 w-56 rounded-2xl" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-full max-w-md rounded-lg" />
              <Skeleton className="h-4 w-3/4 max-w-sm rounded-lg" />
            </div>
          </div>
        </div>

        {/* grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* TotalProfit / PerformanceMetrics: glass-card p-8 space-y-12 */}
          {[0, 1].map((i) => (
            <div
              key={i}
              className="rounded-[24px] border border-white/[0.02] bg-white/[0.01] h-full p-8 flex flex-col justify-between space-y-12"
            >
              <div className="flex items-center justify-between">
                <Skeleton className="h-3 w-28 rounded-full" />
                <Skeleton className="h-4 w-4 rounded-sm" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-14 w-36 rounded-xl" />
                <div className="flex items-center justify-between">
                  <Skeleton className="h-3 w-28 rounded-full" />
                  <Skeleton className="h-3 w-16 rounded-full" />
                </div>
              </div>
            </div>
          ))}
          {/* Static stat cards: rounded-[24px] border p-8 */}
          {[2, 3].map((i) => (
            <div
              key={i}
              className="rounded-[24px] border border-border/40 bg-card/40 p-8 flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-8">
                <Skeleton className="h-3 w-32 rounded-full" />
                <Skeleton className="h-4 w-4 rounded-sm" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-12 w-28 rounded-xl" />
                <Skeleton className="h-3 w-36 rounded-full" />
              </div>
            </div>
          ))}
        </div>

        {/* grid-cols-12: Alpha Stream col-span-8 + Institutional Access col-span-4 */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">

          <div className="lg:col-span-8 flex flex-col gap-8">
            <div className="flex items-center justify-between">
              <Skeleton className="h-6 w-32 rounded-lg" />
              <Skeleton className="h-3 w-36 rounded-full" />
            </div>
            <div className="space-y-8">
              {/* Feed sub-header */}
              <div className="flex items-center justify-between border-b border-white/[0.03] pb-6">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-2 w-2 rounded-full" />
                  <Skeleton className="h-3 w-24 rounded-full" />
                </div>
                <Skeleton className="h-7 w-24 rounded-full" />
              </div>
              {/* 3 compact signal cards: rounded-[24px] border border-white/[0.02] bg-white/[0.01] p-8 */}
              <div className="flex flex-col gap-6">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div
                    key={i}
                    className="relative overflow-hidden rounded-[24px] border border-white/[0.02] bg-white/[0.01] p-8"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-5">
                        <Skeleton className="h-14 w-14 rounded-[20px]" />
                        <div className="space-y-1.5">
                          <Skeleton className="h-7 w-28 rounded-lg" />
                          <Skeleton className="h-3 w-24 rounded-full" />
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <Skeleton className="h-6 w-28 rounded-full" />
                        <Skeleton className="h-3 w-20 rounded-full" />
                      </div>
                    </div>
                    <div className="mt-8 grid grid-cols-2 gap-10 pt-8 border-t border-white/[0.02]">
                      <div className="space-y-2">
                        <Skeleton className="h-3 w-24 rounded-full" />
                        <Skeleton className="h-5 w-20 rounded-lg" />
                      </div>
                      <div className="space-y-2 flex flex-col items-end">
                        <Skeleton className="h-3 w-24 rounded-full" />
                        <Skeleton className="h-5 w-20 rounded-lg" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Institutional Access: rounded-[32px] border border-primary/20 bg-primary/5 p-10 */}
          <div className="lg:col-span-4">
            <div className="sticky top-24 rounded-[32px] border border-primary/20 bg-primary/5 p-10 space-y-8">
              <Skeleton className="h-12 w-12 rounded-2xl" />
              <div className="space-y-3">
                <Skeleton className="h-8 w-44 rounded-xl" />
                <Skeleton className="h-5 w-32 rounded-xl" />
                <div className="space-y-2 pt-1">
                  <Skeleton className="h-4 w-full rounded-lg" />
                  <Skeleton className="h-4 w-5/6 rounded-lg" />
                </div>
              </div>
              <div className="space-y-3 pt-4 border-t border-primary/10">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <Skeleton className="h-1.5 w-1.5 rounded-full flex-shrink-0" />
                    <Skeleton className="h-4 w-36 rounded-full" />
                  </div>
                ))}
              </div>
              <Skeleton className="h-12 w-full rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
