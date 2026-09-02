import { NextResponse } from 'next/server';
import { auth } from '../../../../lib/auth';
import { fetchGitHubUserData, fetchTopStarredRepos, sanitizeUsername } from '../../../../lib/github/fetcher';
import { upsertProfile, saveCachedRepos, getProfileByUsername, getCachedReposByUsername } from '../../../../lib/supabase/server';

export async function POST(request: Request) {
  try {
    let username = '';
    let accessToken: string | undefined = undefined;

    const session = await auth();
    if (session?.user?.username) {
      username = session.user.username;
      accessToken = (session as { accessToken?: string }).accessToken;
    } else {
      try {
        const body = await request.json();
        if (body.username) {
          username = sanitizeUsername(body.username);
        }
      } catch {
        // Body opsiyonel
      }
    }

    if (!username) {
      return NextResponse.json(
        { success: false, error: 'Geçerli bir kullanıcı adı girilmedi.' },
        { status: 400 }
      );
    }

    // Demo hesaplarda doğrudan mock veriyi döndür
    if (username === 'ornek-ogrenci' || username === 'demo') {
      const mockProfile = await getProfileByUsername(username);
      const mockRepos = await getCachedReposByUsername(username);
      return NextResponse.json({
        success: true,
        profile: mockProfile,
        repos: mockRepos,
        message: 'Demo verileri senkronize edildi.',
      });
    }

    // 1. GitHub API'den profil verilerini çek (Sadece 404 ise null döner)
    const githubUserData = await fetchGitHubUserData(username, accessToken);
    if (!githubUserData) {
      return NextResponse.json(
        { success: false, error: `"${username}" adında bir GitHub kullanıcısı bulunamadı.` },
        { status: 404 }
      );
    }

    // 2. GitHub API'den en çok yıldız alan ilk 6 reponu çek
    const topRepos = await fetchTopStarredRepos(username, accessToken);

    // 3. Supabase veya önbellek deposuna kaydet (Mevcut tema, biyo ve bağlantıları koru)
    const existingProfile = await getProfileByUsername(username);

    const profile = await upsertProfile({
      github_id: String(githubUserData.id),
      username: githubUserData.login.toLowerCase(),
      name: githubUserData.name || githubUserData.login,
      avatar_url: githubUserData.avatar_url,
      bio: githubUserData.bio,
      custom_bio: existingProfile?.custom_bio || null,
      company: githubUserData.company,
      location: githubUserData.location,
      email: githubUserData.email,
      blog: githubUserData.blog,
      theme: existingProfile?.theme || 'gece',
      custom_links: existingProfile?.custom_links || [],
    });

    const savedRepos = await saveCachedRepos(profile, topRepos);

    return NextResponse.json({
      success: true,
      profile,
      repos: savedRepos,
      message: 'GitHub verileri başarıyla senkronize edildi.',
    });
  } catch (error) {
    console.error('GitHub sync error:', error);
    return NextResponse.json(
      { success: false, error: 'Senkronizasyon sırasında bir hata oluştu.' },
      { status: 500 }
    );
  }
}
