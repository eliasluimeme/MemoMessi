import { NextResponse } from 'next/server';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ token: string }> },
) {
  const { token } = await params;
  const upperToken = token.toUpperCase();
  const symbol = `${upperToken}USDT`;

  try {
    // 1. Try Binance first
    const binanceRes = await fetch(
      `https://api.binance.com/api/v3/ticker/price?symbol=${symbol}`,
      { next: { revalidate: 0 } },
    );

    if (binanceRes.ok) {
      const data = await binanceRes.json();
      return NextResponse.json(data);
    }

    // 2. Fallback: DexScreener (handles non-Binance / Solana tokens)
    const dexRes = await fetch(
      `https://api.dexscreener.com/latest/dex/search?q=${upperToken}`,
      { next: { revalidate: 0 } },
    );

    if (dexRes.ok) {
      const dexData = await dexRes.json();
      const pairs: any[] = dexData?.pairs ?? [];

      // Find the pair whose baseToken symbol matches (case-insensitive), pick highest liquidity
      const matched = pairs
        .filter(
          (p: any) =>
            p?.baseToken?.symbol?.toUpperCase() === upperToken &&
            p?.priceUsd,
        )
        .sort((a: any, b: any) => (b?.liquidity?.usd ?? 0) - (a?.liquidity?.usd ?? 0));

      if (matched.length > 0) {
        return NextResponse.json({
          symbol: upperToken,
          price: matched[0].priceUsd,
        });
      }
    }

    // 3. Nothing worked
    return NextResponse.json(
      { error: `Price not found for ${upperToken}` },
      { status: 404 },
    );
  } catch (error) {
    console.error('[PRICE_FETCH]', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
