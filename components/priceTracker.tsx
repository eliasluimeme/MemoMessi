'use client';

import React from 'react';

import { useCoinAPI } from '@/hooks/useCoinAPI';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface PriceTrackerProps {
  symbolId: string;
}

export function PriceTracker({ symbolId }: PriceTrackerProps) {
  const [baseAsset, quoteAsset] = symbolId.split('/');
  const { price, lastUpdate, connectionStatus } = useCoinAPI(
    baseAsset,
    'SPOT',
    quoteAsset,
    process.env.NEXT_PUBLIC_COINAPI_KEY || '',
  );

  return (
    <Card className="mx-auto w-full max-w-md">
      <CardHeader>
        <CardTitle>{symbolId.split('_').slice(-2).join('/')} Price</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {/* Price Display */}
          <div className="flex items-center justify-between">
            <span className="font-medium">Current Price:</span>
            <span className="text-2xl font-bold">
              {price
                ? `$${price.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}`
                : 'Connecting...'}
            </span>
          </div>

          {/* Last Update */}
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>Last Update:</span>
            <span>{lastUpdate ? 'Now' : 'Waiting for data...'}</span>
          </div>

          {/* Connection Status */}
          <div className="flex items-center justify-between text-sm">
            <span>Connection Status:</span>
            <span
              className={`font-medium ${
                connectionStatus === 'connected'
                  ? 'text-green-600'
                  : connectionStatus === 'connecting'
                    ? 'text-yellow-600'
                    : 'text-red-600'
              }`}
            >
              {connectionStatus}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
