'use client';

import { useEffect, useState } from 'react';

import { Skeleton } from '@/components/ui/skeleton';

import { cn } from '@/lib/utils';

interface CurrentPriceProps {
  token: string;
  className?: string;
}

export default function CurrentPrice({ token, className }: CurrentPriceProps) {
  const [price, setPrice] = useState<string | null>(null);

  useEffect(() => {
    const fetchPrice = async () => {
      try {
        const response = await fetch(
          `/api/price/${token.toUpperCase()}`,
        );
        const data = await response.json();
        setPrice(parseFloat(data.price).toFixed(4));
      } catch (error) {
        console.error('Error fetching price:', error);
        setPrice('N/A');
      }
    };

    fetchPrice();
    const interval = setInterval(fetchPrice, 10000); // Update price every 10 seconds

    return () => clearInterval(interval);
  }, [token]);

  return price ? (
    <span className={cn('text-xl', className)}>${price}</span>
  ) : (
    <Skeleton className="h-6 w-24" />
  );
}
