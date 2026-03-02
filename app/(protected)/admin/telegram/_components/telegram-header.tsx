'use client';

import { SidebarTrigger } from '@/components/ui/sidebar';
import { Send } from 'lucide-react';

export function TelegramHeader() {
  return (
    <div className="flex flex-col gap-6 md:flex-row md:items-end justify-between pb-8 border-b border-border/40">
      <div className="space-y-4 max-w-xl">
        <div className="flex items-center gap-4">
          <SidebarTrigger className="-ml-2 h-10 w-10 rounded-xl border-border/40 bg-secondary/50 hover:bg-secondary transition-colors" />
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 text-purple-500 text-[10px] uppercase tracking-widest font-semibold border border-purple-500/20">
            <Send className="h-3 w-3" />
            Distribution Network
          </div>
        </div>
        <h1 className="text-4xl md:text-5xl font-light tracking-tight text-foreground">
          Telegram
        </h1>
        <p className="text-muted-foreground/60 text-sm font-light tracking-wide leading-relaxed">
          Manage your Telegram broadcast network and cross-platform message distribution.
        </p>
      </div>
    </div>
  );
}
