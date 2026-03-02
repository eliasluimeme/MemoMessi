'use client';

import { useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { Button } from './ui/button';
import { useToast } from './ui/toast-context';

interface CopyButtonProps {
    value: string;
    className?: string;
}

export function CopyButton({ value, className }: CopyButtonProps) {
    const [hasCopied, setHasCopied] = useState(false);
    const { toast } = useToast();

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(value);
            setHasCopied(true);
            toast({
                title: 'Copied!',
                description: 'Contract address copied to clipboard.',
            });
            setTimeout(() => setHasCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy text: ', err);
        }
    };

    return (
        <Button
            size="sm"
            variant="ghost"
            className={className}
            onClick={copyToClipboard}
        >
            {hasCopied ? (
                <Check className="h-4 w-4 text-emerald-500" />
            ) : (
                <Copy className="h-4 w-4" />
            )}
            <span className="sr-only">Copy</span>
        </Button>
    );
}
