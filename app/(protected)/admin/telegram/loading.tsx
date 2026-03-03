import { Skeleton } from '@/components/ui/skeleton';

export default function TelegramLoading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Skeleton className="h-10 w-10 rounded-[14px]" />
            <div className="space-y-2">
              <Skeleton className="h-8 w-48 rounded-xl" />
              <Skeleton className="h-4 w-96 rounded-lg" />
            </div>
          </div>
          <Skeleton className="h-10 w-32 rounded-xl" />
        </div>

        {/* Analytics Cards */}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="relative flex h-[140px] flex-col p-6 rounded-[16px] border border-border/40 bg-card/30">
              <div className="flex items-center space-x-2">
                <Skeleton className="h-8 w-8 rounded-full" />
                <Skeleton className="h-4 w-24 rounded-lg" />
              </div>
              <div className="flex flex-1 flex-col justify-between mt-2">
                <Skeleton className="h-8 w-24 rounded-lg" />
                <Skeleton className="h-3 w-32 rounded-full" />
              </div>
            </div>
          ))}
        </div>

        {/* Broadcast Form */}
        <div className="rounded-[20px] border border-border/40 bg-card/30 p-6">
          <div className="space-y-4">
            <Skeleton className="h-8 w-48 rounded-xl" />
            <Skeleton className="h-32 w-full rounded-xl" />
            <Skeleton className="h-10 w-32 rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  );
}
