'use client';

import { useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';

export interface TPHitPayload {
  id: string;
  signal_id: string;
  number: number;
  price: number;
  hit: boolean;
  hit_at: string | null;
  gain: number;
}

interface UseTPUpdatesOptions {
  /** Called whenever a target row is updated to hit=true */
  onTPHit?: (target: TPHitPayload) => void;
  /** Optionally scope to a single signal */
  signalId?: string;
}

/**
 * Subscribes to Supabase Realtime changes on the `targets` table.
 *
 * Whenever the background TP watcher marks a target as hit, Supabase
 * broadcasts the Postgres change event, and this hook fires `onTPHit`.
 *
 * Requirements: Enable "Realtime" on the `targets` table in your Supabase
 * project dashboard → Database → Replication.
 */
export function useTPUpdates({ onTPHit, signalId }: UseTPUpdatesOptions = {}) {
  const handleChange = useCallback(
    (payload: { new: TPHitPayload }) => {
      const row = payload.new;
      if (!row.hit) return; // only care about hit=true changes
      if (signalId && row.signal_id !== signalId) return;
      onTPHit?.(row);
    },
    [onTPHit, signalId],
  );

  useEffect(() => {
    const channel = supabase
      .channel('tp-updates')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'targets',
          ...(signalId ? { filter: `signal_id=eq.${signalId}` } : {}),
        },
        handleChange,
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [handleChange, signalId]);
}
