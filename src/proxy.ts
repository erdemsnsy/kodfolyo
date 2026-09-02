import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getProfileByCustomDomain } from '@/lib/supabase/server';

// Next.js 16: middleware.ts -> proxy.ts (aynı davranış, yeni isim).
// Doğrulanmış bir özel alan adından gelen isteği ilgili /[username]
// portfolyosuna sessizce rewrite eder. Kendi kodfolyo.dev alan adımızda
// (veya localhost'ta) hiçbir şey değişmez.
export async function proxy(request: NextRequest) {
  const host = request.headers.get('host')?.split(':')[0].toLowerCase();

  if (!host || host.endsWith('kodfolyo.dev') || host === 'localhost' || host.endsWith('.vercel.app')) {
    return NextResponse.next();
  }

  const { pathname } = request.nextUrl;
  if (pathname.startsWith('/api') || pathname.startsWith('/_next')) {
    return NextResponse.next();
  }

  const profile = await getProfileByCustomDomain(host);
  if (!profile) {
    return NextResponse.next();
  }

  // Portfolyo sayfasının alt rotası yok — özel alan adındaki tüm yollar
  // doğrudan kullanıcının portfolyosuna yönlenir.
  const url = request.nextUrl.clone();
  url.pathname = `/${profile.username}`;
  return NextResponse.rewrite(url);
}

export const config = {
  matcher: '/((?!_next/static|_next/image|favicon.ico).*)',
};
