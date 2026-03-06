import { PrismaClient } from '@prisma/client';

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

function createPrismaClient() {
  // Use DATABASE_URL (PgBouncer transaction-mode pooler) for all app queries.
  // DIRECT_URL (non-pooled) is reserved for migrations via prisma.config.ts.
  let url = process.env.DATABASE_URL || process.env.DIRECT_URL || '';

  // Cap Prisma's internal connection pool to 1 so PgBouncer handles all
  // multiplexing. Without this, Prisma opens (num_cpu × 2 + 1) connections by
  // default — instantly exhausting Supabase session-mode pool_size when
  // multiple async server components fire concurrently.
  // pgbouncer=true disables prepared statements, required for transaction-mode pooler.
  if (url && !url.includes('connection_limit')) {
    url += (url.includes('?') ? '&' : '?') + 'connection_limit=1&pool_timeout=20&pgbouncer=true';
  }

  return new PrismaClient({
    datasources: { db: { url } },
  });
}

export const prisma = global.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== 'production') global.prisma = prisma;

/**
 * Retry wrapper for transient DB errors.
 */
export async function withRetry<T>(fn: () => Promise<T>): Promise<T> {
  try {
    return await fn();
  } catch (err: any) {
    const isTransient =
      err?.code === 'P1001' ||
      err?.code === 'P1002' ||
      err?.message?.includes('ECONNRESET') ||
      err?.message?.includes('connection');

    if (!isTransient) throw err;
    return await fn();
  }
}
