import { SignalWithTargets } from '@/types/signal';
import { Favorite, Signal, Target } from '@prisma/client';
import { PrismaClient, Status } from '@prisma/client';

import { getSession } from '@/lib/auth-utils';
import { getHighLowPrices } from '@/lib/binance';
import { prisma } from '@/lib/prisma';

type TransactionClient = Omit<
  PrismaClient,
  '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'
>;
type TSignal = Signal & {
  targets: Target[];
  favorites: Favorite[];
  isFavorite?: boolean;
};

export async function getFavoriteSignals() {
  const session = await getSession();

  if (!session || !session.id) {
    throw new Error('Unauthorized');
  }

  const userId = session.id as string;

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

    const signalsWithFavoriteStatus = favorites.map((favorite) => ({
      ...favorite.signal,
      isFavorite: true,
    }));

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

      // Map signals and set isFavorite based on if user has favorited
      const signalsWithFavoriteStatus = updatedSignals.map((signal) => ({
        ...signal,
        isFavorite: signal.favorites.length > 0,
        // Clean up favorites array since we only used it to check status
        favorites: [],
      }));

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

  // Skip Binance check for meme coins/contracts that aren't on Binance
  if (signal.network && signal.network !== 'binance') {
    return signal;
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
