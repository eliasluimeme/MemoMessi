'use client';

import { useState } from 'react';

import { Send } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';

export function BroadcastForm() {
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    setIsLoading(true);
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

      toast.success(
        data.successful > 0
          ? `Message sent to ${data.successful} subscribers${
              data.failed > 0 ? ` (${data.failed} failed)` : ''
            }`
          : 'No active subscribers found',
      );
      setMessage('');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to send broadcast');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Send Broadcast</CardTitle>
        <CardDescription>Send a message to all subscribers</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-6">
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Enter your message..."
            className="min-h-[120px] resize-none"
            required
          />

          <div className="flex justify-end">
            <Button type="submit" disabled={isLoading || !message.trim()} size="sm">
              {isLoading ? (
                'Sending...'
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Send Message
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
