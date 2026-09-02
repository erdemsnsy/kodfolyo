import { NextResponse } from 'next/server';
import { getProfileByUsername, verifyCustomDomain } from '@/lib/supabase/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const username: string | undefined = body.username;

    if (!username) {
      return NextResponse.json({ success: false, error: 'Kullanıcı adı eksik.' }, { status: 400 });
    }

    const profile = await getProfileByUsername(username);
    if (!profile) {
      return NextResponse.json({ success: false, error: 'Profil bulunamadı.' }, { status: 404 });
    }

    const result = await verifyCustomDomain(profile);
    return NextResponse.json({ success: true, ...result });
  } catch (error) {
    console.error('Domain verify error:', error);
    return NextResponse.json({ success: false, error: 'Doğrulama başarısız.' }, { status: 500 });
  }
}
