import { createClient } from '@supabase/supabase-js';
import { UserProfile, Repository, DEFAULT_SECTION_VISIBILITY } from '@/types';
import { fetchGitHubUserData, fetchTopStarredRepos, getMockGitHubUserData, getMockRepositories, sanitizeUsername, isValidGitHubUsername } from '@/lib/github/fetcher';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const isSupabaseServerConfigured = Boolean(
  supabaseUrl &&
  serviceRoleKey &&
  !supabaseUrl.includes('your-project-id')
);

export const supabaseAdmin = isSupabaseServerConfigured
  ? createClient(supabaseUrl, serviceRoleKey, {
      auth: { persistSession: false },
    })
  : null;

// ─── Bellek içi kalıcı önbellek (globalThis ile hot-reload'dan korunur) ─────
// globalThis olmadan: her dosya değişikliğinde Next.js modülü sıfırlar → tema sıfırlanır
declare global {
  var _kodfolyo_profiles: Map<string, UserProfile> | undefined;
  var _kodfolyo_repos: Map<string, Repository[]> | undefined;
  var _kodfolyo_page_views: Map<string, { referrerHost: string | null; visitorHash: string; createdAt: string }[]> | undefined;
  var _kodfolyo_link_clicks: Map<string, { label: string | null; url: string; createdAt: string }[]> | undefined;
  var _kodfolyo_pdf_downloads: Map<string, { createdAt: string }[]> | undefined;
}

const memoryProfilesStore: Map<string, UserProfile> =
  globalThis._kodfolyo_profiles ?? (globalThis._kodfolyo_profiles = new Map<string, UserProfile>());

const memoryReposStore: Map<string, Repository[]> =
  globalThis._kodfolyo_repos ?? (globalThis._kodfolyo_repos = new Map<string, Repository[]>());

const memoryPageViewsStore: Map<string, { referrerHost: string | null; visitorHash: string; createdAt: string }[]> =
  globalThis._kodfolyo_page_views ?? (globalThis._kodfolyo_page_views = new Map());

const memoryLinkClicksStore: Map<string, { label: string | null; url: string; createdAt: string }[]> =
  globalThis._kodfolyo_link_clicks ?? (globalThis._kodfolyo_link_clicks = new Map());

const memoryPdfDownloadsStore: Map<string, { createdAt: string }[]> =
  globalThis._kodfolyo_pdf_downloads ?? (globalThis._kodfolyo_pdf_downloads = new Map());

function normalizeProfile(data: Record<string, unknown>): UserProfile {
  return {
    ...data,
    custom_links: typeof data.custom_links === 'string' ? JSON.parse(data.custom_links) : (data.custom_links || []),
    experience: typeof data.experience === 'string' ? JSON.parse(data.experience) : (data.experience || []),
    section_visibility: typeof data.section_visibility === 'string'
      ? JSON.parse(data.section_visibility)
      : (data.section_visibility || DEFAULT_SECTION_VISIBILITY),
  } as UserProfile;
}

/**
 * Kullanıcı profilini getirir. Gerçekten GitHub'da yoksa NULL döndürür.
 */
