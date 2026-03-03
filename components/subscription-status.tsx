import { cookies } from 'next/headers';
import Link from 'next/link';

import { PlanType } from '@/types/subscription';
import { jwtVerify } from 'jose';
import { Crown } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import { prisma } from '@/lib/prisma';

const plan: Record<PlanType, string> = {
  ONE_MONTH: '1 Month',
  THREE_MONTHS: '3 Months',
  SIX_MONTHS: '6 Months',
  ONE_YEAR: '1 Year',
} as const;

export async function SubscriptionStatus() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  if (!token) {
    return null;
  }

  const { payload } = await jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET!));

  const userId = payload.id as string;

  console.log('User ID', userId);

  const subscription = await prisma.subscription.findFirst({
    where: {
      userId,
    },
    orderBy: {
      createdAt: 'desc',
    },
    select: {
      id: true,
      status: true,
      plan: true,
      expiresAt: true,
    },
  });

  if (!subscription) {
    console.log('No subscription found', subscription);
    return null;
  }

  return (
    <Card className="card-hover">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Subscription</CardTitle>
        <Crown className="h-4 w-4 text-yellow-500" />
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex items-center justify-between">
          <span className="text-2xl font-bold">{plan[subscription.plan as PlanType]}</span>
          <Badge
            variant={
              subscription.status === 'ACTIVE'
                ? 'default'
                : subscription.status === 'PENDING'
                  ? 'secondary'
                  : 'destructive'
            }
          >
            {subscription.status}
          </Badge>
        </div>
        <p className="mb-4 text-xs text-muted-foreground">
          Expires on: {new Date(subscription.expiresAt).toLocaleDateString()}
        </p>
        <Button
          asChild
          className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white hover:from-blue-700 hover:to-cyan-700"
        >
          <Link href="/settings/billing">Manage Subscription</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
