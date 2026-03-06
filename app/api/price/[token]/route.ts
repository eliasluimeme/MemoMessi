import { NextRequest, NextResponse } from 'next/server';

/** Native currency symbol per DexScreener chain ID */
const NATIVE_SYMBOL: Record<string, string> = {
  solana: 'SOL',
  ethereum: 'ETH',
  bsc: 'BNB',
  base: 'ETH',
  arbitrum: 'ETH',
  polygon: 'MATIC',
  avalanche: 'AVAX',
};

/** Pick the highest-liquidity pair from a DexScreener pairs array */
function bestPair(pairs: any[]): any | null {
  if (!pairs?.length) return null;
  return pairs
    .filter((p: any) => p?.priceUsd)
    .sort((a: any, b: any) => (b?.liquidity?.usd ?? 0) - (a?.liquidity?.usd ?? 0))[0] ?? null;
}

/** Build a price response from a DexScreener pair object */
function pairToPrice(symbol: string, pair: any) {
  const nativeSymbol = NATIVE_SYMBOL[pair.chainId] ?? null;
  return {
    symbol,
    price: pair.priceUsd,
    ...(nativeSymbol && pair.priceNative
      ? { priceNative: pair.priceNative, nativeSymbol }
      : {}),
  };
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> },
) {
  const { token } = await params;
  const upperToken = token.toUpperCase();
  const { searchParams } = request.nextUrl;
  const contractAddress = searchParams.get('ca');

  try {
    // 1. If a contract address is provided → fetch DexScreener token endpoint directly.
    //    This is the most accurate source and returns priceNative (SOL/ETH/etc).
    if (contractAddress) {
      const dexRes = await fetch(
        `https://api.dexscreener.com/latest/dex/tokens/${contractAddress}`,
        { next: { revalidate: 0 } },
      );

      if (dexRes.ok) {
        const dexData = await dexRes.json();
        const pair = bestPair(dexData?.pairs ?? []);
        if (pair) {
          return NextResponse.json(pairToPrice(upperToken, pair));
        }
      }
    }

    // 2. Try Binance (CEX tokens like BTC, ETH, SOL) — short timeout so failures don't block
    const symbol = `${upperToken}USDT`;
    try {
      const binanceController = new AbortController();
      const binanceTimeout = setTimeout(() => binanceController.abort(), 3000);
      const binanceRes = await fetch(
        `https://api.binance.com/api/v3/ticker/price?symbol=${symbol}`,
        { next: { revalidate: 0 }, signal: binanceController.signal },
      );
      clearTimeout(binanceTimeout);

      if (binanceRes.ok) {
        const data = await binanceRes.json();
        if (data?.price) return NextResponse.json(data);
      }
    } catch {
      // Binance unreachable or timed out — fall through to DexScreener
    }

    // 3. Fallback: DexScreener symbol search (least accurate — only when no CA)
    const dexSearchController = new AbortController();
    const dexSearchTimeout = setTimeout(() => dexSearchController.abort(), 8000);
    const dexRes = await fetch(
      `https://api.dexscreener.com/latest/dex/search?q=${upperToken}`,
      { next: { revalidate: 0 }, signal: dexSearchController.signal },
    );
    clearTimeout(dexSearchTimeout);

    if (dexRes.ok) {
      const dexData = await dexRes.json();
      const pairs: any[] = dexData?.pairs ?? [];

      const matched = pairs.filter(
        (p: any) => p?.baseToken?.symbol?.toUpperCase() === upperToken && p?.priceUsd,
      );

      const pair = bestPair(matched);
      if (pair) {
        return NextResponse.json(pairToPrice(upperToken, pair));
      }
    }

    return NextResponse.json(
      { error: `Price not found for ${upperToken}` },
      { status: 404 },
    );
  } catch (error) {
    console.error('[PRICE_FETCH]', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
