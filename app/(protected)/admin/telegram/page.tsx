import { getTelegramAnalytics } from '@/actions/analytics';
import AnalyticsCards from '@/app/(protected)/admin/_components/analytics-cards';
import { MotionContainer, MotionItem } from '@/components/motion-container';
import { AnalyticsCard } from '@/types/actions/analytics';

import { BroadcastForm } from './_components/broadcast-form';
import { TelegramHeader } from './_components/telegram-header';

export const dynamic = 'force-dynamic';

export default async function TelegramPage() {
  let analytics: Record<string, AnalyticsCard>;
  try {
    analytics = await getTelegramAnalytics();
  } catch {
    analytics = {
      totalLinkedUsers: {
        title: 'Total Linked Users',
        metric: '0',
        trend: { value: 0, label: 'from last month' },
        icon: 'Users',
      },
      activeLinkedUsers: {
        title: 'Active Linked Users',
        metric: '0',
        trend: { value: 0, label: 'from last month' },
        icon: 'UserCheck',
      },
      unlinkedUsers: {
        title: 'Unlinked Users',
        metric: '0',
        trend: { value: 0, label: 'from last month' },
        icon: 'UserX',
      },
      linkRatio: {
        title: 'Link Ratio',
        metric: '0%',
        trend: { value: 0, label: 'from last month' },
        icon: 'Percent',
      },
    } as Record<string, AnalyticsCard>;
  }

  return (
    <div className="container mx-auto py-12 px-6 md:px-12 max-w-[1400px]">
      <MotionContainer className="space-y-12">
        <MotionItem>
          <TelegramHeader />
        </MotionItem>

        <MotionItem>
          <div className="space-y-3">
            <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">
              Network Analytics
            </p>
            <AnalyticsCards analytics={analytics} />
          </div>
        </MotionItem>

        <MotionItem>
          <div className="space-y-3">
            <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">
              Broadcast Terminal
            </p>
            <BroadcastForm />
          </div>
        </MotionItem>
      </MotionContainer>
    </div>
  );
}
