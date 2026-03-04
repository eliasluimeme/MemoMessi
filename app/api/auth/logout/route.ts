import { createClient } from '@/lib/supabase';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST() {
  const supabase = await createClient();

  await supabase.auth.signOut();

  const response = NextResponse.json({ message: 'Logged out successfully' });
  // Clear all Supabase auth cookies explicitly
  const cookieNames = [
    'sb-access-token',
    'sb-refresh-token',
    `sb-${process.env.NEXT_PUBLIC_SUPABASE_URL?.split('//')[1]?.split('.')[0]}-auth-token`,
  ];
  cookieNames.forEach((name) => {
    response.cookies.set(name, '', { maxAge: 0, path: '/' });
  });
  return response;
}
