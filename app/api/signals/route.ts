import { createClient } from '@/lib/supabase';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const signals = await prisma.signal.findMany({
      include: {
        targets: true,
        favorites: true,
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json(signals);
  } catch (error) {
    console.error('Error fetching signals:', error);
    return NextResponse.json({ error: 'Failed to fetch signals' }, { status: 500 });
  }
}
