import { createClient } from '@/lib/supabase';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { syncRoleToAppMetadata } from '@/lib/auth-utils';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  const { email, password } = await request.json();
  const supabase = await createClient();

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return NextResponse.json({ message: error.message }, { status: 401 });
    }

    const { user } = data;

    // Fetch role from database — source of truth
    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
    });

    const role = ((dbUser?.role as string) || (user.user_metadata.role as string) || 'USER').toUpperCase();

    // Sync role into app_metadata so the proxy can read it from the JWT
    await syncRoleToAppMetadata(user.id, role);

    return NextResponse.json({
      message: 'Login successful',
      redirectUrl: role === 'ADMIN' || role === 'PRIVATE' ? '/admin' : '/signals',
      user: {
        id: user.id,
        email: user.email,
        role: role,
        fullName: dbUser?.fullName || user.user_metadata.full_name,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { message: 'An error occurred, please try again later.' },
      { status: 500 }
    );
  }
}
