// ─────────────────────────────────────────────────────────────────────────────
// Chain / Network Utilities
// Canonical network slugs used throughout the app:
//   "solana" | "base" | "eth" | "ethereum" | "bsc" | "binance"
// ─────────────────────────────────────────────────────────────────────────────

/** Human-readable label for each network slug */
export const NETWORK_LABELS: Record<string, string> = {
  solana: 'Solana',
  base: 'Base',
  eth: 'Ethereum',
  ethereum: 'Ethereum',
  bsc: 'BSC',
  binance: 'BSC',
};

/** EVM chain IDs keyed by network slug */
export const EVM_CHAIN_IDS: Record<string, number> = {
  base: 8453,
  eth: 1,
  ethereum: 1,
  bsc: 56,
  binance: 56,
};

/** DexScreener network slugs */
export const DEXSCREENER_NETWORK: Record<string, string> = {
  solana: 'solana',
  base: 'base',
  eth: 'ethereum',
  ethereum: 'ethereum',
  bsc: 'bsc',
  binance: 'bsc',
};

/** GeckoTerminal network slugs */
export const GECKO_NETWORK: Record<string, string> = {
  solana: 'solana',
  base: 'base',
  eth: 'eth',
  ethereum: 'eth',
  bsc: 'bsc',
  binance: 'bsc',
};

// ─────────────────────────────────────────────────────────────────────────────
// Type helpers
// ─────────────────────────────────────────────────────────────────────────────

export function isSolanaNetwork(network?: string | null): boolean {
  return !!(network && network.toLowerCase() === 'solana');
}

export function isBSCNetwork(network?: string | null): boolean {
  return !!(network && (network === 'bsc' || network === 'binance'));
}

export function isEVMNetwork(network?: string | null): boolean {
  if (!network) return false;
  const n = network.toLowerCase();
  // All non-Solana supported networks are EVM-compatible (including BSC)
  return n !== 'solana' && !!EVM_CHAIN_IDS[n];
}

export function isMemeNetwork(network?: string | null): boolean {
  return (
    network === 'solana' ||
    network === 'base' ||
    network === 'eth' ||
    network === 'ethereum' ||
    network === 'bsc'
  );
}

export function getEVMChainId(network?: string | null): number | null {
  if (!network) return null;
  return EVM_CHAIN_IDS[network.toLowerCase()] ?? null;
}

// ─────────────────────────────────────────────────────────────────────────────
// Explorer URL
// ─────────────────────────────────────────────────────────────────────────────

