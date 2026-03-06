import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth-utils';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const session = await getSession();
    if (!session || (session.role !== 'ADMIN' && session.role !== 'PRIVATE')) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const subscriptions = await prisma.subscription.findMany({
      select: {
        id: true,
        userId: true,
        status: true,
        plan: true,
        startDate: true,
        expiresAt: true,
        createdAt: true,
        updatedAt: true,
        user: {
          select: {
            fullName: true,
            email: true,
          },
        },
      },
    });
    return NextResponse.json(subscriptions || []);
  } catch (error) {
    console.error('Error fetching subscriptions:', error);
    return NextResponse.json([], { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getSession();
    if (!session || (session.role !== 'ADMIN' && session.role !== 'PRIVATE')) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const body = await request.json();
    const { id, status, expiresAt, plan } = body;

    const updatedSubscription = await prisma.subscription.update({
      where: { id },
      data: {
        status,
        expiresAt: new Date(expiresAt),
        plan,
      },
    });

    return NextResponse.json(updatedSubscription);
  } catch (error) {
    console.error('Error updating subscription:', error);
    return NextResponse.json({ error: 'Failed to update subscription' }, { status: 500 });
  }
}
