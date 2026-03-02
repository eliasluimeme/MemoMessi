import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export default function TelegramLoading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-4 w-96" />
            </div>
          </div>
          <Skeleton className="h-10 w-32" />
        </div>

        {/* Analytics Cards */}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="relative flex h-[140px] flex-col pt-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1.5">
                    <div className="rounded-full bg-primary/5 p-2">
                      <Skeleton className="h-4 w-4" />
                    </div>
                    <Skeleton className="h-4 w-24" />
                  </div>
                </div>
                <div className="flex flex-1 flex-col justify-between">
                  <Skeleton className="mt-2 h-8 w-24" />
                  <div className="flex flex-col gap-1 pb-2">
                    <Skeleton className="h-4 w-32" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Broadcast Form */}
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-10 w-32" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