export async function getProfileByUsername(username: string): Promise<UserProfile | null> {
  const normalizedUser = sanitizeUsername(username);
  if (!normalizedUser) return null;

  // 1. Supabase kontrol et
  if (supabaseAdmin) {
    try {
      const { data, error } = await supabaseAdmin
        .from('profiles')
        .select('*')
        .ilike('username', normalizedUser)
        .single();

      if (data && !error) {
        return normalizeProfile(data);
      }
    } catch (err) {
      console.warn(`Supabase getProfileByUsername error for ${username}:`, err);
    }
  }

  // 2. Bellek mağazasını kontrol et
  if (memoryProfilesStore.has(normalizedUser)) {
    return memoryProfilesStore.get(normalizedUser)!;
  }

  // 3. Özel demo hesaplarında doğrudan mock profil oluştur
  if (normalizedUser === 'ornek-ogrenci' || normalizedUser === 'demo') {
    const mockUser = getMockGitHubUserData(normalizedUser);
    const mockProfile: UserProfile = {
      id: crypto.randomUUID(),
      github_id: String(mockUser.id),
      username: normalizedUser,
      name: mockUser.name,
      avatar_url: mockUser.avatar_url,
      bio: mockUser.bio,
      custom_bio: null,
      company: mockUser.company,
      location: mockUser.location,
      email: mockUser.email,
      blog: mockUser.blog,
      theme: 'gece',
      custom_links: [],
      experience: [],
      section_visibility: DEFAULT_SECTION_VISIBILITY,
    };
    memoryProfilesStore.set(normalizedUser, mockProfile);
    return mockProfile;
  }

  if (!isValidGitHubUsername(normalizedUser)) {
    return null;
  }

  // 4. Canlı GitHub REST API'den gerçek veriyi çek
  const realGithubUser = await fetchGitHubUserData(normalizedUser);

  if (realGithubUser) {
    const profile: UserProfile = {
      id: crypto.randomUUID(),
      github_id: String(realGithubUser.id),
      username: realGithubUser.login.toLowerCase(),
      name: realGithubUser.name || realGithubUser.login,
      avatar_url: realGithubUser.avatar_url,
      bio: realGithubUser.bio,
      custom_bio: null,
      company: realGithubUser.company,
      location: realGithubUser.location,
      email: realGithubUser.email,
      blog: realGithubUser.blog,
      theme: 'gece',
      custom_links: [],
      experience: [],
      section_visibility: DEFAULT_SECTION_VISIBILITY,
    };
    memoryProfilesStore.set(normalizedUser, profile);
    return profile;
  }

  return null;
}

/**
 * Kullanıcı profilini günceller
 */
export async function upsertProfile(profile: Partial<UserProfile> & { username: string; github_id: string }): Promise<UserProfile> {
  const normalizedUser = sanitizeUsername(profile.username);

  if (supabaseAdmin) {
    try {
      const { data, error } = await supabaseAdmin
        .from('profiles')
        .upsert(
          {
            github_id: profile.github_id,
            username: normalizedUser,
            name: profile.name,
            avatar_url: profile.avatar_url,
            bio: profile.bio,
            custom_bio: profile.custom_bio,
            company: profile.company,
            location: profile.location,
            email: profile.email,
            blog: profile.blog,
            theme: profile.theme || 'gece',
            custom_links: profile.custom_links || [],
            experience: profile.experience || [],
            section_visibility: profile.section_visibility || DEFAULT_SECTION_VISIBILITY,
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'github_id' }
        )
        .select()
        .single();

      if (data && !error) {
        const result = normalizeProfile(data);
        memoryProfilesStore.set(normalizedUser, result);
        return result;
      }
    } catch (err) {
      console.warn('Supabase upsertProfile error:', err);
    }
  }

  const existing = await getProfileByUsername(normalizedUser);
  const updatedProfile: UserProfile = {
    id: existing?.id || crypto.randomUUID(),
    github_id: profile.github_id,
    username: normalizedUser,
    name: profile.name ?? existing?.name ?? null,
    avatar_url: profile.avatar_url || existing?.avatar_url || '',
    bio: profile.bio ?? existing?.bio ?? null,
    custom_bio: profile.custom_bio ?? existing?.custom_bio ?? null,
    company: profile.company ?? existing?.company ?? null,
    location: profile.location ?? existing?.location ?? null,
    email: profile.email ?? existing?.email ?? null,
    blog: profile.blog ?? existing?.blog ?? null,
    theme: profile.theme || existing?.theme || 'gece',
    custom_links: profile.custom_links || existing?.custom_links || [],
    experience: profile.experience || existing?.experience || [],
    section_visibility: profile.section_visibility || existing?.section_visibility || DEFAULT_SECTION_VISIBILITY,
  };
  memoryProfilesStore.set(normalizedUser, updatedProfile);
  return updatedProfile;
}

/**
 * Repoları getirir.
 */
