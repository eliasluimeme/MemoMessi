import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth-utils';
import { z } from 'zod';

const UserUpdateSchema = z.object({
  fullName: z.string().min(2).optional(),
  phoneNumber: z.string().regex(/^\+?[1-9]\d{1,14}$/).optional(),
  image: z.string().url().optional(),
});

export type UserResponse = {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string | null;
  image: string | null;
  role: string;
  verified: boolean;
  subscriptions: {
    status: string;
    plan: string;
    expiresAt: string;
  } | null;
};

export async function GET() {
  try {
    const session = await getSession();
    if (!session?.email)
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const user = await prisma.user.findUnique({
      where: { email: session.email as string },
      include: {
        subscriptions: true,
      },
    });

    if (!user)
      return NextResponse.json({ error: 'User not found' }, { status: 404 });

    const response: UserResponse = {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      phoneNumber: user.phoneNumber,
      image: user.image,
      role: user.role,
      verified: user.verified,
      subscriptions: user.subscriptions
        ? {
          status: user.subscriptions.status,
          plan: user.subscriptions.plan,
          expiresAt: user.subscriptions.expiresAt.toISOString(),
        }
        : null,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('[USER_GET]', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await getSession();
    if (!session?.email)
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();

    const result = UserUpdateSchema.safeParse(body);
    if (!result.success)
      return NextResponse.json(
        { error: 'Invalid input', details: result.error.flatten() },
        { status: 400 }
      );

    const updatedUser = await prisma.user.update({
      where: { email: session.email as string },
      data: result.data,
      include: {
        subscriptions: true,
      },
    });

    const response: UserResponse = {
      id: updatedUser.id,
      fullName: updatedUser.fullName,
      email: updatedUser.email,
      phoneNumber: updatedUser.phoneNumber,
      image: updatedUser.image,
      role: updatedUser.role,
      verified: updatedUser.verified,
      subscriptions: updatedUser.subscriptions
        ? {
          status: updatedUser.subscriptions.status,
          plan: updatedUser.subscriptions.plan,
          expiresAt: updatedUser.subscriptions.expiresAt.toISOString(),
        }
        : null,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('[USER_PATCH]', error);
    if (error instanceof z.ZodError)
      return NextResponse.json(
        { error: 'Validation failed', details: error.flatten() },
        { status: 400 }
      );

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 