import { Skeleton } from '@/components/ui/skeleton';

export default function FavoritesLoading() {
  return (
    <div className="container mx-auto py-12 px-6 md:px-12 max-w-[1400px]">
      <div className="flex flex-col gap-12">

        {/* Header: badge + h1 "Favorites" + star + subtitle */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-12 border-b border-border/40">
          <div className="space-y-4 max-w-xl">
            <Skeleton className="h-6 w-48 rounded-full" />
            <div className="flex items-center gap-4">
              <Skeleton className="h-16 md:h-20 w-52 rounded-2xl" />
              <Skeleton className="h-8 w-8 rounded-lg" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-full max-w-md rounded-lg" />
              <Skeleton className="h-4 w-3/4 max-w-sm rounded-lg" />
            </div>
          </div>
        </div>

        {/* Same signal-card grid as signals page */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="relative overflow-hidden rounded-[32px] border border-white/[0.02] bg-white/[0.01] h-full p-10"
            >
              <div className="space-y-12">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-6">
                    <Skeleton className="h-16 w-16 rounded-[22px]" />
                    <div className="space-y-1.5">
                      <Skeleton className="h-9 w-24 rounded-lg" />
                      <Skeleton className="h-3 w-32 rounded-full" />
                    </div>
                  </div>
                  <Skeleton className="h-2 w-2 rounded-full" />
                </div>
                <div className="space-y-6">
                  <div className="flex items-end justify-between">
                    <div className="space-y-2">
                      <Skeleton className="h-3 w-24 rounded-full" />
                      <Skeleton className="h-8 w-24 rounded-lg" />
                    </div>
                    <div className="space-y-2 flex flex-col items-end">
                      <Skeleton className="h-3 w-20 rounded-full" />
                      <Skeleton className="h-8 w-24 rounded-lg" />
                    </div>
                  </div>
                  <Skeleton className="h-[2px] w-full rounded-full" />
                </div>
                <div className="flex items-center justify-between pt-2">
                  <Skeleton className="h-3 w-36 rounded-full" />
                  <Skeleton className="h-6 w-6 rounded-full" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
