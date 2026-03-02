import { notFound } from 'next/navigation';

import { SignalWithTargets } from '@/types/signal';
import { AlertTriangle, DollarSign, FileText, Target, Zap } from 'lucide-react';

import TokenChart from '@/components/token-chart';
import { Badge } from '@/components/ui/badge';

import { getSession } from '@/lib/auth-utils';
import { prisma } from '@/lib/prisma';

//TODO: add token signals targets history withing targets section

async function getSignal(id: string): Promise<SignalWithTargets | null> {
  const session = await getSession();
  if (!session) return null;

  return await prisma.signal.findUnique({
    where: { id },
    include: {
      targets: {
        orderBy: {
          number: 'asc',
        },
      },
      favorites: {
        where: {
          userId: session.id as string,
        },
      },
    },
  });
}

export default async function SignalPage({ params }: { params: { id: string } }) {
  const signal = await getSignal(params.id);
  if (!signal) notFound();

  return (
    <div className="container mx-auto max-w-5xl">
      <div className="flex flex-col gap-4 md:gap-8">
        <div>
          <div className="flex items-center gap-2">
            <Zap className="h-8 w-8 fill-blue-500 text-blue-500" />
            <h1 className="text-3xl font-bold tracking-tight">Signal Details</h1>
          </div>
          <p className="mt-2 text-muted-foreground">
            View the details of the signal and its targets.
          </p>
        </div>
        {/* Chart */}
        <TokenChart
          token={signal.pair.split('/')[0]}
          createdAt={signal.createdAt}
          market={signal.market}
          status={signal.status}
          pair={signal.pair}
          signalId={signal.id}
          initialFavorited={signal.favorites.length > 0}
          network={signal.network || 'solana'}
          contractAddress={signal.contractAddress || undefined}
        />

        <div className="flex flex-col gap-4">
          {/* Targets */}
          <div className="rounded-lg border bg-card p-4">
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <Target className="h-4 w-4" />
              <h2 className="font-semibold">Targets</h2>
              <Badge
                variant={signal.targets.every((target) => target.hit) ? 'success' : 'secondary'}
                className="ml-auto w-fit text-nowrap"
              >
                {signal.targets.every((target) => target.hit)
                  ? 'All targets hit'
                  : 'Not all targets hit'}
              </Badge>
            </div>
            <div className="flex flex-col gap-4">
              {signal.targets.map((target) => (
                <div key={target.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge variant={target.hit ? 'default' : 'secondary'}>TP{target.number}</Badge>
                    <span className={target.hit ? 'text-emerald-500' : 'text-muted-foreground'}>
                      {target.gain}%
                    </span>
                  </div>
                  <span className={target.hit ? 'text-white' : 'text-muted-foreground'}>
                    ${target.price}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-1 flex-col gap-4">
            {/* Entry Zone / Stop Loss */}
            <div className="flex flex-col gap-4 sm:flex-row">
              <div className="flex w-full gap-4">
                <div className="flex flex-1 flex-col gap-1 rounded-lg border bg-card p-4">
                  <span className="flex items-center gap-2 text-sm text-muted-foreground">
                    <DollarSign className="h-4 w-4" /> Entry Zone
                  </span>
                  <span className="font-bold">${signal.entryZone}</span>
                </div>

                {signal.stopLoss && (
                  <div className="flex flex-1 flex-col gap-1 rounded-lg border bg-card p-4">
                    <span className="flex items-center gap-2 text-sm text-muted-foreground">
                      <AlertTriangle className="h-4 w-4" /> Stop Loss
                    </span>
                    <span className="font-bold text-destructive">${signal.stopLoss}</span>
                  </div>
                )}
              </div>
            </div>
            {/* Signal Details */}
            <div className="rounded-lg border bg-card p-4">
              <div className="mb-3 flex items-center gap-2">
                <FileText className="h-4 w-4" />
                <h2 className="font-semibold">Signal Details</h2>
              </div>
              <div className="flex flex-col gap-3">
                <div>
                  <span className="text-muted-foreground">Note</span>
                  <p className="mt-1 text-sm">{signal.note}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
