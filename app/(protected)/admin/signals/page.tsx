import { getSignalAnalytics } from '@/actions/analytics';
import { checkTargetsHit } from '@/actions/signals';
import AnalyticsCards from '@/app/(protected)/admin/_components/analytics-cards';
import { MotionContainer, MotionItem } from '@/components/motion-container';

import { SignalsHeader } from '@/components/signals-header';

import { prisma } from '@/lib/prisma';

import { SignalsList } from './_components/signals-list';

export const dynamic = 'force-dynamic';

const getSignals = async () => {
  return await prisma.$transaction(
    async (tx) => {
      const signals = await tx.signal.findMany({
        include: {
          targets: {
            orderBy: {
              number: 'asc',
            },
          },
          favorites: {
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

      return updatedSignals;
    },
    {
      maxWait: 15000,
      timeout: 30000,
    },
  );
};

export default async function SignalManagement() {
  const [signals, analytics] = await Promise.all([getSignals(), getSignalAnalytics()]);

  return (
    <div className="container mx-auto py-12 px-6 md:px-12 max-w-[1400px]">
      <MotionContainer className="space-y-12">
        <MotionItem>
          <SignalsHeader />
        </MotionItem>

        <MotionItem>
          <div className="space-y-3">
            <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">
              Signal Analytics
            </p>
            <AnalyticsCards analytics={analytics} />
          </div>
        </MotionItem>

        <MotionItem>
          <div className="space-y-3">
            <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">
              All Signals
            </p>
            <SignalsList initialSignals={signals} />
          </div>
        </MotionItem>
      </MotionContainer>
    </div>
  );
}
