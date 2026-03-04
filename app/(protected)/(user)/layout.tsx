import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import Sidebar, { SidebarItem } from '@/components/sidebar';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { getSession } from '@/lib/auth-utils';

export const dynamic = 'force-dynamic';

import Navbar from './_components/navbar';

const items: SidebarItem[] = [
  {
    iconName: 'BarChart2',
    label: 'Dashboard',
    path: '/dashboard',
    notifCount: 0,
    activeColor: ' fill-current text-red-500',
  },
  {
    iconName: 'Zap',
    label: 'Signals',
    path: '/signals',
    notifCount: 0,
    activeColor: ' fill-current text-blue-500',
  },
  {
    iconName: 'Star',
    label: 'Favorites',
    path: '/favorites',
    notifCount: 0,
    activeColor: ' fill-current text-yellow-500',
  }
  // {
  //   iconName: 'BookOpenText',
  //   label: 'Academy',
  //   path: '/academy',
  //   notifCount: 0,
  //   activeColor: 'stroke-emerald-500',
  // },
];

export default async function AuthenticatedLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();

  if (!session) {
    redirect('/login');
  }

  const cookieStore = await cookies();
  const sidebarOpen = cookieStore.get('sidebar:state')?.value === 'true';

  return (
    <SidebarProvider defaultOpen={sidebarOpen}>
      <Sidebar items={items} />
      <SidebarInset className="relative ml-0 overflow-hidden bg-background">
        {/* Superior Minimalist Background */}
        <div className="pointer-events-none absolute inset-0 z-0 bg-grid-white opacity-[0.02]" />

        {/* Animated Accent Glows */}
        <div className="pointer-events-none absolute -top-[40%] -left-[10%] h-[1000px] w-[1000px] rounded-full bg-primary/5 blur-[120px] animate-float opacity-30" />
        <div className="pointer-events-none absolute -bottom-[40%] -right-[10%] h-[1000px] w-[1000px] rounded-full bg-blue-500/5 blur-[120px] animate-float opacity-30" style={{ animationDelay: '-5s' }} />

        <div className="relative z-10 flex h-full flex-col">
          <Navbar />
          <div className="flex flex-1 flex-col gap-4 px-2 py-6 md:p-4 md:py-8">{children}</div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

// deployment commit
