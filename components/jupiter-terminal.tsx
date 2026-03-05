'use client';

import { useEffect } from 'react';

interface JupiterTerminalProps {
  mint?: string;
}

const JUPITER_TERMINAL_ID = 'integrated-terminal';

function initJupiter(mint?: string) {
  if (!window.Jupiter) return;

  // Close any existing instance before re-initialising
  try { window.Jupiter.close(); } catch (_) {}

  // Use rAF to guarantee the target div is painted with real dimensions
  requestAnimationFrame(() => {
    const el = document.getElementById(JUPITER_TERMINAL_ID);
    if (!el) return;

    window.Jupiter.init({
      displayMode: 'integrated',
      integratedTargetId: JUPITER_TERMINAL_ID,
      // Use a reliable public RPC endpoint; swap for a paid one (Helius, QuickNode) for production
      endpoint: 'https://api.mainnet-beta.solana.com',
      formProps: {
        fixedOutputMint: !!mint,
        initialOutputMint: mint,
      },
      // Match the dark theme of the app
      appearance: 'dark',
    });
  });
}

export default function JupiterTerminal({ mint }: JupiterTerminalProps) {
  useEffect(() => {
    // If the script is already loaded (e.g. navigating between signals), just re-init
    if (window.Jupiter) {
      initJupiter(mint);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://terminal.jup.ag/main-v4.js';
    script.async = true;
    script.onload = () => initJupiter(mint);
    document.body.appendChild(script);

    return () => {
      try { window.Jupiter?.close(); } catch (_) {}
    };
  // Re-run whenever the target token changes
  }, [mint]);

  return (
    // Explicit pixel height is required — Jupiter falls back to a new window
    // when getBoundingClientRect() returns zero height.
    <div
      id={JUPITER_TERMINAL_ID}
      style={{ width: '100%', height: '560px' }}
    />
  );
}

declare global {
  interface Window {
    Jupiter: any;
  }
}
