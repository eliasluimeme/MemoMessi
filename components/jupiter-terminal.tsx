'use client';

import { useEffect, useRef } from 'react';

interface JupiterTerminalProps {
    mint?: string;
}

export default function JupiterTerminal({ mint }: JupiterTerminalProps) {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Load Jupiter Terminal Script
        const script = document.createElement('script');
        script.src = 'https://terminal.jup.ag/main-v3.js';
        script.async = true;
        script.onload = () => {
            if (window.Jupiter) {
                window.Jupiter.init({
                    displayMode: 'integrated',
                    integratedTargetId: 'integrated-terminal',
                    endpoint: 'https://api.mainnet-beta.solana.com',
                    formProps: {
                        fixedOutputMint: true,
                        initialOutputMint: mint,
                    },
                });
            }
        };
        document.body.appendChild(script);

        return () => {
            if (script.parentNode) {
                script.parentNode.removeChild(script);
            }
        };
    }, [mint]);

    return (
        <div className="w-full rounded-xl overflow-hidden border border-border shadow-lg bg-card min-h-[600px]">
            <div id="integrated-terminal" className="w-full h-full" />
        </div>
    );
}

// Add global type for Jupiter
declare global {
    interface Window {
        Jupiter: any;
    }
}
