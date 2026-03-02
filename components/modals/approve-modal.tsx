'use client';

import { useState } from 'react';

import { PlanType } from '@/types/subscription';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface ApproveModalProps {
  isOpen: boolean;
  onClose: () => void;
  userName: string;
  userId: string;
  onSuccess?: () => void;
}

const PLAN_OPTIONS: { label: string; value: PlanType }[] = [
  { label: '1 Month', value: 'ONE_MONTH' },
  { label: '3 Months', value: 'THREE_MONTHS' },
  { label: '6 Months', value: 'SIX_MONTHS' },
  { label: '1 Year', value: 'ONE_YEAR' },
];

export function ApproveModal({ isOpen, onClose, userName, userId, onSuccess }: ApproveModalProps) {
  const [step, setStep] = useState<1 | 2>(1);
  const [selectedPlan, setSelectedPlan] = useState<PlanType>('ONE_MONTH');

  const handleFirstStep = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!selectedPlan) return;
    setStep(2);
  };

  const handleConfirm = async () => {
    if (!selectedPlan) return;
    setStep(1);
    await fetch(`/api/users/subscription`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: userId,
        plan: selectedPlan,
      }),
    })
      .then((res) => {
        if (!res.ok) {
          return res.text().then((text) => {
            throw new Error(text);
          });
        }
        onSuccess?.();
        onClose();
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const handleClose = () => {
    setStep(1);
    setSelectedPlan('ONE_MONTH');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent>
        {step === 1 ? (
          <>
            <DialogHeader>
              <DialogTitle>Update Subscription Plan</DialogTitle>
              <DialogDescription>
                Choose a subscription plan for <b>{userName}</b>
              </DialogDescription>
            </DialogHeader>

            <div className="py-4">
              <Select
                defaultValue={selectedPlan}
                onValueChange={(value) => setSelectedPlan(value as PlanType)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a plan" />
                </SelectTrigger>
                <SelectContent>
                  {PLAN_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button onClick={handleFirstStep} disabled={!selectedPlan}>
                Continue
              </Button>
            </DialogFooter>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Confirm Approval</DialogTitle>
              <DialogDescription>
                Are you sure you want to approve <b>{userName}</b>&#39;s account with a{' '}
                <b>{selectedPlan?.toLowerCase().replace('_', ' ')}</b> subscription plan?
              </DialogDescription>
            </DialogHeader>

            <DialogFooter>
              <Button variant="outline" onClick={() => setStep(1)}>
                Back
              </Button>
              <Button onClick={handleConfirm}>Approve & Update Plan</Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
