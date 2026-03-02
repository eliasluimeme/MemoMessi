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

    const signals = await prisma.signal.findMany({
      select: {
        targets: {
          select: {
            gain: true,
          },
        },
        createdAt: true,
      },
    });

    const lastMonthDate = new Date();
    lastMonthDate.setMonth(lastMonthDate.getMonth() - 1);

    const lastMonthSignals = signals.filter((signal) => signal.createdAt > lastMonthDate);

    return NextResponse.json({
      totalProfit: signals.reduce(
        (sum, signal) =>
          sum + signal.targets.reduce((targetSum, target) => targetSum + target.gain, 0),
        0,
      ),
      lastMonthProfit: lastMonthSignals.reduce(
        (sum, signal) =>
          sum + signal.targets.reduce((targetSum, target) => targetSum + target.gain, 0),
        0,
      ),
      totalSignals: signals.length,
      lastMonthSignals: lastMonthSignals.length,
    });
  } catch (error) {
    console.error('Error fetching total profit:', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
