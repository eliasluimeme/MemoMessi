'use client';

import { useEffect, useState } from 'react';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';

import { SidebarMenuButton } from './ui/sidebar';

export default function ThemeToggler() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;
  return (
    <SidebarMenuButton
      size="lg"
      tooltip={theme === 'light' ? 'Dark Mode' : 'Light Mode'}
      onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
      className="rounded-2xl transition-all duration-500 text-muted-foreground/40 hover:text-foreground hover:bg-white/[0.02]"
    >
      <div className="flex items-center gap-4 px-2">
        {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
        <span className="text-[10px] font-black uppercase tracking-[0.2em] group-data-[collapsible=icon]:hidden">
          {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
        </span>
      </div>
    </SidebarMenuButton>
  );
}
