'use client';

import { useState } from 'react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

import { cn } from '@/lib/utils';

interface TokenImageProps {
  token: string;
  network?: string | null;
  contractAddress?: string | null;
  variant?: 'sm' | 'md' | 'lg';
  className?: string;
}

/**
 * Build a prioritised URL list.
 *
 * When a contractAddress is present the first URL is the server-side proxy
 * (app/api/token-logo) which resolves the image without any browser-side
 * CORS / ad-blocker issues and caches the result for 24 h.
 *
 * Symbol-based CDNs are used as fallbacks for well-known tickers (BTC, ETH…).
 */
function buildUrls(
  token: string,
  network?: string | null,
  contractAddress?: string | null,
): string[] {
  const sym = token.toLowerCase();
  const urls: string[] = [];

  if (contractAddress) {
    const params = new URLSearchParams({ symbol: sym });
    if (network)          params.set('network', network);
    if (contractAddress)  params.set('address', contractAddress);
    // Server-side proxy – avoids ad-blockers, CORS, and github rate limits
    urls.push(`/api/token-logo?${params.toString()}`);
  }

  // Symbol-based CDNs work well for major coins even without an address
  urls.push(`https://assets.coincap.io/assets/icons/${sym}@2x.png`);
  urls.push(
    `https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a63530be6e374711a8554f31b17e4cb92c25fa/128/color/${sym}.png`,
  );

  return urls;
}

export function TokenImage({ token, network, contractAddress, className, variant = 'md' }: TokenImageProps) {
  const urls = buildUrls(token, network, contractAddress);
  const [idx, setIdx] = useState(0);

  const handleError = () => {
    // Advance to next URL; once exhausted the AvatarFallback takes over
    setIdx(prev => prev + 1);
  };

  return (
    <Avatar
      className={cn(
        {
          'h-6 w-6':   variant === 'sm',
          'h-8 w-8':   variant === 'md',
          'h-12 w-12': variant === 'lg',
        },
        className,
      )}
    >
      {idx < urls.length && (
        <AvatarImage
          key={urls[idx]}
          src={urls[idx]}
          alt={`${token} icon`}
          onError={handleError}
        />
      )}
      <AvatarFallback className="text-[10px] font-bold">
        {token.slice(0, 2).toUpperCase()}
      </AvatarFallback>
    </Avatar>
  );
}
