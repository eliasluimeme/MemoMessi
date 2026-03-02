'use client';

import { AlertCircle, RefreshCw } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';

export default function Error({
  error: _error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="container mx-auto flex min-h-[70vh] items-center justify-center">
      <Card className="w-full max-w-md border-destructive/50 shadow-lg">
        <CardHeader>
          <div className="flex items-center gap-2 text-destructive">
            <AlertCircle className="h-5 w-5" />
            <h3 className="text-lg font-semibold">Oops! Something went wrong</h3>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            We encountered an error while loading your signals. Please try again.
          </p>
        </CardContent>
        <CardFooter>
          <Button variant="outline" onClick={reset} className="gap-2 hover:bg-destructive/10">
            <RefreshCw className="h-4 w-4" />
            Try again
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
