'use client';

import { ArrowUpRight } from 'lucide-react';

import JupiterTerminal from '@/components/jupiter-terminal';
import LiFiWidget from '@/components/lifi-widget';
import {
  getEVMChainId,
  getSwapLinks,
  isEVMNetwork,
  isSolanaNetwork,
} from '@/lib/utils/chain-utils';

interface SwapWidgetProps {
  network?: string | null;
  contractAddress?: string | null;
}

const PLATFORM_COLORS: Record<string, string> = {
  Jupiter:          'hover:border-[#17D896]/30 hover:text-[#17D896]',
  Raydium:          'hover:border-purple-500/30 hover:text-purple-400',
  Orca:             'hover:border-sky-500/30 hover:text-sky-400',
  PancakeSwap:      'hover:border-yellow-500/30 hover:text-yellow-400',
  Uniswap:          'hover:border-pink-500/30 hover:text-pink-400',
  'Jumper (LI.FI)': 'hover:border-violet-500/30 hover:text-violet-400',
  '1inch':          'hover:border-red-500/30 hover:text-red-400',
  DexScreener:      'hover:border-amber-500/30 hover:text-amber-400',
};

export default function SwapWidget({ network, contractAddress }: SwapWidgetProps) {
  if (!contractAddress) return null;

  const solana    = isSolanaNetwork(network);
  const evm       = isEVMNetwork(network);
  const chainId   = evm ? getEVMChainId(network) : null;
  const hasInApp  = solana || (evm && !!chainId);
  const swapLinks = getSwapLinks(network, contractAddress);

  return (
    <div className="space-y-6">

      {/* ── In-app terminal — borderless, flush ── */}
      {hasInApp ? (
        <div>
          {solana && <JupiterTerminal mint={contractAddress} />}
          {evm && chainId && <LiFiWidget toChain={chainId} toToken={contractAddress} />}
        </div>
      ) : (
        <p className="text-[10px] text-muted-foreground/30 uppercase tracking-widest">
          In-app swap not available for this network — use a platform below.
        </p>
      )}

      {/* ── Platform shortcuts ── */}
      {swapLinks.length > 0 && (
        <div className="flex flex-col items-center gap-4 pt-2">
          {/* Divider with label */}
          <div className="flex items-center gap-3 w-full">
            <div className="flex-1 h-px bg-white/[0.04]" />
            <span className="text-[9px] font-black uppercase tracking-[0.3em] text-muted-foreground/20 shrink-0">
              {hasInApp ? 'or trade on' : 'trade on'}
            </span>
            <div className="flex-1 h-px bg-white/[0.04]" />
          </div>
          {/* Pills centered */}
          <div className="flex flex-wrap justify-center gap-2">
            {swapLinks.map((link) => (
              <a
                key={link.name}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                title={link.description}
                className={[
                  'group flex items-center gap-1.5 px-5 py-2 rounded-full',
                  'border border-white/[0.06] bg-white/[0.01]',
                  'text-[11px] font-semibold text-muted-foreground/25',
                  'transition-all duration-300 hover:bg-white/[0.03]',
                  PLATFORM_COLORS[link.name] ?? 'hover:border-white/15 hover:text-foreground/50',
                ].join(' ')}
              >
                {link.name}
                <ArrowUpRight className="h-3 w-3 opacity-0 -translate-y-px translate-x-px group-hover:opacity-60 group-hover:translate-y-0 group-hover:translate-x-0 transition-all duration-300" />
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
