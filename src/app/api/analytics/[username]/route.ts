import { NextResponse } from 'next/server';
import { getProfileByUsername, getAnalyticsSummary } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export async function GET(request: Request, { params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;
  const decodedUsername = decodeURIComponent(username);

  const profile = await getProfileByUsername(decodedUsername);
  if (!profile) {
    return NextResponse.json({ success: false, error: 'Profil bulunamadı.' }, { status: 404 });
  }

  const summary = await getAnalyticsSummary(profile);
  return NextResponse.json({ success: true, summary });
}
