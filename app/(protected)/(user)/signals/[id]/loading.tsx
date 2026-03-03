import { Skeleton } from '@/components/ui/skeleton';

export default function SignalDetailLoading() {
  return (
    <div className="container mx-auto max-w-[1200px] py-12 px-8">
      <div className="flex flex-col gap-16">

        {/* Header: icon box + pair name/subtitle + status badges */}
        <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <Skeleton className="h-16 w-16 rounded-[24px]" />
              <div className="space-y-2">
                <Skeleton className="h-3 w-32 rounded-full" />
                <Skeleton className="h-16 w-52 rounded-[14px]" />
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Skeleton className="h-3 w-44 rounded-full" />
              <div className="h-3 w-[1px] bg-white/10" />
              <Skeleton className="h-3 w-24 rounded-full" />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Skeleton className="h-9 w-32 rounded-full" />
            <Skeleton className="h-9 w-24 rounded-full" />
          </div>
        </div>

        {/* Chart: rounded-[32px] overflow-hidden border border-white/[0.02] */}
        <Skeleton className="w-full h-[420px] rounded-[32px]" />

        {/* Info panels */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Entry zone — col-span-4 */}
          <div className="lg:col-span-4 rounded-[24px] border border-white/[0.02] bg-white/[0.01] p-8 space-y-6">
            <Skeleton className="h-3 w-24 rounded-full" />
            <Skeleton className="h-10 w-40 rounded-xl" />
            <Skeleton className="h-3 w-full rounded-full" />
          </div>

          {/* Targets — col-span-8 */}
          <div className="lg:col-span-8 rounded-[24px] border border-white/[0.02] bg-white/[0.01] p-8 space-y-6">
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-20 rounded-full" />
              <Skeleton className="h-6 w-28 rounded-full" />
            </div>
            <div className="space-y-1">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between py-4 border-b border-white/[0.03] last:border-0"
                >
                  <div className="flex items-center gap-4">
                    <Skeleton className="h-7 w-7 rounded-full" />
                    <Skeleton className="h-4 w-16 rounded-lg" />
                  </div>
                  <div className="flex items-center gap-6">
                    <Skeleton className="h-4 w-28 rounded-lg" />
                    <Skeleton className="h-4 w-20 rounded-lg" />
                    <Skeleton className="h-6 w-16 rounded-full" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Stop loss + Notes row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="rounded-[24px] border border-white/[0.02] bg-white/[0.01] p-8 space-y-4">
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-4 rounded-sm" />
              <Skeleton className="h-4 w-20 rounded-full" />
            </div>
            <Skeleton className="h-10 w-32 rounded-xl" />
          </div>
          <div className="rounded-[24px] border border-white/[0.02] bg-white/[0.01] p-8 space-y-4">
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-4 rounded-sm" />
              <Skeleton className="h-4 w-16 rounded-full" />
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
