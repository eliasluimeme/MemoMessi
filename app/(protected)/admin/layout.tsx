import { cookies } from 'next/headers';

import Sidebar, { SidebarItem } from '@/components/sidebar';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';

const items: SidebarItem[] = [
  {
    label: 'Dashboard',
    path: '/admin',
    iconName: 'BarChart2',
    notifCount: 0,
    activeColor: 'stroke-red-500',
  },
  {
    label: 'User Management',
    path: '/admin/users',
    iconName: 'Users',
    notifCount: 0,
    activeColor: 'stroke-blue-500',
  },
  {
    label: 'Signal Management',
    path: '/admin/signals',
    iconName: 'DollarSign',
    notifCount: 0,
    activeColor: 'stroke-green-500',
  },
  {
    label: 'Telegram',
    path: '/admin/telegram',
    iconName: 'Send',
    notifCount: 0,
    activeColor: 'stroke-purple-500',
  },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const sidebarOpen = cookieStore.get('sidebar:state')?.value === 'true';

  return (
    <SidebarProvider defaultOpen={sidebarOpen}>
      <Sidebar items={items} />
      <SidebarInset className="relative ml-0 overflow-hidden bg-background">
        <div className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] [background-position:calc(50%-1px)_calc(50%-1px)] opacity-[0.03] dark:bg-[radial-gradient(#ffffff_1px,transparent_1px)] transition-all duration-300 mask-image:linear-gradient(to_bottom,white,transparent)"></div>
        <div className="pointer-events-none absolute left-0 right-0 top-0 -z-10 h-[500px] w-full bg-gradient-to-b from-primary/5 via-transparent to-transparent opacity-50 blur-3xl" />

        <div className="relative z-10 flex h-full flex-col">
          <div className="flex flex-1 flex-col gap-4 px-2 py-6 md:p-4 md:py-8">{children}</div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
