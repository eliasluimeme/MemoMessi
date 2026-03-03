'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { useLogout } from '@/hooks/useLogout';
import * as LucideIcons from 'lucide-react';
import { LogOut, LucideIcon } from 'lucide-react';

import ThemeToggler from '@/components/theme-toggler';
import { Badge } from '@/components/ui/badge';
import {
  Sidebar as ShadcnSidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';

import { cn } from '@/lib/utils';
// triggered refresh

export interface SidebarItem {
  iconName: keyof typeof LucideIcons;
  label: string;
  path: string;
  notifCount: number;
  activeColor: string;
}

export default function Sidebar({ items }: { items: SidebarItem[] }) {
  const pathname = usePathname();
  const { logout } = useLogout();
  const { setOpenMobile } = useSidebar();

  const handleItemClick = () => {
    setOpenMobile(false);
  };

  return (
    <ShadcnSidebar variant="inset" collapsible="icon" className="border-none bg-transparent">
      <SidebarHeader className="py-8">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              asChild
              className="group-data-[collapsible=icon]:px-0"
            >
              <Link href="/dashboard" onClick={handleItemClick} className="flex items-center gap-4">
                <div className="relative h-10 w-10 flex-shrink-0">
                  {/* <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full opacity-50" /> */}
                  <Image src="/logo.png" alt="MemoMessi" width={90} height={90} className="relative z-10 rounded-xl" />
                </div>
                <div className="flex flex-col group-data-[collapsible=icon]:hidden space-y-1">
                  <span className="text-[11px] font-black tracking-[0.4em] uppercase leading-none text-foreground">MemoMessi</span>
                  <span className="text-micro text-primary/40 uppercase tracking-[0.2em]">Live Terminal</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className="px-3">
        <SidebarMenu className="gap-2">
          {items.map((item) => {
            const isActive = pathname === item.path;
            const Icon = LucideIcons[item.iconName] as LucideIcon;

            return (
              <SidebarMenuItem key={item.path}>
                <SidebarMenuButton
                  size="lg"
                  tooltip={item.label}
                  isActive={isActive}
                  asChild
                  className={cn(
                    "transition-all duration-500 rounded-2xl px-4 group-data-[collapsible=icon]:px-0",
                    isActive ? "bg-white/[0.04] text-foreground" : "text-muted-foreground/40 hover:text-foreground hover:bg-white/[0.02]"
                  )}
                >
                  <Link
                    href={item.path}
                    onClick={handleItemClick}
                    className="flex items-center gap-4 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:gap-0 group-data-[collapsible=icon]:w-full"
                  >
                    <div className="relative flex items-center justify-center flex-shrink-0">
                      {isActive && (
                        <div className="absolute -left-2 h-1 w-1 rounded-full bg-primary shadow-[0_0_8px_rgba(var(--primary),0.8)] group-data-[collapsible=icon]:hidden" />
                      )}
                      <Icon className={cn(
                        "h-5 w-5 transition-all duration-500",
                        isActive ? "text-primary fill-primary/10" : "text-inherit"
                      )} />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] group-data-[collapsible=icon]:hidden">
                      {item.label}
                    </span>
                    {item.notifCount > 0 && (
                      <div className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-primary/10 px-1 text-[10px] font-black text-primary group-data-[collapsible=icon]:hidden">
                        {item.notifCount}
                      </div>
                    )}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="p-4 mt-auto group-data-[collapsible=icon]:px-0 group-data-[collapsible=icon]:pb-4">
        <div className="flex flex-col gap-2 rounded-[28px] dark:bg-white/[0.02] dark:border-white/[0.03] bg-muted/30 border border-border/40 p-2">
          <ThemeToggler />
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                size="lg"
                tooltip="Logout"
                className="rounded-2xl text-muted-foreground/40 hover:text-red-400 hover:bg-red-400/5 transition-all duration-500 group-data-[collapsible=icon]:justify-center"
              >
                <button
                  onClick={() => {
                    handleItemClick();
                    logout({ redirectUrl: '/' });
                  }}
                  className="flex items-center gap-4 px-4 group-data-[collapsible=icon]:px-0"
                >
                  <LogOut className="h-5 w-5 shrink-0" />
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] group-data-[collapsible=icon]:hidden">
                    Logout
                  </span>
                </button>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </div>
      </SidebarFooter>
    </ShadcnSidebar>
  );
}
