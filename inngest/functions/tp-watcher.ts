import { inngest } from '@/inngest/client';
import { prisma } from '@/lib/prisma';
import { getBinancePrices, getDexScreenerPrices } from '@/lib/priceFeeds';
import { telegramService } from '@/lib/telegram';
import { Status } from '@prisma/client';

// ─── helpers ──────────────────────────────────────────────────────────────────

/** Maps the highest serial TP number hit ⟶ the Prisma Status enum value */
function tpNumberToStatus(n: number): Status {
  const map: Record<number, Status> = {
    1: Status.TP1,
    2: Status.TP2,
    3: Status.TP3,
    4: Status.TP4,
    5: Status.TP5,
    6: Status.TP6,
    7: Status.TP7,
    8: Status.TP8,
    9: Status.TP9,
    10: Status.TP10,
  };
  return map[n] ?? Status.TP1;
}

function formatTelegramMessage(
  pair: string,
  tpNumber: number,
  price: number,
  gain: number,
): string {
  const gainStr = gain > 0 ? `+${gain.toFixed(2)}%` : `${gain.toFixed(2)}%`;
  return (
    `🎯 <b>TP${tpNumber} Hit!</b>\n\n` +
    `Pair: <b>${pair}</b>\n` +
    `Target reached: <b>$${price.toLocaleString(undefined, { maximumSignificantDigits: 6 })}</b>\n` +
    `Gain: <b>${gainStr}</b>`
  );
}

function formatStopLossMessage(pair: string, price: number, loss: number): string {
  const lossStr = loss >= 0 ? `+${loss.toFixed(2)}%` : `${loss.toFixed(2)}%`;
  return (
    `🛑 <b>Stop Loss Hit!</b>\n\n` +
    `Pair: <b>${pair}</b>\n` +
    `Stop Loss: <b>$${price.toLocaleString(undefined, { maximumSignificantDigits: 6 })}</b>\n` +
    `Loss: <b>${lossStr}</b>`
  );
}

// ─── scheduled function ───────────────────────────────────────────────────────

