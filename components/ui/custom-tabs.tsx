'use client';

import { useState } from 'react';

import { Card, CardContent } from '@/components/ui/card';

interface TabsProps {
  defaultTab: string;
  tabs: {
    value: string;
    label: string;
    content: React.ReactNode;
  }[];
}

export function CustomTabs({ defaultTab, tabs }: TabsProps) {
  const [activeTab, setActiveTab] = useState(defaultTab);

  return (
    <Card>
      <div className="border-b px-6 pt-6">
        <div className="flex gap-1">
          {tabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setActiveTab(tab.value)}
              className={`relative -mb-[1px] rounded-t-lg px-4 py-2 text-sm font-medium transition-all ${
                activeTab === tab.value
                  ? 'border border-b-0 border-border bg-background text-foreground'
                  : 'text-muted-foreground hover:bg-muted'
              } `}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
      <CardContent>{tabs.find((tab) => tab.value === activeTab)?.content}</CardContent>
    </Card>
  );
}
