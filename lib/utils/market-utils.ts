interface ExchangePair {
  exchange: string;
  symbolId: string;
}

export function getExchangePair(
  market: string,
  baseAsset: string,
  quoteAsset = 'USDT',
): ExchangePair {
  // Normalize inputs
  const base = baseAsset.toUpperCase();
  const quote = quoteAsset.toUpperCase();

  switch (market.toUpperCase()) {
    case 'BINANCE':
      return {
        exchange: 'BINANCE',
        symbolId: `BINANCE_SPOT_${base}_${quote}`,
      };
    case 'BYBIT':
      return {
        exchange: 'BYBIT',
        symbolId: `BYBIT_SPOT_${base}_${quote}`,
      };
    case 'KUCOIN':
      return {
        exchange: 'KUCOIN',
        symbolId: `KUCOIN_SPOT_${base}_${quote}`,
      };
    default:
      // Fallback to trying multiple exchanges
      return {
        exchange: 'BINANCE',
        symbolId: `BINANCE_SPOT_${base}_${quote}`,
      };
  }
}
