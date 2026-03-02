'use client';

import { useState } from 'react';

import { Loader2, Lock } from 'lucide-react';

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/toast-context';

interface CloseSignalModalProps {
  isOpen: boolean;
  onClose: () => void;
  signalId: string;
  onSuccess: () => void;
}

export function CloseSignalModal({ isOpen, onClose, signalId, onSuccess }: CloseSignalModalProps) {
  const [isClosing, setIsClosing] = useState(false);
  const { toast } = useToast();

  const handleClose = async () => {
    setIsClosing(true);
    try {
      const response = await fetch(`/api/signals/${signalId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'CLOSED' }),
      });

      if (!response.ok) {
        throw new Error('Failed to close signal');
      }

      toast({
        title: 'Success',
        description: 'Signal closed successfully',
      });
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error closing signal:', error);
      toast({
        title: 'Error',
        description: 'Failed to close signal',
        variant: 'destructive',
      });
    } finally {
      setIsClosing(false);
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Close Signal</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to close this signal? This action will mark the signal as
            completed and it won&apos;t receive any further updates.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isClosing}>Cancel</AlertDialogCancel>
          <Button onClick={handleClose} disabled={isClosing}>
            {isClosing ? (
              <>
                <Loader2 className="mr-2 size-4 animate-spin" />
                Closing...
              </>
            ) : (
              <>
                <Lock className="mr-2 size-4" />
                Close Signal
              </>
            )}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
