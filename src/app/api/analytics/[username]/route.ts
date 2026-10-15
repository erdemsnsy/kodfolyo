import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { checkProfileAccess } from '@/lib/auth-guard';
import { getProfileByUsername, getAnalyticsSummary } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export async function GET(request: Request, { params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;
  const decodedUsername = decodeURIComponent(username);

  // Kodfolyo girişsiz (misafir) modda da çalışıyor, bu yüzden gerçek oturum şart
  // koşulmuyor — ama gerçek bir oturum VARSA, o oturum sadece kendi analiz
  // verisini görebilir (başkasınınkini değil).
  const session = await auth();
  const access = checkProfileAccess(session?.user?.username, decodedUsername);
  if (!access.ok) {
    return NextResponse.json({ success: false, error: access.error }, { status: access.status });
  }

  const profile = await getProfileByUsername(decodedUsername);
  if (!profile) {
    return NextResponse.json({ success: false, error: 'Profil bulunamadı.' }, { status: 404 });
  }

  const summary = await getAnalyticsSummary(profile);
  return NextResponse.json({ success: true, summary });
}
