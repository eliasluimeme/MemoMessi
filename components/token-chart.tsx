'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import Link from 'next/link';

import { formatDistanceToNow } from 'date-fns';
import { Globe, Maximize2, Minimize2 } from 'lucide-react';

import CurrentPrice from '@/components/live-price';
import { FavoriteButton } from '@/components/signal/favorite-button';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

import { cn } from '@/lib/utils';
import { isMemeNetwork, getExplorerUrl, DEXSCREENER_NETWORK } from '@/lib/utils/chain-utils';

import { TokenImage } from './token-image';

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

declare global {
  interface Window {
    TradingView: {
      widget: new (options: TradingViewWidgetOptions) => void;
    };
  }
}

interface TradingViewWidgetOptions {
  autosize: boolean;
  symbol: string;
  interval: string;
  timezone: string;
  theme: string;
  style: string;
  locale: string;
  toolbar_bg: string;
  enable_publishing: boolean;
  allow_symbol_change: boolean;
  container_id: string;
}

interface TradingViewChartProps {
  token: string;
  createdAt: Date;
  market: string;
  status: string;
  pair: string;
  signalId: string;
  initialFavorited: boolean;
  network?: string;
  contractAddress?: string;
}

export default function TradingViewChart({
  token,
  createdAt,
  market,
  status,
  pair,
  signalId,
  initialFavorited,
  network = 'solana',
  contractAddress,
}: TradingViewChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const isMeme = isMemeNetwork(network);
  const isSolana = network === 'solana' || network === 'sol';
  const dexNetwork = DEXSCREENER_NETWORK[network] ?? network;
  const dexScreenerUrl =
    isMeme && contractAddress
      ? `https://dexscreener.com/${dexNetwork}/${contractAddress}?embed=1&theme=dark&trades=0&info=0${isSolana ? '&quoteToken=sol' : ''}`
      : null;

  const loadTradingViewScript = useCallback(() => {
    if (dexScreenerUrl) return; // Don't load TV if using DexScreener

    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/tv.js';
    script.async = true;
    script.onload = () => {
      if (containerRef.current && window.TradingView) {
        new window.TradingView.widget({
          autosize: true,
          symbol: network === 'binance'
            ? `BINANCE:${token.toUpperCase()}USDT`
            : `${token.toUpperCase()}USDT`,
          interval: 'D',
          timezone: 'Etc/UTC',
          theme: 'dark',
          style: '1',
          locale: 'en',
          toolbar_bg: '#f1f3f6',
          enable_publishing: false,
          allow_symbol_change: true,
          container_id: `tradingview_${token}`,
        });
      }
    };
    document.head.appendChild(script);

    return () => {
      if (script.parentNode) script.parentNode.removeChild(script);
    };
  }, [token, dexScreenerUrl, network]);

  useEffect(() => {
    const cleanup = loadTradingViewScript();
    return cleanup;
  }, [loadTradingViewScript]);

  const handleFullscreen = () => setIsFullscreen((prev) => !prev);

  return (
    <div className={isFullscreen ? 'fixed inset-0 z-50 flex flex-col bg-background' : ''}>
      <header
        className={cn('flex flex-col gap-4', isFullscreen ? 'h-auto border-b p-2 md:p-4' : 'mb-4', {
          'md:flex-row md:items-center md:justify-between': true,
        })}
      >
        <div className="flex flex-col gap-4 md:flex-row md:items-center">
          <div>
            <div className="flex flex-wrap items-center justify-between gap-3 md:justify-start">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2">
                  <TokenImage token={token} variant="lg" />
                  <h3 className="text-2xl font-bold tracking-tight">{pair}</h3>
                </div>
                <span className="text-muted-foreground">•</span>
                <CurrentPrice token={token} contractAddress={contractAddress} network={network} />
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="icon" asChild title="View on Explorer">
                  <Link
                    href={getExplorerUrl(network, contractAddress, pair)}
                    target="_blank"
                  >
                    <Globe className="h-4 w-4" />
                  </Link>
                </Button>
                <FavoriteButton
                  variant="outline"
                  signalId={signalId}
                  initialFavorited={initialFavorited}
                />
                <Button
                  className="inline-flex md:hidden"
                  variant="outline"
                  onClick={handleFullscreen}
                  size="icon"
                >
                  {isFullscreen ? (
                    <Minimize2 className="h-4 w-4" />
                  ) : (
                    <Maximize2 className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            {!isFullscreen && (
              <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted-foreground uppercase font-bold tracking-wider">
                <Badge variant="outline" className="text-[10px]">{network || 'BINANCE'}</Badge>
                <span className="hidden sm:inline">•</span>
                <span>{market}</span>
                <span className="hidden sm:inline">•</span>
                <span>
                  {new Date(createdAt).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </span>
                <span className="hidden sm:inline">•</span>
                <span>{formatDistanceToNow(new Date(createdAt))} ago</span>
              </div>
            )}
          </div>
        </div>

        <div
          className={cn(
            'hidden flex-col items-end justify-between gap-2 md:flex',
            isFullscreen ? 'flex-row' : 'flex-col',
          )}
        >
          {/* <Badge
            variant={
              status === 'WITHIN_ENTRY_ZONE'
                ? 'success-outline'
                : status === 'CLOSED'
                  ? 'destructive-outline'
                  : 'outline'
            }
            className="h-fit"
            size={isFullscreen ? 'lg' : 'md'}
          >
            {Astatus[status as keyof typeof Astatus]}
          </Badge> */}
          <Button variant="outline" onClick={handleFullscreen} size="icon">
            {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </Button>
        </div>
      </header>

      {dexScreenerUrl ? (
        <div className={isFullscreen ? 'flex-1' : 'h-[400px] sm:h-[500px] md:h-[600px] w-full rounded-xl overflow-hidden border'}>
          <iframe
            src={dexScreenerUrl}
            className="w-full h-full border-0"
            title="DexScreener Chart"
          />
        </div>
      ) : (
        <div
          id={`tradingview_${token}`}
          ref={containerRef}
          className={`w-full bg-muted ${isFullscreen ? 'flex-1' : 'h-[400px] sm:h-[500px] md:h-[600px]'
            }`}
        />
      )}
    </div>
  );
}
