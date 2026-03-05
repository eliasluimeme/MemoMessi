'use client';

import { useState } from 'react';

import { Plus, DollarSign } from 'lucide-react';

import AddSignalModal from './modals/add-signal-modal';
import { Button } from './ui/button';
import { SidebarTrigger } from './ui/sidebar';

export function SignalsHeader() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  return (
    <div className="flex flex-col gap-6 md:flex-row md:items-end justify-between pb-8 border-b border-border/40">
      <div className="space-y-4 max-w-xl">
        <div className="flex items-center gap-4">
          {/* <SidebarTrigger className="-ml-2 h-10 w-10 rounded-xl border-border/40 bg-secondary/50 hover:bg-secondary transition-colors" /> */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 text-[10px] uppercase tracking-widest font-semibold border border-emerald-500/20">
            <DollarSign className="h-3 w-3" />
            Signal Matrix
          </div>
        </div>
        <h1 className="text-4xl md:text-5xl font-light tracking-tight text-foreground">
          Signal Management
        </h1>
        <p className="text-muted-foreground/60 text-sm font-light tracking-wide leading-relaxed">
          View and manage all active signals, targets, and execution states.
        </p>
      </div>
      <div className="flex shrink-0">
        <Button onClick={() => setIsAddModalOpen(true)} className="w-full sm:w-auto h-12 px-6 rounded-2xl bg-primary text-primary-foreground font-medium text-sm hover:opacity-90 transition-opacity">
          <Plus className="h-4 w-4 mr-2" />
          Add Signal
        </Button>
      </div>
      <AddSignalModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />
    </div>
  );
}
