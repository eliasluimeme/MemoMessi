import { useState } from 'react';

import { useRouter } from 'next/navigation';

import { PlanType } from '@/types/subscription';
import { TUser } from '@/types/user';
import { $Enums } from '@prisma/client';
type SubscriptionStatus = $Enums.SubscriptionStatus;

import { ApproveModal } from '@/components/modals/approve-modal';
import { Button } from '@/components/ui/button';

import Options from './options';

export default function UsersTableActions({ user }: { user: TUser }) {
  const [showApproveModal, setShowApproveModal] = useState(false);
  const router = useRouter();

  const handleApproveSuccess = () => {
    setShowApproveModal(false);
    router.refresh();
  };

  const noSubscription = !user.subscriptions;

  return (
    <>
      <div className="flex justify-end gap-2">
        {/* Free tier — no subscription yet */}
        {noSubscription && (
          <Button variant="outline" size="sm" onClick={() => setShowApproveModal(true)}>
            Give VIP
          </Button>
        )}
        {user.subscriptions?.status === 'PENDING' && (
          <Button variant="outline" size="sm" onClick={() => setShowApproveModal(true)}>
            Approve
          </Button>
        )}
        {user.subscriptions?.status === 'SUSPENDED' && (
          <Button variant="outline" size="sm" onClick={() => setShowApproveModal(true)}>
            Reactivate
          </Button>
        )}
        {user.subscriptions?.status === 'EXPIRED' && (
          <Button variant="outline" size="sm" onClick={() => setShowApproveModal(true)}>
            Upgrade
          </Button>
        )}
        <Options user={user} />
      </div>

      <ApproveModal
        isOpen={showApproveModal}
        onClose={() => setShowApproveModal(false)}
        userName={user.fullName}
        userId={user.id}
        onSuccess={handleApproveSuccess}
      />
    </>
  );
}

export function UserStatusBadge({ status }: { status?: SubscriptionStatus }) {
  if (!status) {
    return (
      <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
        Free
      </span>
    );
  }
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
        status === 'ACTIVE'
          ? 'bg-green-100 text-green-800'
          : status === 'PENDING'
            ? 'bg-yellow-100 text-yellow-800'
            : 'bg-red-100 text-red-800'
      }`}
    >
      {status}
    </span>
  );
}

export function PlanBadge({ plan }: { plan?: PlanType }) {
  if (!plan) return <span className="text-xs text-muted-foreground/50">—</span>;
  return (
    <span>
      {plan === 'ONE_MONTH' && '1 Month'}
      {plan === 'THREE_MONTHS' && '3 Months'}
      {plan === 'SIX_MONTHS' && '6 Months'}
      {plan === 'ONE_YEAR' && '1 Year'}
    </span>
  );
}
