'use client';

import { useEffect, useState } from 'react';

import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

interface CurrentPriceProps {
  token: string;
  contractAddress?: string | null;
  network?: string | null;
  className?: string;
}

/** Keep 4 significant digits regardless of magnitude */
function formatPrice(raw: string | number): string {
  const n = typeof raw === 'string' ? parseFloat(raw) : raw;
  if (isNaN(n)) return 'N/A';
  if (n === 0) return '0.00';
  if (n >= 1000) return n.toLocaleString('en-US', { maximumFractionDigits: 2 });
  if (n >= 1) return n.toFixed(4);
  return parseFloat(n.toPrecision(4)).toString();
}

const SOLANA_NETWORKS = new Set(['solana', 'sol']);

export default function CurrentPrice({ token, contractAddress, network, className }: CurrentPriceProps) {
  const isSolana = SOLANA_NETWORKS.has((network ?? '').toLowerCase());

  const [display, setDisplay] = useState<string | null>(null);
  const [prefix, setPrefix]   = useState<string>('$');
  const [prev, setPrev]       = useState<number | null>(null);
  const [dir, setDir]         = useState<'up' | 'down' | null>(null);

  useEffect(() => {
    const fetchPrice = async () => {
      try {
        const ca  = contractAddress ? `?ca=${encodeURIComponent(contractAddress)}` : '';
        const res  = await fetch(`/api/price/${token.toUpperCase()}${ca}`);
        const data = await res.json();

        // For Solana tokens prefer the native SOL price when available
        const rawValue = isSolana && data.priceNative ? data.priceNative : data.price;
        const symbol   = isSolana && data.nativeSymbol ? '◎' : '$';

        const next = parseFloat(rawValue);
        if (!isNaN(next)) {
          setDir(prev === null ? null : next > prev ? 'up' : next < prev ? 'down' : null);
          setPrev(next);
          setPrefix(symbol);
          setDisplay(formatPrice(next));
        }
      } catch {
        setDisplay('N/A');
      }
    };

    fetchPrice();
    const interval = setInterval(fetchPrice, 10_000);
    return () => clearInterval(interval);
  }, [token, contractAddress, isSolana]);

  if (!display) return <Skeleton className="h-5 w-20" />;

  return (
    <span
      className={cn(
        'tabular-nums font-mono font-bold transition-colors duration-700',
        dir === 'up'   && 'text-emerald-400',
        dir === 'down' && 'text-red-400',
        !dir           && 'text-foreground/60',
        className,
      )}
    >
      {prefix}{display}
    </span>
  );
}
