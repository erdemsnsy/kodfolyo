import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { getProfileByUsername, getAnalyticsSummary } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export async function GET(request: Request, { params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;
  const decodedUsername = decodeURIComponent(username);

  // Analiz verisi (trafik, referrer, link tıklamaları) sadece profil sahibine
  // özel — girişsiz veya başka birinin oturumuyla istek atılırsa reddedilir.
  const session = await auth();
  if (session?.user?.username !== decodedUsername) {
    return NextResponse.json({ success: false, error: 'Bu analiz verisini görüntüleme yetkiniz yok.' }, { status: 403 });
  }

  const profile = await getProfileByUsername(decodedUsername);
  if (!profile) {
    return NextResponse.json({ success: false, error: 'Profil bulunamadı.' }, { status: 404 });
  }

  const summary = await getAnalyticsSummary(profile);
  return NextResponse.json({ success: true, summary });
}
