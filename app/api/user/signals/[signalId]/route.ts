import { createClient } from '@/lib/supabase';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function PUT(req: Request, { params }: { params: { signalId: string } }) {
  try {
    const supabase = createClient();
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if favorite already exists
    const existingFavorite = await prisma.favorite.findUnique({
      where: {
        userId_signalId: {
          userId: user.id,
          signalId: params.signalId,
        },
      },
    });

    if (existingFavorite) {
      // If favorite exists, remove it
      await prisma.favorite.delete({
        where: {
          id: existingFavorite.id,
        },
      });

      return NextResponse.json({ message: 'Signal removed from favorites' });
    }

    // If favorite doesn't exist, create it
    await prisma.favorite.create({
      data: {
        signalId: params.signalId,
        userId: user.id,
      },
    });

    return NextResponse.json({ message: 'Signal added to favorites' });
  } catch (error) {
    console.error('[FAVORITE_SIGNAL]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
