'use client';

import { useState } from 'react';

import { SignalWithTargets } from '@/types/signal';
import { formatDistanceToNow } from 'date-fns';
import { Lock, MoreHorizontal, Pencil, Trash } from 'lucide-react';

import { CopyText } from '@/components/copyText';
import { CloseSignalModal } from '@/components/modals/close-signal-modal';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

// import SignalGains from './SignalGains';

interface SignalDetailsSheetProps {
  signal: SignalWithTargets;
  onEditClick: () => void;
  onDeleteClick: () => void;
}

const status = {
  WITHIN_ENTRY_ZONE: 'Entry Zone',
  TP1: 'TP1',
  TP2: 'TP2',
  TP3: 'TP3',
  TP4: 'TP4',
  TP5: 'TP5',
  TP6: 'TP6',
  TP7: 'TP7',
  TP8: 'TP8',
  TP9: 'TP9',
  TP10: 'TP10',
  CLOSED: 'Closed',
};

export function SignalDetailsSheet({
  signal,
  onEditClick,
  onDeleteClick,
}: SignalDetailsSheetProps) {
  const [isCloseModalOpen, setIsCloseModalOpen] = useState(false);

  const handleSignalClosed = () => {
    window.location.reload();
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="sm">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </SheetTrigger>
      <SheetContent className="flex flex-col overflow-y-auto">
        <SheetHeader className="space-y-2">
          <SheetTitle className="flex items-center gap-1 text-xl font-semibold">
            {signal.pair}
          </SheetTitle>
          <SheetDescription className="flex flex-wrap items-center gap-2">
            <CopyText text={signal.id} displayText={`id: #${signal.id.slice(0, 8)}...`} />
            <Badge variant="secondary" className="w-fit">
              {status[signal.status]}
            </Badge>
          </SheetDescription>
        </SheetHeader>

        <div className="mt-8 space-y-4">
          {/* Price Levels Card */}
          <Card className="p-4 shadow-none">
            <h3 className="mb-4 text-sm font-semibold">Price Levels</h3>
            <div className="space-y-3">
              <div className="grid grid-cols-3 items-center">
                <span className="text-sm text-muted-foreground">Entry Zone</span>
                <span className="col-span-2 text-right text-sm font-medium">
                  {signal.entryZone}
                </span>
              </div>
              <Separator />
              <div className="grid grid-cols-3 items-center">
                <span className="text-sm text-muted-foreground">Stop Loss</span>
                <span className="col-span-2 text-right text-sm font-medium">
                  {signal.stopLoss || 'N/A'}
                </span>
              </div>
              <Separator />
              <div className="grid grid-cols-3 items-center">
                <span className="text-sm text-muted-foreground">Take Profit Targets</span>
                <div className="col-span-2 flex justify-end gap-2">
                  <div className="flex flex-col text-right text-sm font-medium">
                    {signal.targets.map((target) => (
                      <span key={target.id}>{target.price}$</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Performance Card */}
          <Card className="p-4 shadow-none">
            <h3 className="mb-4 text-sm font-semibold">Performance</h3>
            <div className="space-y-3">
              <div className="grid grid-cols-3 items-center">
                <span className="text-sm text-muted-foreground">Current Gains</span>
                <div className="col-span-2 flex justify-end">
                  <Badge
                    variant={signal.targets.every((target) => target.hit) ? 'success' : 'secondary'}
                    className="w-fit text-nowrap"
                  >
                    {signal.targets.every((target) => target.hit)
                      ? 'All targets hit'
                      : 'Not all targets hit'}
                  </Badge>
                </div>
              </div>
              <Separator />
              <div className="grid grid-cols-3 items-center">
                <span className="text-sm text-muted-foreground">Created</span>
                <div className="col-span-2 space-y-1 text-right">
                  <div className="text-sm font-medium">
                    {new Date(signal.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(signal.createdAt), { addSuffix: true })}
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {signal.note && (
            <Card className="p-4 shadow-none">
              <h3 className="mb-4 text-sm font-semibold">Note</h3>
              <div className="space-y-2">
                <p className="break-words text-sm text-muted-foreground">{signal.note}</p>
              </div>
            </Card>
          )}
        </div>

        <SheetFooter className="mt-auto">
          <div className="flex w-full flex-col gap-2">
            {signal.status !== 'CLOSED' && (
              <Button onClick={onEditClick}>
                <Pencil />
                Edit Signal
              </Button>
            )}
            <Button
              disabled={signal.status === 'CLOSED'}
              onClick={() => setIsCloseModalOpen(true)}
              variant="secondary"
            >
              <Lock />
              {signal.status === 'CLOSED' ? 'Closed' : 'Close Signal'}
            </Button>
            <Button variant="destructive" onClick={onDeleteClick}>
              <Trash />
              Delete Signal
            </Button>
          </div>
        </SheetFooter>

        <CloseSignalModal
          isOpen={isCloseModalOpen}
          onClose={() => setIsCloseModalOpen(false)}
          signalId={signal.id}
          onSuccess={handleSignalClosed}
        />
      </SheetContent>
    </Sheet>
  );
}
