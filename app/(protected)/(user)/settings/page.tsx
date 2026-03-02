import { Settings2 } from 'lucide-react';

export default function Settings() {
  return (
    <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center p-6">
      <div className="w-full max-w-lg space-y-8 text-center">
        <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-3xl bg-secondary/50 border border-border/50">
          <Settings2 className="size-8 text-muted-foreground" />
        </div>
        <div className="space-y-4">
          <h1 className="text-4xl font-light tracking-tight text-foreground">Settings</h1>
          <p className="text-muted-foreground leading-relaxed font-light">
            We are currently architecting a high-performance configuration engine for your ultimate terminal setup.
          </p>
        </div>
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border/40 bg-secondary/20 text-xs font-medium text-muted-foreground tracking-widest uppercase">
          Protocol Version Alpha v1.4.2
        </div>
      </div>
    </div>
  );
}
