import { createClient } from '@supabase/supabase-js';
import { UserProfile, Repository } from '@/types';
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
}

const memoryProfilesStore: Map<string, UserProfile> =
  globalThis._kodfolyo_profiles ?? (globalThis._kodfolyo_profiles = new Map<string, UserProfile>());

const memoryReposStore: Map<string, Repository[]> =
  globalThis._kodfolyo_repos ?? (globalThis._kodfolyo_repos = new Map<string, Repository[]>());

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
        return {
          ...data,
          custom_links: typeof data.custom_links === 'string' ? JSON.parse(data.custom_links) : (data.custom_links || []),
        } as UserProfile;
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
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'github_id' }
        )
        .select()
        .single();

      if (data && !error) {
        const result = {
          ...data,
          custom_links: typeof data.custom_links === 'string' ? JSON.parse(data.custom_links) : (data.custom_links || []),
        } as UserProfile;
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
        stargazers_count: repo.stargazers_count,
        forks_count: repo.forks_count,
        language: repo.language,
        languages: repo.languages || {},
        topics: repo.topics || [],
        is_visible: repo.is_visible !== false,
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
