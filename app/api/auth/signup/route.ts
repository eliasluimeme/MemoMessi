import { createClient } from '@/lib/supabase';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { fullName, phoneNumber, password } = body;
    const email = body.email?.toLowerCase().trim();

    if (!email || !password || !fullName) {
      return NextResponse.json(
        { message: 'Missing required fields (email, password, fullName)' },
        { status: 400 }
      );
    }

    const supabase = createClient();

    // 1. Create User in Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          phone_number: phoneNumber,
          role: 'USER',
          verified: false
        }
      }
    });

    if (authError) {
      console.error('Supabase signup error:', authError);
      return NextResponse.json({ message: authError.message }, { status: 400 });
    }

    if (!authData.user) {
      return NextResponse.json({ message: 'Failed to create user account' }, { status: 500 });
    }

    // 2. Create Profile and Subscription in Prisma
    // We wrap this in a try-catch to handle cases where a DB trigger might have already created the profile
    try {
      await prisma.user.create({
        data: {
          id: authData.user.id,
          email,
          role: 'USER',
          fullName,
          phoneNumber: phoneNumber || null,
          verified: false,
          subscriptions: {
            create: {
              status: 'PENDING',
              plan: 'ONE_MONTH',
              expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            },
          },
        },
      });
    } catch (prismaError: any) {
      // P2002 is Prisma's error code for unique constraint violation
      if (prismaError.code === 'P2002') {
        console.log('User profile already exists (likely created by DB trigger)');
      } else {
        console.error('Error creating user profile in Prisma:', prismaError);
        // We don't want to fail the whole signup if the profile creation fails but user is already in Supabase,
        // unless it's a critical error. But here, let's just log it.
        // Or we could return success since Supabase part worked.
      }
    }

    return NextResponse.json({
      message: 'Signup successful. Please check your email for verification.',
      user: authData.user
    });
  } catch (error) {
    console.error('Signup process error:', error);
    return NextResponse.json(
      { message: (error as Error).message || 'An error occurred during signup' },
      { status: 500 }
    );
  }
}