export async function getCachedReposByUsername(username: string): Promise<Repository[]> {
  const normalizedUser = sanitizeUsername(username);
  if (!normalizedUser) return [];

  // 1. Supabase kontrolü
  if (supabaseAdmin) {
    try {
      const profile = await getProfileByUsername(normalizedUser);
      if (profile) {
        const { data, error } = await supabaseAdmin
          .from('cached_repos')
          .select('*')
          .eq('user_id', profile.id)
          .order('stargazers_count', { ascending: false });

        if (data && !error && data.length > 0) {
          return data as Repository[];
        }
      }
    } catch (err) {
      console.warn(`Supabase getCachedRepos error for ${username}:`, err);
    }
  }

  // 2. Bellek deposunu kontrol et
  if (memoryReposStore.has(normalizedUser)) {
    return memoryReposStore.get(normalizedUser)!;
  }

  // 3. Canlı GitHub REST API'den kullanıcının gerçek repolarını çek
  const realRepos = await fetchTopStarredRepos(normalizedUser);

  if (realRepos.length > 0) {
    memoryReposStore.set(normalizedUser, realRepos);
    return realRepos;
  }

  // Demo kullanıcısı için varsayılan repolar
  if (normalizedUser === 'ornek-ogrenci' || normalizedUser === 'demo') {
    const mockRepos = getMockRepositories(normalizedUser);
    memoryReposStore.set(normalizedUser, mockRepos);
    return mockRepos;
  }

  return [];
}

/**
 * Repoları kaydeder
 */
export async function saveCachedRepos(userProfile: UserProfile, repos: Repository[]): Promise<Repository[]> {
  const normalizedUser = sanitizeUsername(userProfile.username);

  if (supabaseAdmin) {
    try {
      const reposToSave = repos.map((repo) => ({
        user_id: userProfile.id,
        github_repo_id: repo.github_repo_id,
        name: repo.name,
        full_name: repo.full_name,
        description: repo.description,
        html_url: repo.html_url,
        homepage: repo.homepage || null,
        stargazers_count: repo.stargazers_count,
        forks_count: repo.forks_count,
        language: repo.language,
        languages: repo.languages || {},
        topics: repo.topics || [],
        is_visible: repo.is_visible !== false,
        is_featured: repo.is_featured === true,
        updated_at: new Date().toISOString(),
      }));

      const { data, error } = await supabaseAdmin
        .from('cached_repos')
        .upsert(reposToSave, { onConflict: 'user_id,github_repo_id' })
        .select();

      if (data && !error) {
        return data as Repository[];
      }
    } catch (err) {
      console.warn('Supabase saveCachedRepos error:', err);
    }
  }

  memoryReposStore.set(normalizedUser, repos);
  return repos;
}

/**
 * Repo görünürlüğünü günceller
 */
export async function updateRepoVisibility(userProfile: UserProfile, githubRepoId: number, isVisible: boolean): Promise<boolean> {
  const normalizedUser = sanitizeUsername(userProfile.username);

  if (supabaseAdmin) {
    try {
      await supabaseAdmin
        .from('cached_repos')
        .update({ is_visible: isVisible })
        .eq('user_id', userProfile.id)
        .eq('github_repo_id', githubRepoId);
    } catch (err) {
      console.warn('Supabase updateRepoVisibility error:', err);
    }
  }

  const repos = await getCachedReposByUsername(normalizedUser);
  const updated = repos.map((r) => (r.github_repo_id === githubRepoId ? { ...r, is_visible: isVisible } : r));
  memoryReposStore.set(normalizedUser, updated);
  return true;
}

/**
 * Vitrin (öne çıkan) repoyu ayarlar — kullanıcı başına yalnızca bir tane olabilir.
 */
