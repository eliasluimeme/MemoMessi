import { cache } from 'react';
import { createClient } from './supabase';
import { prisma } from './prisma';

export async function isAuthenticated() {
  const session = await getSession();
  if (!session) return null;
  return session;
}

export const getSession = cache(async () => {
  const supabase = await createClient();

  try {
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) {
      return null;
    }

    // Fetch the latest role and verified status from the database
    // This is more reliable than user_metadata which can get out of sync
    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { role: true, verified: true }
    });

    // Map Supabase user and Prisma data to the expected payload structure
    let role = dbUser?.role || user.user_metadata.role || 'USER';

    // Emergency fallback for primary admin
    if (user.email === 'eliasakry@gmail.com') {
      role = 'ADMIN' as any;
    }

    return {
      id: user.id,
      email: user.email,
      role: role,
      verified: dbUser?.verified ?? user.user_metadata.verified ?? false
    };
  } catch (error) {
    console.error('Error fetching user:', error);
    return null;
  }
});
