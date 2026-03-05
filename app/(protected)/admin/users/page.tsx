import { getUserAnalytics } from '@/actions/analytics';
import AnalyticsCards from '@/app/(protected)/admin/_components/analytics-cards';
import { MotionContainer, MotionItem } from '@/components/motion-container';

import { prisma } from '@/lib/prisma';

import UsersTable from './_components/table';
import { UsersHeader } from './_components/users-header';

export const dynamic = 'force-dynamic';

async function getUsers() {
  try {
    const now = new Date();

    // Use a single transaction for atomicity and performance
    return await prisma.$transaction(async (tx) => {
      // Update expired subscriptions in a single query
      await tx.subscription.updateMany({
        where: {
          status: 'ACTIVE',
          expiresAt: {
            lte: now,
          },
          user: {
            role: 'USER',
          },
        },
        data: {
          status: 'EXPIRED',
        },
      });

      // Get users with updated subscription statuses
      return tx.user.findMany({
        where: {
          role: 'USER',
        },
        include: {
          subscriptions: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    throw new Error('Failed to fetch users');
  }
}

export default async function UserManagement() {
  const [users, analytics] = await Promise.all([getUsers(), getUserAnalytics()]);

  return (
    <div className="container mx-auto py-12 px-6 md:px-12 max-w-[1400px]">
      <MotionContainer className="space-y-12">
        <MotionItem>
          <UsersHeader />
        </MotionItem>

        <MotionItem>
          <div className="space-y-3">
            <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">
              User Analytics
            </p>
            <AnalyticsCards analytics={analytics} />
          </div>
        </MotionItem>

        <MotionItem>
          <div className="space-y-3">
            <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">
              Operator Registry
            </p>
            <UsersTable users={users} />
          </div>
        </MotionItem>
      </MotionContainer>
    </div>
  );
}
