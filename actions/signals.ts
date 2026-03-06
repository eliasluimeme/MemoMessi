import { SignalWithTargets } from '@/types/signal';
import { Favorite, Signal, Target } from '@prisma/client';
import { PrismaClient, Status } from '@prisma/client';

import { getSession } from '@/lib/auth-utils';
import { getHighLowPrices } from '@/lib/binance';
import { prisma } from '@/lib/prisma';

/** Fetch current price from our price API (uses DexScreener for non-Binance tokens) */
async function getDexPrice(signal: Signal): Promise<number | null> {
  try {
    const base = signal.pair.split('/')[0];
    const params = new URLSearchParams();
    if (signal.contractAddress) params.set('ca', signal.contractAddress);
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const res = await fetch(`${baseUrl}/api/price/${encodeURIComponent(base)}?${params}`, {
      cache: 'no-store',
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.price ? Number(data.price) : null;
  } catch {
    return null;
  }
}

/** checkTargetsHit for non-Binance networks using current DexScreener price */
async function checkTargetsHitDex<T extends Signal & { targets: Target[] }>(signal: T, tx: TransactionClient): Promise<T> {
  const currentPrice = await getDexPrice(signal);
  if (!currentPrice || isNaN(currentPrice)) return signal;

  const updatedTargets = signal.targets.map((target) => ({
    ...target,
    hit: target.hit || target.price <= currentPrice,
  }));

  const hasNewHits = updatedTargets.some((t, i) => t.hit !== signal.targets[i].hit);
  const allTargetsHit = updatedTargets.every((t) => t.hit);

  if (hasNewHits) {
    await tx.signal.update({
      where: { id: signal.id },
      data: {
        targets: {
          updateMany: updatedTargets.map((t) => ({
            where: { id: t.id },
            data: { hit: t.hit },
          })),
        },
        ...(allTargetsHit && {
          isClosed: true,
          status: Status.CLOSED,
          closedAt: new Date(),
        }),
      },
    });
  }

  return {
    ...signal,
    targets: updatedTargets,
    ...(allTargetsHit && {
      isClosed: true,
      status: Status.CLOSED,
      closedAt: new Date(),
    }),
  } as T;
}

type TransactionClient = Omit<
  PrismaClient,
  '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'
>;
type TSignal = Signal & {
  targets: Target[];
  favorites: Favorite[];
  isFavorite?: boolean;
  isLocked?: boolean;
};

/** Returns true if the user has an active VIP subscription */
export async function isVipUser(userId: string): Promise<boolean> {
  const sub = await prisma.subscription.findUnique({
    where: { userId },
    select: { status: true },
  });
  return sub?.status === 'ACTIVE';
}

export async function getFavoriteSignals() {
  const session = await getSession();

  if (!session || !session.id) {
    throw new Error('Unauthorized');
  }

  const userId = session.id as string;
  const isAdmin = session.role === 'ADMIN' || session.role === 'PRIVATE';
  const vip = isAdmin || (await isVipUser(userId));

  try {
    const favorites = await prisma.favorite.findMany({
      where: {
        userId,
      },
      include: {
        signal: {
          include: {
            targets: {
              orderBy: {
                number: 'asc',
              },
            },
          },
        },
      },
    });

    const signalsWithFavoriteStatus = favorites.map((favorite) => {
      const isLocked = !vip && favorite.signal.isVip;
      if (isLocked) {
        return {
          id: favorite.signal.id,
          pair: favorite.signal.pair,
          market: favorite.signal.market,
          action: favorite.signal.action,
          network: favorite.signal.network,
          status: favorite.signal.status,
          isVip: favorite.signal.isVip,
          isLocked: true,
          isFavorite: true,
          isClosed: favorite.signal.isClosed,
          createdAt: favorite.signal.createdAt,
          updatedAt: favorite.signal.updatedAt,
          entryZone: 0,
          stopLoss: null,
          targets: [],
          favorites: [],
          contractAddress: null,
          note: null,
          imageURL: null,
          closedAt: null,
        };
      }
      return {
        ...favorite.signal,
        isFavorite: true,
        isLocked: false,
      };
    });

    return signalsWithFavoriteStatus as TSignal[];
  } catch (error) {
    console.error('Error fetching favorites:', error);
    throw new Error('Failed to fetch favorites');
  }
}

export async function getAllSignals() {
  const session = await getSession();

  if (!session || !session.id) throw new Error('Unauthorized');

  const userId = session.id as string;
  const isAdmin = session.role === 'ADMIN' || session.role === 'PRIVATE';

  // Check VIP status (admins always have full access)
  const vip = isAdmin || (await isVipUser(userId));

  try {
    return await prisma.$transaction(async (tx) => {
      // Get all signals with targets and favorites
      const signals = await tx.signal.findMany({
        include: {
          targets: {
            orderBy: {
              number: 'asc',
            },
          },
          favorites: {
            where: {
              userId,
            },
            select: {
              id: true,
              userId: true,
              signalId: true,
              createdAt: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      const updatedSignals = await Promise.all(
        signals.map(async (signal) => {
          if (signal.isClosed || !signal.targets.length) return signal;
          return checkTargetsHit(signal, tx);
        }),
      );

      // Map signals: VIP signals are locked for free users.
      // Locked signals have sensitive fields stripped so data is never exposed.
      const signalsWithFavoriteStatus = updatedSignals.map((signal) => {
        const isLocked = !vip && signal.isVip;
        if (isLocked) {
          // Return only non-sensitive metadata — no prices, targets, CA or notes
          return {
            id: signal.id,
            pair: signal.pair,
            market: signal.market,
            action: signal.action,
            network: signal.network,
            status: signal.status,
            isVip: signal.isVip,
            isLocked: true,
            isFavorite: signal.favorites.length > 0,
            isClosed: signal.isClosed,
            createdAt: signal.createdAt,
            updatedAt: signal.updatedAt,
            // Sensitive fields zeroed out
            entryZone: 0,
            stopLoss: null,
            targets: [],
            favorites: [],
            contractAddress: null,
            note: null,
            imageURL: null,
            closedAt: null,
          };
        }
        return {
          ...signal,
          isFavorite: signal.favorites.length > 0,
          favorites: [],
          isLocked: false,
        };
      });

      return signalsWithFavoriteStatus as TSignal[];
    });
  } catch (error) {
    console.error('Error fetching signals:', error);
    throw new Error('Failed to fetch signals');
  }
}

export async function checkTargetsHit<T extends Signal & { targets: Target[] }>(signal: T, tx: TransactionClient): Promise<T> {
  // Skip if signal is already closed or has no targets
  if (signal.isClosed || signal.targets.length === 0) return signal;

  // Non-Binance networks (Solana, Base, etc): use DexScreener current price
  if (signal.network && signal.network !== 'binance') {
    return checkTargetsHitDex(signal, tx);
  }

  try {
    const symbol = signal.pair.replace('/', '');
    const prices = await getHighLowPrices(symbol, signal.createdAt);
    const highPrice = Number(prices.highPrice);
    const lowPrice = Number(prices.lowPrice);
    if (isNaN(highPrice) || isNaN(lowPrice) || !isFinite(highPrice) || !isFinite(lowPrice))
      return signal;

    const highestPrice = Math.max(parseFloat(prices.highPrice), parseFloat(prices.lowPrice));
    console.log({ highestPrice });
    const updatedTargets = signal.targets.map((target) => ({
      ...target,
      hit: target.hit || (target.price <= highestPrice && target.price >= signal.entryZone),
    }));

    const hasNewHits = updatedTargets.some((t, i) => t.hit !== signal.targets[i].hit);
    const allTargetsHit = updatedTargets.every((target) => target.hit);

    if (hasNewHits) {
      await tx.signal.update({
        where: { id: signal.id },
        data: {
          targets: {
            updateMany: updatedTargets.map((target) => ({
              where: { id: target.id },
              data: { hit: target.hit },
            })),
          },
          ...(allTargetsHit && {
            isClosed: true,
            status: Status.CLOSED,
            closedAt: new Date(),
          }),
        },
      });
    }

    return {
      ...signal,
      targets: updatedTargets,
      ...(allTargetsHit && {
        isClosed: true,
        status: Status.CLOSED,
        closedAt: new Date(),
      }),
    } as T;
  } catch (error) {
    console.error('Error checking targets:', error);
    return signal;
  }
}
