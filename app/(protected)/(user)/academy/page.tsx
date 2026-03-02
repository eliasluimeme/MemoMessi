import { BookOpen } from 'lucide-react';

export default function Academy() {
  return (
    <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center p-6">
      <div className="w-full max-w-lg space-y-8 text-center">
        <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-3xl bg-secondary/50 border border-border/50">
          <BookOpen className="size-8 text-muted-foreground" />
        </div>
        <div className="space-y-4">
          <h1 className="text-4xl font-light tracking-tight text-foreground">Academy</h1>
          <p className="text-muted-foreground leading-relaxed font-light">
            Our educational infrastructure is currently being constructed. Return shortly for institutional-grade knowledge modules.
          </p>
        </div>
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border/40 bg-secondary/20 text-xs font-medium text-muted-foreground tracking-widest uppercase">
          Status: In Development
        </div>
      </div>
    </div>
  );
}
