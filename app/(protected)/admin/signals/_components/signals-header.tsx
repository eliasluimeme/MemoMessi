'use client';

import { useState } from 'react';

import { PlusIcon } from '@radix-ui/react-icons';

import AddSignalModal from '@/components/modals/add-signal-modal';
import { Button } from '@/components/ui/button';
import { SidebarTrigger } from '@/components/ui/sidebar';

export default function SignalsHeader() {
  const [isAddSignalModalOpen, setIsAddSignalModalOpen] = useState(false);
  return (
    <>
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <SidebarTrigger />
            <h1 className="text-3xl font-bold tracking-tight">Signal Management</h1>
          </div>
          <Button onClick={() => setIsAddSignalModalOpen(true)}>
            <PlusIcon />
            Add New Signal
          </Button>
        </div>
        <p className="mt-2 text-muted-foreground">
          View and manage all signals posted by the community.
        </p>
      </div>

      <AddSignalModal
        isOpen={isAddSignalModalOpen}
        onClose={() => setIsAddSignalModalOpen(false)}
      />
    </>
  );
}
