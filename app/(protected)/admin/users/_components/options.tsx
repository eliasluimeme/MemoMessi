'use client';

import { useState } from 'react';

import { PlanType } from '@/types/subscription';
import { TUser } from '@/types/user';
import { formatDistanceToNow } from 'date-fns';
import { MoreHorizontal, Pencil } from 'lucide-react';
import { toast } from 'react-hot-toast';

import { CopyText } from '@/components/copyText';
import { ConfirmationModal } from '@/components/modals/confirmation-modal';
import { EditUserModal } from '@/components/modals/edit-user-modal';
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

interface OptionsProps {
  user: TUser;
}

const plan = {
  ONE_MONTH: '1 Month',
  THREE_MONTHS: '3 Months',
  SIX_MONTHS: '6 Months',
  ONE_YEAR: '1 Year',
};

export default function Options({ user }: OptionsProps) {
  const [showSuspendModal, setShowSuspendModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const handleSuspendUser = async (suspend: string) => {
    try {
      const response = await fetch('/api/users/suspend', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          suspend: suspend === 'SUSPENDED' ? 'ACTIVE' : 'SUSPENDED',
        }),
      });

      if (!response.ok) {
        toast.error('Failed to suspend user');
        throw new Error('Failed to suspend user');
      }

      const data = await response.json();
      if (data.status === 'SUSPENDED') {
        toast.success('User suspended successfully');
      } else {
        toast.success('User reactivated successfully');
      }

      setShowSuspendModal(false);
    } catch (error) {
      console.error('Error suspending user:', error);
    }
  };

  return (
    <>
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="sm">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </SheetTrigger>
        <SheetContent
          className="flex flex-col overflow-y-auto"
          aria-describedby="user-details-description"
        >
          <SheetHeader className="space-y-1">
            <SheetTitle className="text-xl font-semibold">User Details</SheetTitle>
            <SheetDescription />
            <div className="flex items-center gap-2">
              <CopyText text={user.id} displayText={`id: #${user.id.slice(0, 8)}...`} />
              <Badge variant={user.verified ? 'success' : 'destructive'}>
                {user.verified ? 'Verified' : 'Unverified'}
              </Badge>
            </div>
          </SheetHeader>

          <div className="mt-4 space-y-6">
            <Card className="p-4 shadow-none">
              <h3 className="mb-4 text-sm font-semibold">Personal Information</h3>
              <div className="space-y-3">
                <div className="grid grid-cols-3 items-center">
                  <span className="text-sm text-muted-foreground">Full Name</span>
                  <span className="col-span-2 text-right text-sm font-medium">{user.fullName}</span>
                </div>
                <Separator />
                <div className="grid grid-cols-3 items-center">
                  <span className="text-sm text-muted-foreground">Email</span>
                  <span className="col-span-2 text-right text-sm font-medium">{user.email}</span>
                </div>
                {/* <Separator />
                <div className="grid grid-cols-3 items-center">
                  <span className="text-sm text-muted-foreground">Phone</span>
                  <span className="col-span-2 text-right text-sm font-medium">
                    {user.phoneNumber}
                  </span>
                </div> */}
                <Separator />
                <div className="grid grid-cols-3 items-center">
                  <span className="text-sm text-muted-foreground">Member Since</span>
                  <div className="col-span-2 flex flex-col justify-end">
                    <div className="text-right text-sm font-medium">
                      {new Date(user.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </div>
                    <span className="text-right text-xs text-muted-foreground">
                      {formatDistanceToNow(user.createdAt, { addSuffix: true })}
                    </span>
                  </div>
                </div>
              </div>
            </Card>

            {user.subscriptions ? (
              <Card className="p-4 shadow-none">
                <h3 className="mb-4 text-sm font-semibold">Subscription Details</h3>
                <div className="space-y-3">
                  <div className="grid grid-cols-3 items-center">
                    <span className="text-sm text-muted-foreground">Plan</span>
                    <div className="col-span-2 flex justify-end">
                      <Badge variant="secondary" className="w-fit">
                        {plan[user.subscriptions.plan as PlanType]}
                      </Badge>
                    </div>
                  </div>
                  <Separator />
                  <div className="grid grid-cols-3 items-center">
                    <span className="text-sm text-muted-foreground">Status</span>
                    <div className="col-span-2 flex justify-end">
                      <Badge
                        variant={user.subscriptions.status === 'ACTIVE' ? 'success' : 'warning'}
                        className="w-fit"
                      >
                        {user.subscriptions.status}
                      </Badge>
                    </div>
                  </div>
                  <Separator />
                  <div className="grid grid-cols-3 items-center">
                    <span className="text-sm text-muted-foreground">Expires</span>
                    <div className="col-span-2 flex items-start justify-end gap-2">
                      <div className="space-y-1 text-right">
                        <div className="text-sm font-medium">
                          {new Date(user.subscriptions.expiresAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {formatDistanceToNow(new Date(user.subscriptions.expiresAt), {
                            addSuffix: true,
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ) : (
              <Card className="p-4 shadow-none border-amber-500/20 bg-amber-500/[0.03]">
                <h3 className="mb-3 text-sm font-semibold">Subscription</h3>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Tier</span>
                  <Badge variant="secondary" className="bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
                    Free Tier
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground/60 mt-3">
                  This user has no active subscription. Use &quot;Give VIP&quot; to upgrade them.
                </p>
              </Card>
            )}
          </div>

          <SheetFooter className="mt-auto">
            <div className="flex w-full flex-col gap-2">
              <Button onClick={() => setShowEditModal(true)}>
                <Pencil /> Edit User
              </Button>
              {user.subscriptions?.status !== 'SUSPENDED' && (
                <Button variant="destructive" onClick={() => setShowSuspendModal(true)}>
                  Suspend User
                </Button>
              )}
              {user.subscriptions?.status === 'SUSPENDED' && (
                <Button variant="destructive" onClick={() => setShowSuspendModal(true)}>
                  Reactivate User
                </Button>
              )}
            </div>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      {user.subscriptions?.status === 'ACTIVE' ? (
        <ConfirmationModal
          isOpen={showSuspendModal}
          onClose={() => setShowSuspendModal(false)}
          onConfirm={() => handleSuspendUser(user.subscriptions?.status ?? 'ACTIVE')}
          title="Suspend User"
          description={`Are you sure you want to suspend ${user.fullName}'s account? This action can be reversed later.`}
          confirmText="Suspend"
          cancelText="Cancel"
        />
      ) : (
        <ConfirmationModal
          isOpen={showSuspendModal}
          onClose={() => setShowSuspendModal(false)}
          onConfirm={() => handleSuspendUser(user.subscriptions?.status ?? 'ACTIVE')}
          title="Reactivate User"
          description={`Are you sure you want to reactivate ${user.fullName}'s account? This action can be reversed later.`}
          confirmText="Reactivate"
          cancelText="Cancel"
        />
      )}

      <EditUserModal isOpen={showEditModal} onClose={() => setShowEditModal(false)} user={user} />
    </>
  );
}