export async function updateFeaturedRepo(userProfile: UserProfile, githubRepoId: number): Promise<boolean> {
  const normalizedUser = sanitizeUsername(userProfile.username);

  if (supabaseAdmin) {
    try {
      await supabaseAdmin
        .from('cached_repos')
        .update({ is_featured: false })
        .eq('user_id', userProfile.id);
      await supabaseAdmin
        .from('cached_repos')
        .update({ is_featured: true })
        .eq('user_id', userProfile.id)
        .eq('github_repo_id', githubRepoId);
    } catch (err) {
      console.warn('Supabase updateFeaturedRepo error:', err);
    }
  }

  const repos = await getCachedReposByUsername(normalizedUser);
  const updated = repos.map((r) => ({ ...r, is_featured: r.github_repo_id === githubRepoId }));
  memoryReposStore.set(normalizedUser, updated);
  return true;
}

/**
 * Portfolyoyu yayından kaldırır / tekrar yayınlar. Profil verisi silinmez.
 */
export async function setProfilePublished(userProfile: UserProfile, isPublished: boolean): Promise<boolean> {
  const normalizedUser = sanitizeUsername(userProfile.username);

  if (supabaseAdmin) {
    try {
      await supabaseAdmin
        .from('profiles')
        .update({ is_published: isPublished })
        .eq('id', userProfile.id);
    } catch (err) {
      console.warn('Supabase setProfilePublished error:', err);
    }
  }

  const existing = memoryProfilesStore.get(normalizedUser);
  if (existing) {
    memoryProfilesStore.set(normalizedUser, { ...existing, is_published: isPublished });
  }
  return true;
}

/**
 * Hesabı kalıcı olarak siler: profil satırı ve önbelleğe alınmış tüm repolar.
 */
export async function deleteProfile(userProfile: UserProfile): Promise<boolean> {
  const normalizedUser = sanitizeUsername(userProfile.username);

  if (supabaseAdmin) {
    try {
      await supabaseAdmin.from('cached_repos').delete().eq('user_id', userProfile.id);
      await supabaseAdmin.from('profiles').delete().eq('id', userProfile.id);
    } catch (err) {
      console.warn('Supabase deleteProfile error:', err);
    }
  }

  memoryProfilesStore.delete(normalizedUser);
  memoryReposStore.delete(normalizedUser);
  return true;
}

// ─── Analytics: gerçek sayfa görüntülenme / link tıklama kayıtları ─────────

export async function recordPageView(profileId: string, username: string, referrerHost: string | null, visitorHash: string): Promise<void> {
  if (supabaseAdmin) {
    try {
      await supabaseAdmin.from('page_views').insert({ profile_id: profileId, referrer_host: referrerHost, visitor_hash: visitorHash });
      return;
    } catch (err) {
      console.warn('Supabase recordPageView error:', err);
    }
  }

  const normalizedUser = sanitizeUsername(username);
  const list = memoryPageViewsStore.get(normalizedUser) || [];
  list.push({ referrerHost, visitorHash, createdAt: new Date().toISOString() });
  memoryPageViewsStore.set(normalizedUser, list);
}

export async function recordLinkClick(profileId: string, username: string, label: string | null, url: string): Promise<void> {
  if (supabaseAdmin) {
    try {
      await supabaseAdmin.from('link_clicks').insert({ profile_id: profileId, label, url });
      return;
    } catch (err) {
      console.warn('Supabase recordLinkClick error:', err);
    }
  }

  const normalizedUser = sanitizeUsername(username);
  const list = memoryLinkClicksStore.get(normalizedUser) || [];
  list.push({ label, url, createdAt: new Date().toISOString() });
  memoryLinkClicksStore.set(normalizedUser, list);
}

export async function recordPdfDownload(profileId: string, username: string): Promise<void> {
  if (supabaseAdmin) {
    try {
      await supabaseAdmin.from('pdf_downloads').insert({ profile_id: profileId });
      return;
    } catch (err) {
      console.warn('Supabase recordPdfDownload error:', err);
    }
  }

  const normalizedUser = sanitizeUsername(username);
  const list = memoryPdfDownloadsStore.get(normalizedUser) || [];
  list.push({ createdAt: new Date().toISOString() });
  memoryPdfDownloadsStore.set(normalizedUser, list);
}

