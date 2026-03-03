import { createClient } from '@/lib/supabase';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  const supabase = await createClient();

  try {
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) {
      return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
    }

    // Optionally fetch more data from Prisma
    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      include: {
        subscriptions: true,
      }
    });

    return NextResponse.json({
      user: dbUser || {
        id: user.id,
        email: user.email,
        ...user.user_metadata
      }
    });
  } catch (error) {
    console.error('Fetch user error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
