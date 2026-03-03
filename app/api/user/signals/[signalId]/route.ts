import { createClient } from '@/lib/supabase';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function PUT(req: Request, { params }: { params: Promise<{ signalId: string }> }) {
  try {
    const supabase = await createClient();
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { signalId } = await params;
    // Check if favorite already exists
    const existingFavorite = await prisma.favorite.findUnique({
      where: {
        userId_signalId: {
          userId: user.id,
          signalId: signalId,
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
        signalId: signalId,
        userId: user.id,
      },
    });

    return NextResponse.json({ message: 'Signal added to favorites' });
  } catch (error) {
    console.error('[FAVORITE_SIGNAL]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
