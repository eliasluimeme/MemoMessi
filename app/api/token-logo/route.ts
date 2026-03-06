import { NextRequest, NextResponse } from 'next/server';

const TRUST_WALLET_CHAIN: Record<string, string> = {
  ethereum: 'ethereum',
  eth:      'ethereum',
  bsc:      'smartchain',
  bnb:      'smartchain',
  binance:  'smartchain',
  polygon:  'polygon',
  matic:    'polygon',
  arbitrum: 'arbitrum',
  arb:      'arbitrum',
  base:     'base',
  avalanche:'avalanchec',
  avax:     'avalanchec',
  optimism: 'optimism',
  op:       'optimism',
};

/**
 * Try a list of candidate URLs in order, return the first successful Response.
 */
async function fetchFirst(urls: string[]): Promise<Response | null> {
  for (const url of urls) {
    try {
      const res = await fetch(url, {
        headers: { 'User-Agent': 'Mozilla/5.0' },
        next: { revalidate: 86400 }, // cache 24 h
      });
      if (res.ok && res.body) return res;
    } catch {
      // try next
    }
  }
  return null;
}

async function buildCandidateUrls(
  symbol: string,
  network: string,
  address: string,
): Promise<string[]> {
  const sym = symbol.toLowerCase();
  const net = network.toLowerCase().trim();
  const urls: string[] = [];

  if (address) {
    if (net === 'solana' || net === 'sol') {
      // 1. DexScreener API – works for virtually every Solana token
      try {
        const dsRes = await fetch(
          `https://api.dexscreener.com/tokens/v1/solana/${address}`,
          { next: { revalidate: 3600 } },
        );
        if (dsRes.ok) {
          const data = await dsRes.json();
          // data is an array of token pair objects
          const imageUrl =
            data?.[0]?.info?.imageUrl ??
            data?.[0]?.baseToken?.info?.imageUrl ??
            null;
          if (imageUrl) urls.push(imageUrl);
        }
      } catch { /* ignore */ }

      // 2. Solana token list (official, many pump.fun tokens listed)
      urls.push(
        `https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/${address}/logo.png`,
      );
      // 3. DexScreener static CDN
      urls.push(`https://dd.dexscreener.com/ds-data/tokens/solana/${address}.png`);
    } else {
      const chain = TRUST_WALLET_CHAIN[net];
      if (chain) {
        // EVM – checksum address required for Trust Wallet path
        const checksumAddr = address; // already stored checksummed in DB
        urls.push(
          `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/${chain}/assets/${checksumAddr}/logo.png`,
        );
      }
    }
  }

  // Symbol-based fallbacks (good for BTC, ETH, BNB, SOL, etc.)
  urls.push(`https://assets.coincap.io/assets/icons/${sym}@2x.png`);
  urls.push(
    `https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a63530be6e374711a8554f31b17e4cb92c25fa/128/color/${sym}.png`,
  );

  return urls;
}

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const symbol  = searchParams.get('symbol')  ?? '';
  const network = searchParams.get('network') ?? '';
  const address = searchParams.get('address') ?? '';

  if (!symbol) {
    return new NextResponse(null, { status: 400 });
  }

  const candidates = await buildCandidateUrls(symbol, network, address);
  const upstream   = await fetchFirst(candidates);

  if (!upstream) {
    return new NextResponse(null, { status: 404 });
  }

  const contentType = upstream.headers.get('content-type') ?? 'image/png';
  const body = await upstream.arrayBuffer();

  return new NextResponse(body, {
    status: 200,
    headers: {
      'Content-Type': contentType,
      'Cache-Control': 'public, max-age=86400, stale-while-revalidate=604800',
    },
  });
}
