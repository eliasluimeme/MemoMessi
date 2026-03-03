import { createClient } from '@/lib/supabase';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function PATCH(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user || user.user_metadata.role !== 'ADMIN') {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const body = await req.json();
    const { userId, suspend } = body;

    const subscription = await prisma.subscription.update({
      where: {
        userId: userId,
      },
      data: {
        status: suspend,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json(subscription);
  } catch (error) {
    console.error('[SUSPEND_USER_PATCH]', error);
    return new NextResponse('Internal error', { status: 500 });
  }
}
