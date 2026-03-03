import { createClient } from '@/lib/supabase';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST() {
  const supabase = await createClient();

  await supabase.auth.signOut();

  return NextResponse.json({ message: 'Logged out successfully' });
}
