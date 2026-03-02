'use client';

import { useState } from 'react';

import { Copy } from 'lucide-react';

interface CopyTextProps {
  text: string;
  displayText?: string;
  className?: string;
}

export function CopyText({ text, displayText, className }: CopyTextProps) {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="relative">
      <button
        onClick={handleCopy}
        className={`flex cursor-pointer items-center gap-1 truncate rounded bg-muted px-2 py-1 font-mono text-xs text-muted-foreground hover:bg-muted/80 ${className}`}
        type="button"
      >
        {displayText || text} <Copy className="h-4 w-4" />
      </button>
      {isCopied && (
        <span className="absolute left-1/2 top-full mt-1 -translate-x-1/2 rounded-md bg-green-500 px-2 py-1 text-xs text-white">
          Copied!
        </span>
      )}
    </div>
  );
}
