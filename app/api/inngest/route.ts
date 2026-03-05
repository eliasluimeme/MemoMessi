import { serve } from 'inngest/next';
import { inngest } from '@/inngest/client';
import { tpWatcher } from '@/inngest/functions/tp-watcher';

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [tpWatcher],
});
