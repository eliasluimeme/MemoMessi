'use client';

import Image from 'next/image';
import Link from 'next/link';

import { useLogout } from '@/hooks/useLogout';
import useUserStore from '@/store/user';
import { LogOut, Settings, User } from 'lucide-react';

import LanguageSelector from '@/components/language-selector';
import { Search } from '@/components/search';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Skeleton } from '@/components/ui/skeleton';

export function Navbar() {
  const { logout } = useLogout();
  const user = useUserStore((state) => state.user);

  return (
    <header className="sticky top-0 z-50 flex h-20 shrink-0 items-center justify-between bg-transparent px-8 transition-all duration-300">
      <div className="flex items-center gap-6">
        <SidebarTrigger className="-ml-2 h-10 w-10 text-muted-foreground/40 hover:text-foreground transition-all duration-500" />
        <Link href="/dashboard" className="md:hidden">
          <div className="flex items-center gap-2">
            <Image src="/logo.png" alt="MemoMessi" width={32} height={32} className="h-8 w-8" />
          </div>
        </Link>
        <div className="hidden md:block">
          <Search />
        </div>
      </div>
      <nav className="flex items-center gap-4">
        <div className="flex items-center gap-4 md:hidden">
          <Search />
        </div>
        <div className="h-8 w-px bg-white/[0.03] mx-2 hidden md:block" />
        <LanguageSelector />
        {user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-3 p-1 rounded-2xl hover:bg-white/[0.02] transition-all duration-500 group">
                <Avatar className="h-9 w-9 border border-white/[0.05] ring-1 ring-white/[0.05] ring-offset-2 ring-offset-background transition-all group-hover:ring-primary/20">
                  <AvatarImage src={user.image || ''} alt="Profile" />
                  <AvatarFallback className="bg-primary/10 text-primary font-black text-xs uppercase tracking-tighter">
                    {user.fullName?.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden md:flex flex-col items-start leading-none group-hover:translate-x-1 transition-transform">
                  <span className="text-[11px] font-black uppercase tracking-widest">{user.fullName}</span>
                  <span className="text-[9px] font-bold text-muted-foreground/40 uppercase tracking-[0.2em] mt-1">Operator</span>
                </div>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64 rounded-[28px] border-white/[0.05] bg-background/80 backdrop-blur-3xl p-2 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.8)]">
              <div className="px-4 py-3 border-b border-white/[0.03] mb-1">
                <span className="text-[9px] font-black uppercase tracking-[0.4em] text-muted-foreground/20">Account Controls</span>
              </div>
              <DropdownMenuItem asChild className="rounded-2xl p-3 focus:bg-white/[0.03] transition-colors">
                <Link href="/profile" className="flex items-center gap-3 cursor-pointer">
                  <User className="h-4 w-4 text-muted-foreground/40" />
                  <span className="text-[11px] font-black uppercase tracking-widest">Personal Profile</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className="rounded-2xl p-3 focus:bg-white/[0.03] transition-colors">
                <Link href="/settings" className="flex items-center gap-3 cursor-pointer">
                  <Settings className="h-4 w-4 text-muted-foreground/40" />
                  <span className="text-[11px] font-black uppercase tracking-widest">System Settings</span>
                </Link>
              </DropdownMenuItem>
              <div className="h-px bg-white/[0.03] my-1" />
              <DropdownMenuItem
                onClick={() => logout({ redirectUrl: '/' })}
                className="rounded-2xl p-3 text-red-400 focus:bg-red-400/5 focus:text-red-400 transition-colors cursor-pointer"
              >
                <LogOut className="h-4 w-4 mr-3" />
                <span className="text-[11px] font-black uppercase tracking-widest">Terminate Session</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <div className="flex items-center gap-3">
            <Skeleton className="h-9 w-9 rounded-full bg-white/[0.02]" />
            <Skeleton className="hidden h-4 w-24 rounded-full bg-white/[0.02] md:inline" />
          </div>
        )}
      </nav>
    </header>
  );
}

export default Navbar;
