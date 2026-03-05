'use client';

interface LiFiWidgetProps {
  toChain: number;
  toToken: string;
}

/**
 * Embeds the LI.FI / Jumper Exchange swap widget via iframe.
 * Handles wallet connection internally — no external wallet adapter needed.
 * Supports ETH (chain 1), Base (8453), BSC (56), and any other LI.FI-supported chain.
 */
export default function LiFiWidget({ toChain, toToken }: LiFiWidgetProps) {
  const src = `https://jumper.exchange/embed/?toChain=${toChain}&toToken=${toToken}&theme=dark`;

  return (
    <div className="w-full rounded-xl overflow-hidden border border-border shadow-lg bg-card min-h-[600px]">
      <iframe
        src={src}
        width="100%"
        height="600"
        style={{ border: 'none', minHeight: '600px', display: 'block' }}
        title="LI.FI Swap Widget"
        allow="clipboard-write; clipboard-read; web-share; camera"
        allowFullScreen
      />
    </div>
  );
}
