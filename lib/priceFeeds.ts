/**
 * Price feed utilities for the TP watcher.
 *
 * Strategy:
 *   - Binance pairs  → single bulk ticker call (all ~2 000 symbols in one request)
 *   - Solana tokens  → DexScreener batch endpoint (free, no API key, max 30/call)
 */

// ──────────────────────────────────────────────────────────────────────────────
// Binance
// ──────────────────────────────────────────────────────────────────────────────

/**
 * Fetch the current price for a set of Binance trading pairs.
 *
 * Uses the `?symbols=[...]` query param so we send ONE request instead of
 * N individual requests – stays well within Binance's free rate limits.
 *
 * @param symbols e.g. ["BTCUSDT", "SOLUSDT"]  (without the slash)
 * @returns Map<symbol, price>
 */
export async function getBinancePrices(
  symbols: string[],
): Promise<Map<string, number>> {
  const result = new Map<string, number>();
  if (!symbols.length) return result;

  try {
    // Encode as JSON array – Binance requires this exact format
    const param = encodeURIComponent(JSON.stringify(symbols.map((s) => s.toUpperCase())));
    const res = await fetch(
      `https://api.binance.com/api/v3/ticker/price?symbols=${param}`,
      { next: { revalidate: 0 } },
    );
    if (!res.ok) return result;

    const data: { symbol: string; price: string }[] = await res.json();
    for (const item of data) {
      const price = parseFloat(item.price);
      if (isFinite(price)) result.set(item.symbol.toUpperCase(), price);
    }
  } catch (err) {
    console.error('[priceFeeds] Binance error:', err);
  }

  return result;
}

// ──────────────────────────────────────────────────────────────────────────────
// DexScreener  (Solana / EVM memecoins by contract address)
// ──────────────────────────────────────────────────────────────────────────────

const DEXSCREENER_BATCH = 30; // API limit per call

interface DexScreenerPair {
  baseToken: { address: string };
  priceUsd?: string;
}

/**
 * Fetch USD prices for Solana (or other EVM) tokens by contract address.
 *
 * DexScreener is free, requires no API key, and has the widest memecoin
 * coverage. It returns multiple pairs per token – we take the highest-volume
 * USD price to avoid stale low-liquidity quotes.
 *
 * @param addresses contract addresses (checksummed or lowercase – DexScreener
 *   handles both)
 * @returns Map<contractAddress (lowercase), USD price>
 */
export async function getDexScreenerPrices(
  addresses: string[],
): Promise<Map<string, number>> {
  const result = new Map<string, number>();
  if (!addresses.length) return result;

  // De-duplicate & lowercase
  const unique = [...new Set(addresses.map((a) => a.toLowerCase()))];

  // Chunk into batches of 30
  const chunks: string[][] = [];
  for (let i = 0; i < unique.length; i += DEXSCREENER_BATCH) {
    chunks.push(unique.slice(i, i + DEXSCREENER_BATCH));
  }

  await Promise.all(
    chunks.map(async (chunk) => {
      try {
        const res = await fetch(
          `https://api.dexscreener.com/latest/dex/tokens/${chunk.join(',')}`,
          { next: { revalidate: 0 } },
        );
        if (!res.ok) return;

        const data: { pairs?: DexScreenerPair[] | null } = await res.json();
        if (!data.pairs) return;

        // Group pairs by base token; pick the one with the highest price index
        // (DexScreener returns multiple DEX pairs per token)
        const grouped = new Map<string, number>();
        for (const pair of data.pairs) {
          const addr = pair.baseToken.address.toLowerCase();
          const price = parseFloat(pair.priceUsd ?? '0');
          if (!isFinite(price) || price <= 0) continue;
          // Take the highest listed price as conservative TP guard
          if (!grouped.has(addr) || price > grouped.get(addr)!) {
            grouped.set(addr, price);
          }
        }

        for (const [addr, price] of grouped) {
          result.set(addr, price);
        }
      } catch (err) {
        console.error('[priceFeeds] DexScreener error:', err);
      }
    }),
  );

  return result;
}
