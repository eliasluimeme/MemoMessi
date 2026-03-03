import { Skeleton } from '@/components/ui/skeleton';

export default function AdminDashboardLoading() {
  return (
    <div className="container mx-auto py-12 px-6 md:px-12 max-w-[1400px]">
      <div className="space-y-12">

        {/* Header: SidebarTrigger + h1 "Admin Console" + subtitle + System Load badge */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-12 border-b border-border/40">
          <div className="space-y-4 max-w-xl">
            <div className="flex items-center gap-4">
              <Skeleton className="h-10 w-10 rounded-xl" />
            </div>
            <Skeleton className="h-14 md:h-20 w-72 rounded-2xl" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-full max-w-md rounded-lg" />
            </div>
          </div>
          {/* System Load badge */}
          <Skeleton className="h-16 w-44 rounded-2xl" />
        </div>

        {/* Analytics cards — grid grid-cols-2 lg:grid-cols-4 gap-4 */}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="relative flex h-[140px] flex-col p-6 rounded-[16px] border border-border/40 bg-card/30"
            >
              <div className="flex items-center space-x-2">
                <Skeleton className="h-8 w-8 rounded-full" />
                <Skeleton className="h-4 w-24 rounded-lg" />
              </div>
              <div className="flex flex-1 flex-col justify-between mt-2">
                <Skeleton className="h-10 w-20 rounded-lg" />
                <Skeleton className="h-3 w-28 rounded-full" />
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
