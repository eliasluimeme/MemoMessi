import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export default function UsersLoadingSkeleton() {
  return (
    <div className="container mx-auto py-12 px-6 md:px-12 max-w-[1400px]">
      <div className="space-y-12">

        {/* UsersHeader: SidebarTrigger + badge + h1 + subtitle + Add User button */}
        <div className="flex flex-col gap-6 md:flex-row md:items-end justify-between pb-8 border-b border-border/40">
          <div className="space-y-4 max-w-xl">
            <div className="flex items-center gap-4">
              <Skeleton className="h-10 w-10 rounded-xl" />
              <Skeleton className="h-6 w-36 rounded-full" />
            </div>
            <Skeleton className="h-12 md:h-14 w-64 rounded-2xl" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-full max-w-sm rounded-lg" />
            </div>
          </div>
          <Skeleton className="h-12 w-32 rounded-2xl flex-shrink-0" />
        </div>

        {/* Analytics cards */}
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
                <Skeleton className="h-10 w-16 rounded-lg" />
                <Skeleton className="h-3 w-24 rounded-full" />
              </div>
            </div>
          ))}
        </div>

        {/* Search + filter toolbar */}
        <div className="flex items-center justify-between gap-4">
          <div className="relative w-full max-w-sm">
            <Skeleton className="h-10 w-full rounded-xl" />
          </div>
          <Skeleton className="h-10 w-44 rounded-xl" />
        </div>

        {/* Users table */}
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]" />
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              {/* <TableHead>Phone</TableHead> */}
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Plan</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 8 }).map((_, i) => (
              <TableRow key={i}>
                <TableCell>
                  <Skeleton className="h-9 w-9 rounded-full" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-28 rounded-lg" />
                </TableCell>
                {/* <TableCell>
                  <Skeleton className="h-4 w-36 rounded-lg" />
                </TableCell> */}
                <TableCell>
                  <Skeleton className="h-4 w-28 rounded-lg" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-24 rounded-lg" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-6 w-20 rounded-full" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-16 rounded-lg" />
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-8 w-8 rounded-lg" />
                    <Skeleton className="h-8 w-8 rounded-lg" />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

      </div>
    </div>
  );
}
