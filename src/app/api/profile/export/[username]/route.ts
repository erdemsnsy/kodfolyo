import { NextResponse } from 'next/server';
import { getProfileByUsername, getCachedReposByUsername } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

// Kullanıcının gerçek profil + repo verisini indirilebilir JSON olarak döner.
export async function GET(request: Request, { params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;
  const decodedUsername = decodeURIComponent(username);

  const profile = await getProfileByUsername(decodedUsername);
  if (!profile) {
    return NextResponse.json({ success: false, error: 'Profil bulunamadı.' }, { status: 404 });
  }

  const repos = await getCachedReposByUsername(decodedUsername);

  const exportData = {
    exported_at: new Date().toISOString(),
    profile,
    repositories: repos,
  };

  return new NextResponse(JSON.stringify(exportData, null, 2), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Content-Disposition': `attachment; filename="kodfolyo-${profile.username}.json"`,
    },
  });
}