export interface AnalyticsSummary {
  totalViews: number;
  views30d: number;
  uniqueVisitors30d: number;
  totalLinkClicks: number;
  totalPdfDownloads: number;
  dailyViews: { date: string; count: number }[];
  topReferrers: { host: string; count: number }[];
  topLinks: { label: string; url: string; count: number }[];
}

function buildAnalyticsSummary(
  views: { referrerHost: string | null; visitorHash: string; createdAt: string }[],
  clicks: { label: string | null; url: string; createdAt: string }[],
  pdfDownloads: { createdAt: string }[]
): AnalyticsSummary {
  const now = Date.now();
  const cutoff30d = now - 30 * 24 * 60 * 60 * 1000;

  const views30d = views.filter((v) => new Date(v.createdAt).getTime() >= cutoff30d);
  const uniqueVisitors30d = new Set(views30d.map((v) => v.visitorHash)).size;

  const dailyMap = new Map<string, number>();
  for (let i = 29; i >= 0; i--) {
    const d = new Date(now - i * 24 * 60 * 60 * 1000);
    dailyMap.set(d.toISOString().slice(0, 10), 0);
  }
  views30d.forEach((v) => {
    const day = v.createdAt.slice(0, 10);
    if (dailyMap.has(day)) dailyMap.set(day, (dailyMap.get(day) || 0) + 1);
  });

  const referrerCounts = new Map<string, number>();
  views.forEach((v) => {
    const host = v.referrerHost || 'Doğrudan';
    referrerCounts.set(host, (referrerCounts.get(host) || 0) + 1);
  });

  const linkCounts = new Map<string, { label: string; url: string; count: number }>();
  clicks.forEach((c) => {
    const key = c.url;
    const existing = linkCounts.get(key);
    if (existing) {
      existing.count += 1;
    } else {
      linkCounts.set(key, { label: c.label || c.url, url: c.url, count: 1 });
    }
  });

  return {
    totalViews: views.length,
    views30d: views30d.length,
    uniqueVisitors30d,
    totalLinkClicks: clicks.length,
    totalPdfDownloads: pdfDownloads.length,
    dailyViews: Array.from(dailyMap.entries()).map(([date, count]) => ({ date, count })),
    topReferrers: Array.from(referrerCounts.entries()).sort((a, b) => b[1] - a[1]).slice(0, 6).map(([host, count]) => ({ host, count })),
    topLinks: Array.from(linkCounts.values()).sort((a, b) => b.count - a.count).slice(0, 8),
  };
}

export async function getAnalyticsSummary(userProfile: UserProfile): Promise<AnalyticsSummary> {
  const normalizedUser = sanitizeUsername(userProfile.username);

  if (supabaseAdmin) {
    try {
      const [viewsRes, clicksRes, pdfRes] = await Promise.all([
        supabaseAdmin.from('page_views').select('referrer_host,visitor_hash,created_at').eq('profile_id', userProfile.id),
        supabaseAdmin.from('link_clicks').select('label,url,created_at').eq('profile_id', userProfile.id),
        supabaseAdmin.from('pdf_downloads').select('created_at').eq('profile_id', userProfile.id),
      ]);

      if (!viewsRes.error && !clicksRes.error && !pdfRes.error) {
        const views = (viewsRes.data || []).map((v) => ({ referrerHost: v.referrer_host as string | null, visitorHash: v.visitor_hash as string, createdAt: v.created_at as string }));
        const clicks = (clicksRes.data || []).map((c) => ({ label: c.label as string | null, url: c.url as string, createdAt: c.created_at as string }));
        const pdfDownloads = (pdfRes.data || []).map((p) => ({ createdAt: p.created_at as string }));
        return buildAnalyticsSummary(views, clicks, pdfDownloads);
      }
    } catch (err) {
      console.warn('Supabase getAnalyticsSummary error:', err);
    }
  }

  const views = memoryPageViewsStore.get(normalizedUser) || [];
  const clicks = memoryLinkClicksStore.get(normalizedUser) || [];
  const pdfDownloads = memoryPdfDownloadsStore.get(normalizedUser) || [];
  return buildAnalyticsSummary(views, clicks, pdfDownloads);
}
