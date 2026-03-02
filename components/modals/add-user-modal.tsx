'use client';

import { useState } from 'react';

import { PlanType } from '@/types/subscription';
import { toast } from 'react-hot-toast';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { cn } from '@/lib/utils';

interface AddUserModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface UserFormData {
  fullName: string;
  email: string;
  phoneNumber: string;
  password: string;
  plan: PlanType;
  expiresAt: string;
}

const initialUserFormState: UserFormData = {
  fullName: '',
  email: '',
  phoneNumber: '',
  password: '',
  plan: 'ONE_MONTH',
  expiresAt: (() => {
    const date = new Date();
    date.setMonth(date.getMonth() + 1);
    return date.toISOString().split('T')[0];
  })(),
};

// TODO: Add form validation and error display

export default function AddUserModal({ isOpen, onClose }: AddUserModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<UserFormData>(initialUserFormState);

  const calculateExpiryDate = (plan: PlanType): string => {
    const now = new Date();
    switch (plan) {
      case 'THREE_MONTHS':
        now.setMonth(now.getMonth() + 3);
        break;
      case 'SIX_MONTHS':
        now.setMonth(now.getMonth() + 6);
        break;
      case 'ONE_YEAR':
        now.setFullYear(now.getFullYear() + 1);
        break;
      default:
        now.setMonth(now.getMonth() + 1);
    }
    return now.toISOString().split('T')[0];
  };

  const handleInputChange = (field: keyof UserFormData, value: string) => {
    setFormData((prev) => {
      const updatedData = { ...prev, [field]: value };

      if (field === 'plan') updatedData.expiresAt = calculateExpiryDate(value as PlanType);

      if (field === 'expiresAt') {
        const date = new Date(value);
        if (!isNaN(date.getTime())) updatedData.expiresAt = date.toISOString().split('T')[0];
      }

      return updatedData;
    });
  };

  const handleSubmit = async () => {
    try {
      setIsLoading(true);

      const response = await fetch('/api/users/adduser', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          password: formData.password,
          subscription: {
            plan: formData.plan,
            status: 'ACTIVE',
            expiresAt: formData.expiresAt,
          },
        }),
      });

      if (!response.ok) throw new Error('Failed to add user');

      toast.success('User added successfully');
      setFormData(initialUserFormState);
      onClose();
      window.location.reload();
    } catch (error) {
      console.error('Error adding user:', error);
      toast.error('Failed to add user');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add User</DialogTitle>
          <DialogDescription>Add a new user to the system</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4 py-4">
          <div className="space-y-4">
            <div className="flex flex-col gap-2">
              <label htmlFor="fullName" className="text-sm font-medium">
                Full Name
              </label>
              <Input
                id="fullName"
                value={formData.fullName}
                onChange={(e) => handleInputChange('fullName', e.target.value)}
                disabled={isLoading}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email
              </label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                disabled={isLoading}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="phone" className="text-sm font-medium">
                Phone Number
              </label>
              <Input
                id="phone"
                value={formData.phoneNumber}
                onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                disabled={isLoading}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="password" className="text-sm font-medium">
                Password
              </label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                disabled={isLoading}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="plan" className="text-sm font-medium">
                Subscription Plan
              </label>
              <Select
                value={formData.plan}
                onValueChange={(value) => handleInputChange('plan', value)}
                disabled={isLoading}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ONE_MONTH">1 Month</SelectItem>
                  <SelectItem value="THREE_MONTHS">3 Months</SelectItem>
                  <SelectItem value="SIX_MONTHS">6 Months</SelectItem>
                  <SelectItem value="ONE_YEAR">1 Year</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="expiryDate" className="text-sm font-medium">
                Expiry Date
              </label>
              <Input
                type="date"
                id="expiryDate"
                className={cn(
                  'cursor-pointer',
                  '[&::-webkit-calendar-picker-indicator]:w-full',
                  '[&::-webkit-calendar-picker-indicator]:bg-transparent',
                  '[&::-webkit-calendar-picker-indicator]:cursor-pointer',
                  '[&::-webkit-calendar-picker-indicator]:absolute',
                  '[&::-webkit-calendar-picker-indicator]:opacity-0',
                )}
                value={formData.expiresAt}
                onChange={(e) => handleInputChange('expiresAt', e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                disabled={isLoading}
              />
            </div>
          </div>
        </div>
        <DialogFooter className="flex gap-2">
          <Button type="button" variant="secondary" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button type="button" onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? 'Adding...' : 'Add User'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
