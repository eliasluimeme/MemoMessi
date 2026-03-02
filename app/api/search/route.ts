import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');

  if (!query || query.length < 2) {
    return NextResponse.json({ assets: [] });
  }

  try {
    // Using DexScreener for meme coins
    const response = await fetch(`https://api.dexscreener.com/latest/dex/search?q=${encodeURIComponent(query)}`);

    if (!response.ok) {
      throw new Error('Failed to fetch from DexScreener');
    }

    const data = await response.json();

    if (!data.pairs) {
      return NextResponse.json({ assets: [] });
    }

    // Format the response
    const assets = data.pairs
      .slice(0, 8) // Limit to 8 results
      .map((pair: any) => ({
        id: pair.baseToken.address, // Use address as ID
        name: pair.baseToken.name,
        symbol: pair.baseToken.symbol,
        price: pair.priceUsd ? `$${parseFloat(pair.priceUsd).toFixed(8).replace(/\.?0+$/, '')}` : 'N/A',
        network: pair.chainId,
        url: pair.url
      }));

    // Deduplicate by symbol+network to avoid cluttered results
    const uniqueAssets = Array.from(new Map(assets.map((item: any) => [`${item.symbol}-${item.network}`, item])).values());

    return NextResponse.json({ assets: uniqueAssets });
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json({ assets: [] });
  }
}
