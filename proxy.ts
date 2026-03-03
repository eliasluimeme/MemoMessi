import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

const PUBLIC_FILE_ROUTES = [
  '/_next',
  '/favicon.ico',
  '/sitemap.xml',
  '/robots.txt',
  '/logo.png',
  '/assets',
  '/images'
];

const PUBLIC_PAGE_ROUTES = [
  '/',
  '/contact',
  '/privacy',
  '/terms',
  '/verification',
  '/login',
  '/signup',
  '/forgot-password'
];

const AUTH_ROUTES = ['/login', '/signup', '/forgot-password'];
const USER_ROUTES = ['/dashboard', '/signals', '/settings', '/profile', '/favorites', '/academy'];
const ADMIN_ROUTES = ['/admin', '/admin/signals', '/admin/subscriptions', '/admin/users', '/admin/telegram'];
const PROTECTED_ROUTES = [...USER_ROUTES, ...ADMIN_ROUTES];

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: any) {
          request.cookies.set({ name, value, ...options });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({ name, value, ...options });
        },
        remove(name: string, options: any) {
          request.cookies.set({ name, value: '', ...options });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({ name, value: '', ...options });
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();
  const path = request.nextUrl.pathname;

  // Skip middleware for public file routes
  if (PUBLIC_FILE_ROUTES.some(route => path.startsWith(route))) {
    return response;
  }

  // Skip middleware for public page routes
  if (PUBLIC_PAGE_ROUTES.some(route => path === route)) {
    return response;
  }

  // Skip middleware for Telegram routes
  if (path.startsWith('/api/telegram/')) {
    return response;
  }

  // Determine the user's role
  let role = (user?.user_metadata?.role || 'USER').toUpperCase();

  // On any protected path, double check the database role to be sure
  const isProtectedPath = path.startsWith('/admin') ||
    path.startsWith('/api/admin') ||
    USER_ROUTES.some(r => path.startsWith(r));

  if (user && isProtectedPath) {
    try {
      // 1. Check metadata first
      if (user.user_metadata?.role?.toUpperCase() === 'ADMIN') {
        role = 'ADMIN';
      }

      // 2. Double check database (as the real source of truth for promotions)
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      if (profile?.role) {
        role = profile.role.toUpperCase();
      }

      // 3. Emergency fallback for primary admin email
      if (user.email === 'eliasakry@gmail.com') {
        role = 'ADMIN';
      }
    } catch (error) {
      console.error('Middleware DB role check error:', error);
      // Fallback: trust email if DB check fails
      if (user.email === 'eliasakry@gmail.com') role = 'ADMIN';
    }
  }

  // API Route Protection
  if (path.startsWith('/api/') && !path.startsWith('/api/auth/')) {
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (path.startsWith('/api/admin/') && role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
  }

  // Page Route Protection
  if (!user) {
    // Redirect unauthenticated users to login if they try to access protected pages
    const isProtectedPage = path.startsWith('/admin') ||
      USER_ROUTES.some(r => path.startsWith(r));
    if (isProtectedPage) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    return response;
  }

  // Redirect logged-in users away from auth pages
  if (AUTH_ROUTES.includes(path)) {
    const target = role === 'ADMIN' ? '/admin' : '/dashboard';
    return NextResponse.redirect(new URL(target, request.url));
  }

  // Role-based page access control
  if (path.startsWith('/admin')) {
    if (role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  } else if (USER_ROUTES.some(r => path.startsWith(r))) {
    if (role === 'ADMIN') {
      // Redirect admins from user dashboard to admin dashboard
      return NextResponse.redirect(new URL('/admin', request.url));
    }
  }

  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|logo.png).*)',
  ]
};
