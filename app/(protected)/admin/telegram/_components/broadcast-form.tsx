'use client';

import { useState } from 'react';

import { Send, MessageSquare, Users, CheckCircle2, XCircle } from 'lucide-react';
import { toast } from 'sonner';

import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

export function BroadcastForm() {
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [lastResult, setLastResult] = useState<{ successful: number; failed: number } | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    setIsLoading(true);
    setLastResult(null);
    try {
      const res = await fetch('/api/telegram/broadcast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to send broadcast');
      }

      setLastResult({ successful: data.successful ?? 0, failed: data.failed ?? 0 });
      toast.success(
        data.successful > 0
          ? `Message sent to ${data.successful} subscribers${data.failed > 0 ? ` (${data.failed} failed)` : ''}`
          : 'No active subscribers found',
      );
      setMessage('');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to send broadcast');
    } finally {
      setIsLoading(false);
    }
  };

  const charCount = message.length;
  const maxChars = 4096;

  return (
    <div className="rounded-[24px] border border-border/40 bg-card/40 backdrop-blur-xl p-8 space-y-6">
      {/* Card header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center flex-shrink-0">
            <MessageSquare className="h-4 w-4 text-purple-400" />
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">Send Broadcast</p>
            <p className="text-[10px] text-muted-foreground/60 uppercase tracking-widest font-semibold">
              All active subscribers
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-secondary/40 border border-border/40">
          <Users className="h-3 w-3 text-muted-foreground/60" />
          <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
            Broadcast
          </span>
        </div>
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
        {/* Textarea */}
        <div className="relative">
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Compose your message to all degens…"
            className={cn(
              'min-h-[160px] resize-none rounded-2xl border-border/50 bg-secondary/30 text-sm placeholder:text-muted-foreground/40 focus-visible:ring-1 focus-visible:ring-primary/40 focus-visible:border-primary/40 transition-colors p-4',
              charCount > maxChars && 'border-rose-500/50 focus-visible:ring-rose-500/40'
            )}
            maxLength={maxChars}
            required
          />
          {/* Char count */}
          <span className={cn(
            'absolute bottom-3 right-4 text-[10px] font-mono tabular-nums',
            charCount > maxChars * 0.9 ? 'text-amber-500' : 'text-muted-foreground/30'
          )}>
            {charCount}/{maxChars}
          </span>
        </div>

        {/* Last result strip */}
        {lastResult && (
          <div className="flex items-center gap-4 px-4 py-3 rounded-xl bg-secondary/30 border border-border/40">
            <div className="flex items-center gap-1.5 text-emerald-400">
              <CheckCircle2 className="h-3.5 w-3.5" />
              <span className="text-xs font-semibold">{lastResult.successful} delivered</span>
            </div>
            {lastResult.failed > 0 && (
              <div className="flex items-center gap-1.5 text-rose-400">
                <XCircle className="h-3.5 w-3.5" />
                <span className="text-xs font-semibold">{lastResult.failed} failed</span>
              </div>
            )}
          </div>
        )}

        {/* Submit */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={isLoading || !message.trim() || charCount > maxChars}
            className={cn(
              'inline-flex items-center gap-2 h-11 px-6 rounded-2xl font-medium text-sm transition-all duration-200',
              isLoading || !message.trim() || charCount > maxChars
                ? 'bg-secondary/40 text-muted-foreground/40 cursor-not-allowed'
                : 'bg-primary text-primary-foreground hover:opacity-90 active:scale-[0.98]'
            )}
          >
            {isLoading ? (
              <>
                <span className="w-3.5 h-3.5 rounded-full border-2 border-current border-t-transparent animate-spin" />
                Sending…
              </>
            ) : (
              <>
                <Send className="h-3.5 w-3.5" />
                Broadcast Message
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