export const tpWatcher = inngest.createFunction(
  {
    id: 'tp-watcher',
    name: 'TP Watcher – live price checker',
    // Prevent overlapping runs if the previous one is still in-flight
    concurrency: { limit: 1 },
  },
  // Every minute on Inngest free tier.
  // Upgrade to paid plan for "*/30 * * * * *" (every 30 s).
  { cron: '* * * * *' },

  async ({ step, logger }) => {
    // ── Step 1: load all open signals ────────────────────────────────────────
    const signals = await step.run('load-open-signals', async () => {
      return prisma.signal.findMany({
        where: { isClosed: false },
        include: {
          targets: {
            where: { hit: false },
            orderBy: { number: 'asc' },
          },
        },
      });
    });

    // Signals with unhit targets (TP candidates) + signals with a stop loss
    const tpSignals = signals.filter((s) => s.targets.length > 0);
    const slSignals = signals.filter((s) => s.stopLoss != null);

    // Deduplicated union — we need prices for both sets
    const priceSignals = [
      ...new Map([...tpSignals, ...slSignals].map((s) => [s.id, s])).values(),
    ];

    logger.info(
      `[tp-watcher] TP candidates: ${tpSignals.length}, SL candidates: ${slSignals.length}`,
    );

    if (!priceSignals.length) return { checked: 0 };

    // ── Step 2: bulk-fetch prices ────────────────────────────────────────────
    const [binancePrices, dexPrices] = await step.run(
      'fetch-prices',
      async () => {
        const binanceSymbols = priceSignals
          .filter((s) => !s.network || s.network === 'binance')
          .map((s) => s.pair.replace('/', '').toUpperCase());
        const solanaAddresses = priceSignals
          .filter((s) => s.network === 'solana' && !!s.contractAddress)
          .map((s) => s.contractAddress!)
          .filter(Boolean);

        const [b, d] = await Promise.all([
          getBinancePrices(binanceSymbols),
          getDexScreenerPrices(solanaAddresses),
        ]);

        // Serialise Maps to plain objects so Inngest can checkpoint them
        return [Object.fromEntries(b), Object.fromEntries(d)] as [
          Record<string, number>,
          Record<string, number>,
        ];
      },
    );

    // ── Step 3: evaluate & persist TP + SL hits ──────────────────────────────
    type TpNotif = { type: 'tp'; pair: string; tpNumber: number; price: number; gain: number };
    type SlNotif = { type: 'sl'; pair: string; price: number; loss: number };
    const notifications: (TpNotif | SlNotif)[] = [];

    await step.run('evaluate-and-persist', async () => {
      for (const signal of priceSignals) {
        let currentPrice: number | undefined;

        if (!signal.network || signal.network === 'binance') {
          currentPrice = binancePrices[signal.pair.replace('/', '').toUpperCase()];
        } else if (signal.network === 'solana' && signal.contractAddress) {
          currentPrice = dexPrices[signal.contractAddress.toLowerCase()];
        }

        if (!currentPrice || !isFinite(currentPrice)) continue;

        const now = new Date();
        let closedByTP = false;

        // ── TP evaluation ──────────────────────────────────────────────────
        if (signal.targets.length > 0) {
          const newlyHitTargets = signal.targets.filter(
            (t) => !t.hit && currentPrice! >= t.price,
          );

          if (newlyHitTargets.length > 0) {
            // Persist all newly hit targets in one shot
            await prisma.$transaction(
              newlyHitTargets.map((t) =>
                prisma.target.update({
                  where: { id: t.id },
                  data: { hit: true, hitAt: now },
                }),
              ),
            );

            // Check if ALL targets (including previously hit) are now done
            const allTargets = await prisma.target.findMany({
              where: { signalId: signal.id },
            });
            const allHit = allTargets.every((t) => t.hit);
            const maxHitNumber = Math.max(
              ...allTargets.filter((t) => t.hit).map((t) => t.number),
            );

            await prisma.signal.update({
              where: { id: signal.id },
              data: {
                status: allHit ? Status.CLOSED : tpNumberToStatus(maxHitNumber),
                ...(allHit ? { isClosed: true, closedAt: now } : {}),
              },
            });

            closedByTP = allHit;

            for (const t of newlyHitTargets) {
              notifications.push({
                type: 'tp',
                pair: signal.pair,
                tpNumber: t.number,
                price: t.price,
                gain: t.gain,
              });
            }
          }
        }

        // ── SL evaluation (skip if signal was just closed by hitting all TPs) ─
        if (!closedByTP && signal.stopLoss != null) {
          // BUY: SL hit when price drops to or below stop loss
          // SELL: SL hit when price rises to or above stop loss
          const slHit =
            signal.action === 'SELL'
              ? currentPrice >= signal.stopLoss
              : currentPrice <= signal.stopLoss;

          if (slHit) {
            const loss =
              ((currentPrice - signal.entryZone) / signal.entryZone) * 100;

            await prisma.signal.update({
              where: { id: signal.id },
              data: { isClosed: true, closedAt: now, status: Status.CLOSED },
            });

            notifications.push({
              type: 'sl',
              pair: signal.pair,
              price: signal.stopLoss,
              loss,
            });
          }
        }
      }
    });

    // ── Step 4: fire Telegram notifications ──────────────────────────────────
    if (notifications.length > 0) {
      await step.run('send-telegram-notifications', async () => {
        for (const n of notifications) {
          const message =
            n.type === 'tp'
              ? formatTelegramMessage(n.pair, n.tpNumber, n.price, n.gain)
              : formatStopLossMessage(n.pair, n.price, n.loss);
          await telegramService.sendToSubscribers(message);
        }
      });
    }

    return {
      checked: priceSignals.length,
      notified: notifications.length,
      at: new Date().toISOString(),
    };
  },
);
