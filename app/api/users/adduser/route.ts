import { createAdminClient } from '@/lib/supabase';
import { prisma } from '@/lib/prisma';
import { isAuthenticated } from '@/lib/auth-utils';
import { NextResponse } from 'next/server';
import { z } from 'zod';

const addUserSchema = z.object({
  fullName: z.string().min(1, 'Full name is required'),
  email: z.string().email('Invalid email address'),
  phoneNumber: z.string().min(10, 'Phone number is required'),
  password: z.string().min(8, 'Password must be at least 8 characters long'),
  subscription: z.object({
    plan: z.enum(['ONE_MONTH', 'THREE_MONTHS', 'SIX_MONTHS', 'ONE_YEAR']),
    status: z.enum(['ACTIVE', 'PENDING', 'EXPIRED']),
    expiresAt: z.string(),
  }),
});

export async function POST(req: Request) {
  try {
    const session = await isAuthenticated();

    if (!session || session.role !== 'ADMIN')
      return new NextResponse('Unauthorized', { status: 403 });

    const body = await req.json();
    const validatedData = addUserSchema.parse(body);

    const adminClient = createAdminClient();

    // 1. Create User in Supabase Auth using Admin Client
    const { data: authData, error: authError } = await adminClient.auth.admin.createUser({
      email: validatedData.email,
      password: validatedData.password,
      email_confirm: true,
      user_metadata: {
        full_name: validatedData.fullName,
        phone_number: validatedData.phoneNumber,
        role: 'USER',
        verified: true
      }
    });

    if (authError) {
      return NextResponse.json({ message: authError.message }, { status: 400 });
    }

    if (!authData.user) {
      return NextResponse.json({ message: 'Failed to create user' }, { status: 500 });
    }

    // 2. Create Profile and Subscription in Prisma
    const newUser = await prisma.user.create({
      data: {
        id: authData.user.id,
        fullName: validatedData.fullName,
        email: validatedData.email,
        phoneNumber: validatedData.phoneNumber,
        role: 'USER',
        verified: true,
        subscriptions: {
          create: {
            plan: validatedData.subscription.plan,
            status: validatedData.subscription.status,
            expiresAt: new Date(validatedData.subscription.expiresAt),
          },
        },
      },
      include: {
        subscriptions: true,
      },
    });

    return NextResponse.json(newUser);
  } catch (error) {
    console.error('[ADD_USER]', error);
    if (error instanceof z.ZodError)
      return new NextResponse('Invalid request data', { status: 400 });
    return new NextResponse('Internal error', { status: 500 });
  }
}
