'use client';

import Link from 'next/link';

import { ArrowLeft, Home } from 'lucide-react';

import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-8 px-4 text-center">
      <div className="space-y-2">
        <h1 className="text-7xl font-extrabold tracking-tight text-primary">404</h1>
        <h2 className="text-3xl font-semibold tracking-tight">Page Not Found</h2>
      </div>

      <div className="max-w-md space-y-3">
        <p className="text-xl text-muted-foreground">
          Sorry, the page you are looking for could not be found.
        </p>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:gap-6">
        <Button
          onClick={() => window.history.back()}
          className="inline-flex items-center justify-center gap-2 rounded-md bg-secondary px-6 py-2.5 text-sm font-medium text-secondary-foreground transition-colors hover:bg-secondary/80"
        >
          <ArrowLeft className="h-4 w-4" />
          Go Back
        </Button>
        <Button asChild>
          <Link href="/">
            <Home className="h-4 w-4" />
            Return Home
          </Link>
        </Button>
      </div>
    </div>
  );
}
