'use client';

import Link from 'next/link';

import { Favorite, Signal, Target } from '@prisma/client';
import { formatDistanceToNow } from 'date-fns';

import LivePrice from '@/components/live-price';
import { cn } from '@/lib/utils';
// triggered refresh

import { TokenImage } from '../token-image';
import { FavoriteButton } from './favorite-button';

export type SignalWithTargets = Signal & {
  targets: Target[];
  favorites: Favorite[];
  isFavorite?: boolean;
};

interface SignalCardProps {
  signal: SignalWithTargets;
}

const Astatus = {
  WITHIN_ENTRY_ZONE: 'Entry Zone',
  TP1: 'TP1',
  TP2: 'TP2',
  TP3: 'TP3',
  TP4: 'TP4',
  TP5: 'TP5',
  TP6: 'TP6',
  TP7: 'TP7',
  TP8: 'TP8',
  TP9: 'TP9',
  TP10: 'TP10',
  CLOSED: 'Closed',
};

export default function SignalCard({ signal }: SignalCardProps) {
  return (
    <Link href={`/signals/${signal.id}`} className="block group">
      <div className="relative overflow-hidden rounded-[32px] border border-white/[0.02] bg-white/[0.01] h-full p-10 transition-all duration-1000 ease-[cubic-bezier(0.23,1,0.32,1)] hover:border-white/[0.05] hover:bg-white/[0.02] hover:-translate-y-1">
        <div className="space-y-12">
          {/* Superior Token Identity */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="relative h-16 w-16 flex-shrink-0">
                <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                <TokenImage token={signal.pair.split('/')[0]} className="h-full w-full relative z-10 rounded-[22px] grayscale group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-110" />
              </div>
              <div className="space-y-1">
                <h4 className="text-4xl font-black tracking-[-0.05em] text-foreground leading-none group-hover:text-primary transition-colors duration-700">
                  {signal.pair.split('/')[0]}
                  <span className="text-muted-foreground/10 text-xl ml-1 tracking-tighter">/{signal.pair.split('/')[1]}</span>
                </h4>
                <p className="text-micro text-muted-foreground/20 group-hover:text-muted-foreground/40 transition-colors">
                  {signal.market} • {formatDistanceToNow(new Date(signal.createdAt))} ago
                </p>
              </div>
            </div>
            <div className="flex flex-col items-end gap-2">
              <div className={cn(
                "h-1.5 w-1.5 rounded-full",
                signal.status === 'WITHIN_ENTRY_ZONE' ? "bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.8)]" : "bg-white/[0.05]"
              )} />
            </div>
          </div>

          {/* Core Analytics Snapshot */}
          <div className="space-y-6">
            <div className="flex items-end justify-between">
              <div className="space-y-2">
                <span className="text-premium-label">Protocol Entry</span>
                <p className="text-3xl font-black font-mono tracking-tighter text-foreground/90 group-hover:text-foreground transition-all duration-700">
                  ${signal.entryZone.toString().split(',')[0]}
                </p>
              </div>
              <div className="space-y-2 text-right">
                <span className="text-premium-label">Market Live</span>
                <LivePrice token={signal.pair.split('/')[0]} className="text-3xl font-black font-mono tracking-tighter text-primary justify-end drop-shadow-[0_0_20px_rgba(var(--primary),0.2)]" />
              </div>
            </div>

            <div className="flex gap-1 h-[2px] w-full bg-white/[0.02] rounded-full overflow-hidden">
              {signal.targets.map((target, idx) => (
                <div
                  key={idx}
                  className={cn(
                    "h-full flex-1 transition-all duration-1000",
                    target.hit ? "bg-primary shadow-[0_0_10px_rgba(var(--primary),0.5)]" : "bg-white/[0.02]"
                  )}
                  style={{ transitionDelay: `${idx * 100}ms` }}
                />
              ))}
            </div>
          </div>

          {/* Operational Status */}
          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-4">
              <span className="text-micro text-muted-foreground/20 uppercase tracking-[0.4em]">
                {signal.targets.filter(t => t.hit).length} of {signal.targets.length} Target Sync
              </span>
            </div>
            <div onClick={(e) => e.preventDefault()} className="opacity-10 group-hover:opacity-100 transition-all duration-700 hover:scale-110">
              <FavoriteButton signalId={signal.id} initialFavorited={signal.isFavorite || false} />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
