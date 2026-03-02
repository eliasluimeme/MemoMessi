import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export default function SignalsLoadingSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-2xl font-semibold">Signal Management</h2>
            <p className="text-sm text-muted-foreground">
              View and manage all signals and their targets.
            </p>
          </div>
          <Button disabled>Add Signal</Button>
        </div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <div className="relative flex h-[140px] flex-col p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1.5">
                    <div className="rounded-full bg-primary/5 p-2">
                      <Skeleton className="h-4 w-4" />
                    </div>
                    <Skeleton className="h-4 w-24" />
                  </div>
                </div>
                <div className="flex flex-1 flex-col justify-between">
                  <Skeleton className="mt-2 h-10 w-16" />
                  <div className="flex flex-col gap-1 pb-2">
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-4 w-16" />
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="flex items-center justify-between gap-4">
          <div className="relative w-full max-w-sm">
            <Skeleton className="h-10 w-full" />
          </div>
          <Skeleton className="h-10 w-32" />
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Pair</TableHead>
              <TableHead>Entry Zone</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Gains</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 5 }).map((_, i) => (
              <TableRow key={i}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-8 w-8 rounded-full" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-20" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-6 w-24 rounded-full" />
                </TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <Skeleton className="h-6 w-12 rounded-full" />
                    <Skeleton className="h-6 w-12 rounded-full" />
                    <Skeleton className="h-6 w-12 rounded-full" />
                  </div>
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-24" />
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-8 w-8" />
                    <Skeleton className="h-8 w-8" />
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
