'use client';

import Link from 'next/link';
import { Crown, Lock, Zap } from 'lucide-react';

export function FreeTierBanner() {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between px-5 py-2 rounded-2xl border dark:border-amber-500/20 border-amber-500/30 dark:bg-amber-500/[0.04] bg-amber-500/[0.03]">
      <div className="flex items-center gap-3">
        <div className="h-9 w-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center flex-shrink-0">
          <Zap className="h-4 w-4 text-amber-400" />
        </div>
        <div>
          <p className="text-sm font-semibold text-foreground">
            You&apos;re on the{' '}
            <span className="text-amber-400">Free Tier</span>
          </p>
          <p className="text-[11px] text-muted-foreground/60 mt-0.5">
            <Lock className="inline h-3 w-3 mb-0.5" /> Upgrade to unlock VIP signals.
          </p>
        </div>
      </div>
      <Link
        href="/upgrade"
        className="inline-flex items-center gap-2 h-9 px-5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold hover:bg-amber-500/20 transition-colors flex-shrink-0"
      >
        <Crown className="h-3.5 w-3.5" />
        Upgrade to VIP
      </Link>
    </div>
  );
}
