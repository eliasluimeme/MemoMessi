'use client';

import { useState } from 'react';

import { Plus, Users } from 'lucide-react';

import { Button } from '@/components/button';
import AddUserModal from '@/components/modals/add-user-modal';
import { SidebarTrigger } from '@/components/ui/sidebar';

export function UsersHeader() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  return (
    <div className="flex flex-col gap-6 md:flex-row md:items-end justify-between pb-8 border-b border-border/40">
      <div className="space-y-4 max-w-xl">
        <div className="flex items-center gap-4">
          {/* <SidebarTrigger className="-ml-2 h-10 w-10 rounded-xl border-border/40 bg-secondary/50 hover:bg-secondary transition-colors" /> */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-500 text-[10px] uppercase tracking-widest font-semibold border border-blue-500/20">
            <Users className="h-3 w-3" />
            Operator Matrix
          </div>
        </div>
        <h1 className="text-4xl md:text-5xl font-light tracking-tight text-foreground">
          User Management
        </h1>
        <p className="text-muted-foreground/60 text-sm font-light tracking-wide leading-relaxed">
          View and manage all operator accounts and subscription authorization states.
        </p>
      </div>
      <div className="flex shrink-0">
        <Button onClick={() => setIsAddModalOpen(true)} className="w-full sm:w-auto h-12 px-6 rounded-2xl bg-primary text-primary-foreground font-medium text-sm hover:opacity-90 transition-opacity">
          <Plus className="h-4 w-4 mr-2" />
          Add User
        </Button>
      </div>
      <AddUserModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />
    </div>
  );
}
