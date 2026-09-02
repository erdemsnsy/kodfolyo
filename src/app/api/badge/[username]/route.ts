import { NextRequest, NextResponse } from 'next/server';
import { getProfileByUsername, getCachedReposByUsername } from '@/lib/supabase/server';
import { generateBadgeSVG, BadgeSize } from '@/lib/badge';
import { ThemeType } from '@/types';

export const dynamic = 'force-dynamic';

const VALID_SIZES: BadgeSize[] = ['sm', 'md', 'lg'];
const VALID_THEMES: ThemeType[] = ['gece', 'kagit', 'neon', 'mercan'];

// Gömülebilir rozet — gerçek profil/repo verisinden SVG üretir. README'lere
// <img> veya markdown ile eklenebilir; her istekte güncel veri okunur.
export async function GET(request: NextRequest, { params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;
  const decodedUsername = decodeURIComponent(username);

  const searchParams = request.nextUrl.searchParams;
  const sizeParam = searchParams.get('size') as BadgeSize | null;
  const themeParam = searchParams.get('theme') as ThemeType | null;
  const size: BadgeSize = sizeParam && VALID_SIZES.includes(sizeParam) ? sizeParam : 'md';
  const theme: ThemeType | undefined = themeParam && VALID_THEMES.includes(themeParam) ? themeParam : undefined;

  const profile = await getProfileByUsername(decodedUsername);
  if (!profile) {
    return new NextResponse('Kullanıcı bulunamadı', { status: 404 });
  }

  const repos = await getCachedReposByUsername(decodedUsername);
  const visibleRepos = repos.filter((r) => r.is_visible !== false);
  const starCount = visibleRepos.reduce((sum, r) => sum + (r.stargazers_count || 0), 0);

  const svg = generateBadgeSVG({
    username: profile.username,
    name: profile.name,
    avatarUrl: profile.avatar_url,
    starCount,
    repos,
    theme: theme || profile.theme,
    size,
  });

  return new NextResponse(svg, {
    status: 200,
    headers: {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'public, max-age=1800, s-maxage=1800',
    },
  });
}
