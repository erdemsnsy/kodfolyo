import { NextRequest, NextResponse } from 'next/server';
import { createHash } from 'crypto';
import { getProfileByUsername, recordPageView, recordLinkClick, recordPdfDownload } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

function hashVisitor(request: NextRequest): string {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0].trim() || request.headers.get('x-real-ip') || 'unknown';
  const day = new Date().toISOString().slice(0, 10);
  // Gün + IP tuzuyla hash'lenir: ham IP hiçbir yerde saklanmaz, sadece
  // "aynı gün aynı ziyaretçi mi" ayrımı için kullanılır.
  return createHash('sha256').update(`${ip}:${day}:kodfolyo-salt`).digest('hex').slice(0, 24);
}

function extractHost(url: string | null): string | null {
  if (!url) return null;
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return null;
  }
}

// Gerçek görüntülenme/link tıklama olaylarını kaydeder. Sahte veri yok —
// portfolyo sayfasından (AnalyticsBeacon) tetiklenir.
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, type } = body as { username?: string; type?: 'view' | 'link_click' | 'pdf_download'; referrer?: string; label?: string; url?: string };

    if (!username || !type) {
      return NextResponse.json({ success: false, error: 'Eksik parametre.' }, { status: 400 });
    }

    const profile = await getProfileByUsername(username);
    if (!profile) {
      return NextResponse.json({ success: false, error: 'Profil bulunamadı.' }, { status: 404 });
    }

    if (type === 'view') {
      const referrerHost = extractHost(body.referrer || null);
      await recordPageView(profile.id, profile.username, referrerHost, hashVisitor(request));
    } else if (type === 'link_click' && typeof body.url === 'string') {
      await recordLinkClick(profile.id, profile.username, body.label || null, body.url);
    } else if (type === 'pdf_download') {
      await recordPdfDownload(profile.id, profile.username);
    } else {
      return NextResponse.json({ success: false, error: 'Geçersiz olay.' }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Analytics track error:', error);
    return NextResponse.json({ success: false, error: 'Kaydedilemedi.' }, { status: 500 });
  }
}
