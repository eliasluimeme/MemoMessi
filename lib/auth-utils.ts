import { createClient } from './supabase';
import { prisma, withRetry } from './prisma';
import { createAdminClient } from './supabase';

export async function isAuthenticated() {
  const session = await getSession();
  if (!session) return null;
  return session;
}

/**
 * Syncs the user's role from the DB into Supabase app_metadata.
 * app_metadata is embedded in the JWT and readable in the proxy without extra DB calls.
 * It can only be written by the service role — safe for auth decisions.
 */
export async function syncRoleToAppMetadata(userId: string, role: string): Promise<void> {
  try {
    const adminClient = createAdminClient();
    await adminClient.auth.admin.updateUserById(userId, {
      app_metadata: { role: role.toUpperCase() },
    });
  } catch (error) {
    console.error('[syncRoleToAppMetadata] Failed to sync role:', error);
  }
}

export async function getSession() {
  const supabase = await createClient();

  try {
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) {
      return null;
    }

    // Fetch the latest role and verified status from the database
    // This is more reliable than user_metadata which can get out of sync
    const dbUser = await withRetry(() =>
      prisma.user.findUnique({
        where: { id: user.id },
        select: { role: true, verified: true }
      })
    );

    // Priority: app_metadata.role (synced by service role on login) > DB role > user_metadata fallback
    const appMetaRole = (user.app_metadata?.role as string | undefined)?.toUpperCase();
    const dbRole = (dbUser?.role as string | undefined)?.toUpperCase();
    let role: string = appMetaRole || dbRole || (user.user_metadata?.role as string | undefined)?.toUpperCase() || 'USER';

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
}
