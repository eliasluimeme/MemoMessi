import { Skeleton } from '@/components/ui/skeleton';

export default function ProfileLoading() {
  return (
    <div className="container mx-auto py-12 px-6 md:px-12 max-w-[1400px]">
      <div className="flex flex-col gap-12">

        {/* Header: badge "Operator Profile" + h1 "Identity" + subtitle */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-12 border-b border-border/40">
          <div className="space-y-4 max-w-xl">
            <Skeleton className="h-6 w-36 rounded-full" />
            <Skeleton className="h-16 md:h-20 w-44 rounded-2xl" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-full max-w-md rounded-lg" />
              <Skeleton className="h-4 w-3/4 max-w-sm rounded-lg" />
            </div>
          </div>
        </div>

        {/* grid gap-12 lg:grid-cols-12 */}
        <div className="grid gap-12 lg:grid-cols-12">

          {/* col-span-8: rounded-[32px] border bg-card/20 backdrop-blur-xl p-10 lg:p-12 */}
          <div className="lg:col-span-8">
            <div className="h-full rounded-[32px] border border-border/40 bg-card/20 backdrop-blur-xl p-10 lg:p-12 flex flex-col">
              {/* Section header */}
              <div className="mb-12 flex items-center justify-between">
                <Skeleton className="h-4 w-32 rounded-lg" />
              </div>
              <div className="flex-1 space-y-16">
                {/* Avatar + name + email */}
                <div className="flex items-center gap-8">
                  <Skeleton className="h-32 w-32 rounded-full flex-shrink-0" />
                  <div className="space-y-3">
                    <Skeleton className="h-10 w-48 rounded-xl" />
                    <Skeleton className="h-4 w-52 rounded-lg" />
                    <Skeleton className="h-4 w-36 rounded-lg" />
                  </div>
                </div>
                {/* Grid of detail fields */}
                <div className="grid md:grid-cols-2 gap-8 pt-12 border-t border-border/40">
                  {Array.from({ length: 2 }).map((_, i) => (
                    <div key={i} className="space-y-2">
                      <Skeleton className="h-3 w-16 rounded-full" />
                      <Skeleton className="h-5 w-40 rounded-lg" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* col-span-4: sticky controls panel */}
          <div className="lg:col-span-4">
            <div className="sticky top-24 space-y-6">
              {/* System Controls card: rounded-[32px] border bg-card/20 p-8 */}
              <div className="rounded-[32px] border border-border/40 bg-card/20 backdrop-blur-xl p-8 space-y-6">
                <Skeleton className="h-4 w-28 rounded-lg" />
                <div className="flex flex-col gap-3">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <Skeleton key={i} className="h-14 w-full rounded-2xl" />
                  ))}
                </div>
              </div>
              {/* Info note: rounded-3xl border border-primary/10 bg-primary/5 p-8 */}
              <div className="rounded-3xl border border-primary/10 bg-primary/5 p-8 space-y-3">
                <Skeleton className="h-5 w-5 rounded-sm" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full rounded-lg" />
                  <Skeleton className="h-4 w-5/6 rounded-lg" />
                  <Skeleton className="h-4 w-3/4 rounded-lg" />
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
