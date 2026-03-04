import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

const PUBLIC_FILE_ROUTES = ['/_next', '/favicon.ico', '/sitemap.xml', '/robots.txt', '/logo.png', '/assets', '/images'];
const AUTH_ROUTES = ['/login', '/signup', '/forgot-password'];
const PROTECTED_PREFIXES = [
  '/dashboard', '/signals', '/settings', '/profile',
  '/favorites', '/academy', '/upgrade', '/verification', '/admin',
];

function withNoCache(response: NextResponse): NextResponse {
  response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  response.headers.set('Pragma', 'no-cache');
  response.headers.set('Expires', '0');
  return response;
}

export async function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Skip static assets
  if (PUBLIC_FILE_ROUTES.some((r) => path.startsWith(r))) {
    return NextResponse.next();
  }

  // Skip Telegram webhooks
  if (path.startsWith('/api/telegram/')) {
    return NextResponse.next();
  }

  // Build response and Supabase client (handles cookie refresh)
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // Server-validates the JWT with Supabase — the only reliable auth check in proxy context
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  const isAuthRoute = AUTH_ROUTES.some((r) => path.startsWith(r));
  const isProtectedRoute = PROTECTED_PREFIXES.some((r) => path.startsWith(r));

  // ── Unauthenticated ────────────────────────────────────────────────────────
  if (authError || !user) {
    if (isProtectedRoute) {
      const url = request.nextUrl.clone();
      url.pathname = '/login';
      return NextResponse.redirect(url);
    }
    return supabaseResponse;
  }

  // ── Authenticated on auth page → redirect away ─────────────────────────────
  // Use app_metadata.role (synced on login) for the destination hint.
  // If not yet synced, default to /signals (layouts will handle further routing).
  if (isAuthRoute) {
    const role = ((user.app_metadata?.role as string) ?? '').toUpperCase();
    const isAdminRole = role === 'ADMIN' || role === 'PRIVATE' || user.email === 'eliasakry@gmail.com';
    const url = request.nextUrl.clone();
    url.pathname = isAdminRole ? '/admin' : '/signals';
    return NextResponse.redirect(url);
  }

  // ── Authenticated on protected route → pass through with no-cache ──────────
  // Role-based access control (ADMIN vs USER) is enforced by the server-side
  // layouts which use Prisma for a guaranteed-accurate role lookup.
  if (isProtectedRoute) {
    return withNoCache(supabaseResponse);
  }

  return supabaseResponse;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|logo.png|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)'],
};
