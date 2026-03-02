'use client';

import { useState } from 'react';

import { PlanType } from '@/types/subscription';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface UpdatePlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (plan: PlanType) => void;
  currentPlan: PlanType;
  userName: string;
}

const PLAN_OPTIONS: { label: string; value: PlanType }[] = [
  { label: '1 Month', value: 'ONE_MONTH' },
  { label: '3 Months', value: 'THREE_MONTHS' },
  { label: '6 Months', value: 'SIX_MONTHS' },
  { label: '1 Year', value: 'ONE_YEAR' },
];

export function UpdatePlanModal({
  isOpen,
  onClose,
  onConfirm,
  currentPlan,
  userName,
}: UpdatePlanModalProps) {
  const [selectedPlan, setSelectedPlan] = useState<PlanType>(currentPlan);

  const handleConfirm = () => {
    onConfirm(selectedPlan);
    onClose();
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Update Subscription Plan</AlertDialogTitle>
          <AlertDialogDescription>
            Choose a new subscription plan for <b>{userName}</b>. Current plan:{' '}
            {currentPlan.replace('_', ' ')}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="py-4">
          <Select
            value={selectedPlan}
            onValueChange={(value) => setSelectedPlan(value as PlanType)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a new plan" />
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

        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleConfirm} className="bg-primary hover:bg-primary/90">
            Update Plan
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
