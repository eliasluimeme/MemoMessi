import { PrismaClient } from '@prisma/client';

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

function createPrismaClient() {
  // Use DIRECT_URL (bypasses PgBouncer pooler) for reliable server-side queries.
  // DIRECT_URL is a direct Neon compute connection — faster cold-starts, no pooler hang.
  // DATABASE_URL (pooler) is only needed for migrations (handled by prisma.config.ts).
  const url = process.env.DIRECT_URL || process.env.DATABASE_URL;
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
