import { createClient } from '@/lib/supabase';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { Plan } from '@prisma/client';

export async function PATCH(req: Request) {
  try {
    const supabase = createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user || user.user_metadata.role !== 'ADMIN') {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const body = await req.json();
    const { userId, plan } = body;

    const expirationMap: Record<Plan, number> = {
      ONE_MONTH: 1,
      THREE_MONTHS: 3,
      SIX_MONTHS: 6,
      ONE_YEAR: 12,
    };

    const now = new Date();
    const expiresAt = new Date(now);
    expiresAt.setMonth(now.getMonth() + expirationMap[plan as Plan]);

    await prisma.$transaction([
      prisma.user.update({
        where: { id: userId },
        data: { verified: true },
      }),
      prisma.subscription.upsert({
        where: { userId: userId },
        update: {
          status: 'ACTIVE',
          plan: plan as Plan,
          startDate: now,
          expiresAt,
        },
        create: {
          userId: userId,
          status: 'ACTIVE',
          plan: plan as Plan,
          startDate: now,
          expiresAt,
        },
      }),
    ]);

    return NextResponse.json({ message: 'Subscription updated successfully' });
  } catch (error) {
    console.error('[SUBSCRIPTION_PATCH]', error);
    return new NextResponse('Internal error', { status: 500 });
  }
}