export function getExplorerUrl(
  network?: string | null,
  contractAddress?: string | null,
  pair?: string,
): string {
  if (!network) return '#';
  if (!contractAddress) return '#';

  switch (network) {
    case 'solana':
      return `https://solscan.io/token/${contractAddress}`;
    case 'eth':
    case 'ethereum':
      return `https://etherscan.io/token/${contractAddress}`;
    case 'base':
      return `https://basescan.org/token/${contractAddress}`;
    case 'bsc':
    case 'binance':
      return pair
        ? `https://www.binance.com/en/trade/${pair.replace('/', '_')}`
        : `https://bscscan.com/token/${contractAddress}`;
    default:
      return `https://dexscreener.com/${network}/${contractAddress}`;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Swap links
// ─────────────────────────────────────────────────────────────────────────────

export interface SwapLink {
  name: string;
  description: string;
  url: string;
}

/**
 * Returns a list of external swap platform links for a given token.
 * Used both for the in-page external-links grid and Telegram buttons.
 */
export function getSwapLinks(
  network?: string | null,
  contractAddress?: string | null,
): SwapLink[] {
  if (!contractAddress) return [];

  const net = network?.toLowerCase();

  // ── Solana ──────────────────────────────────────────────────────────────
  if (net === 'solana') {
    return [
      {
        name: 'Jupiter',
        description: 'Best-price aggregator on Solana',
        url: `https://jup.ag/swap/SOL-${contractAddress}`,
      },
      {
        name: 'Raydium',
        description: 'Solana DEX & AMM',
        url: `https://raydium.io/swap/?inputCurrency=SOL&outputCurrency=${contractAddress}`,
      },
      {
        name: 'Orca',
        description: 'User-friendly Solana DEX',
        url: `https://www.orca.so/?tokenIn=SOL&tokenOut=${contractAddress}`,
      },
      {
        name: 'DexScreener',
        description: 'Charts & trade links',
        url: `https://dexscreener.com/solana/${contractAddress}`,
      },
    ];
  }

  // ── BSC / Binance Smart Chain ───────────────────────────────────────────
  if (net === 'bsc' || net === 'binance') {
    return [
      {
        name: 'PancakeSwap',
        description: 'Leading BSC DEX',
        url: `https://pancakeswap.finance/swap?inputCurrency=BNB&outputCurrency=${contractAddress}`,
      },
      {
        name: 'Jumper (LI.FI)',
        description: 'Multi-chain bridge & swap',
        url: `https://jumper.exchange/?toChain=56&toToken=${contractAddress}`,
      },
      {
        name: '1inch',
        description: 'Best-rate DEX aggregator',
        url: `https://app.1inch.io/#/56/simple/swap/BNB/${contractAddress}`,
      },
      {
        name: 'DexScreener',
        description: 'Charts & trade links',
        url: `https://dexscreener.com/bsc/${contractAddress}`,
      },
    ];
  }

  const chainId = getEVMChainId(net);
  if (!chainId) return [];

  // ── Base ────────────────────────────────────────────────────────────────
  if (net === 'base') {
    return [
      {
        name: 'Uniswap',
        description: 'Leading DEX on Base',
        url: `https://app.uniswap.org/#/swap?outputCurrency=${contractAddress}&chain=base`,
      },
      {
        name: 'Jumper (LI.FI)',
        description: 'Multi-chain bridge & swap',
        url: `https://jumper.exchange/?toChain=${chainId}&toToken=${contractAddress}`,
      },
      {
        name: '1inch',
        description: 'Best-rate DEX aggregator',
        url: `https://app.1inch.io/#/${chainId}/simple/swap/ETH/${contractAddress}`,
      },
      {
        name: 'DexScreener',
        description: 'Charts & trade links',
        url: `https://dexscreener.com/base/${contractAddress}`,
      },
    ];
  }

  // ── Ethereum ────────────────────────────────────────────────────────────
  return [
    {
      name: 'Uniswap',
      description: 'Leading Ethereum DEX',
      url: `https://app.uniswap.org/#/swap?outputCurrency=${contractAddress}&chain=mainnet`,
    },
    {
      name: 'Jumper (LI.FI)',
      description: 'Multi-chain bridge & swap',
      url: `https://jumper.exchange/?toChain=${chainId}&toToken=${contractAddress}`,
    },
    {
      name: '1inch',
      description: 'Best-rate DEX aggregator',
      url: `https://app.1inch.io/#/${chainId}/simple/swap/ETH/${contractAddress}`,
    },
    {
      name: 'DexScreener',
      description: 'Charts & trade links',
      url: `https://dexscreener.com/ethereum/${contractAddress}`,
    },
  ];
}

/**
 * Returns the single best swap URL for a network — used in Telegram "Trade Now" buttons.
 * Solana → jup.ag  |  EVM → jumper.exchange (LI.FI)  |  fallback → DexScreener
 */
export function getTelegramSwapUrl(
  network?: string | null,
  contractAddress?: string | null,
): string {
  if (!contractAddress) return 'https://jup.ag';
  if (network === 'solana') return `https://jup.ag/swap/SOL-${contractAddress}`;
  const chainId = getEVMChainId(network);
  if (chainId) return `https://jumper.exchange/?toChain=${chainId}&toToken=${contractAddress}`;
  return `https://dexscreener.com/${network}/${contractAddress}`;
}

/**
 * Returns the Uniswap fallback URL — kept for users who prefer Uniswap over LI.FI.
 */
export function getUniswapUrl(
  network?: string | null,
  contractAddress?: string | null,
): string {
  if (!contractAddress) return 'https://app.uniswap.org';
  const uniChain =
    network === 'eth' || network === 'ethereum'
      ? 'mainnet'
      : network ?? 'base';
  return `https://app.uniswap.org/#/swap?outputCurrency=${contractAddress}&chain=${uniChain}`;
}
