import { createClient } from '@/lib/supabase';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const supabase = createClient();
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const thisMonth = new Date();
    thisMonth.setDate(1);
    thisMonth.setHours(0, 0, 0, 0);

    const [totalSignals, closedSignals, closedThisMonth] = await Promise.all([
      prisma.signal.count(),
      prisma.signal.count({
        where: { isClosed: true },
      }),
      prisma.signal.count({
        where: {
          isClosed: true,
          closedAt: {
            gte: thisMonth,
          },
        },
      }),
    ]);

    const completionRate = totalSignals > 0 ? (closedSignals / totalSignals) * 100 : 0;

    return NextResponse.json({
      totalSignals,
      closedSignals,
      closedThisMonth,
      completionRate,
    });
  } catch (error) {
    console.error('Error fetching performance metrics:', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
