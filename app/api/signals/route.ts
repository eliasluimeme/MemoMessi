import { createClient } from '@/lib/supabase';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { isVipUser } from '@/actions/signals';

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const isAdmin = user.user_metadata?.role === 'ADMIN' || user.user_metadata?.role === 'PRIVATE';
    const vip = isAdmin || (await isVipUser(user.id));

    const signals = await prisma.signal.findMany({
      include: {
        targets: true,
        favorites: true,
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Strip sensitive data from VIP signals for non-VIP users
    const safeSignals = signals.map((signal) => {
      if (!vip && signal.isVip) {
        return {
          id: signal.id,
          pair: signal.pair,
          market: signal.market,
          action: signal.action,
          network: signal.network,
          status: signal.status,
          isVip: signal.isVip,
          isLocked: true,
          isClosed: signal.isClosed,
          createdAt: signal.createdAt,
          updatedAt: signal.updatedAt,
          entryZone: 0,
          stopLoss: null,
          targets: [],
          favorites: [],
          contractAddress: null,
          note: null,
          imageURL: null,
          closedAt: null,
        };
      }
      return signal;
    });

    return NextResponse.json(safeSignals);
  } catch (error) {
    console.error('Error fetching signals:', error);
    return NextResponse.json({ error: 'Failed to fetch signals' }, { status: 500 });
  }
}
