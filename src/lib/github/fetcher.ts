import { GitHubUserData, GitHubRepoData, Repository } from '@/types';

const GITHUB_API_BASE = 'https://api.github.com';

/**
 * GitHub kullanıcı adı formatını kontrol eder (Sadece A-Z, 0-9 ve tek tire içerir, 1-39 karakter)
 */
export function isValidGitHubUsername(username: string): boolean {
  if (!username) return false;
  const regex = /^[a-z0-9](?:[a-z0-9]|-(?=[a-z0-9])){0,38}$/i;
  return regex.test(username);
}

/**
 * Kullanıcı adını veya yapıştırılan GitHub URL'lerini temizler
 */
export function sanitizeUsername(input: string): string {
  if (!input) return '';
  const cleaned = input
    .trim()
    .replace(/^https?:\/\/(www\.)?github\.com\//i, '')
    .replace(/^@/, '')
    .split('/')[0]
    .toLowerCase();
  
  return cleaned;
}

function getHeaders(accessToken?: string): HeadersInit {
  const headers: HeadersInit = {
    Accept: 'application/vnd.github.v3+json',
    'User-Agent': 'Kodfolyo-App',
  };
  if (accessToken) {
    headers.Authorization = `Bearer ${accessToken}`;
  }
  return headers;
}

/**
 * GitHub API'den kullanıcının GERÇEK verilerini çeker.
 * Sadece GitHub'da GERÇEKTEN var olan kullanıcılar için verileri döndürür.
 * 404, 400, 422 veya geçersiz kullanıcı adlarında KESİNLİKLE null döndürür.
 */
export async function fetchGitHubUserData(
  rawUsername: string,
  accessToken?: string
): Promise<GitHubUserData | null> {
  const username = sanitizeUsername(rawUsername);
  
  // GitHub kullanıcı adı kuralına uymuyorsa (Örn: Türkçe karakter, boşluk vb.) direkt iptal et
  if (!username || !isValidGitHubUsername(username)) {
    console.warn(`Geçersiz GitHub kullanıcı adı formatı: ${username}`);
    return null;
  }

  try {
    const res = await fetch(`${GITHUB_API_BASE}/users/${encodeURIComponent(username)}`, {
      headers: getHeaders(accessToken),
      next: { revalidate: 600 },
    });

    if (!res.ok) {
      console.warn(`GitHub API HTTP ${res.status} for username: ${username}`);
      return null;
    }

    const data: GitHubUserData = await res.json();
    
    // Güvenlik doğrulaması: Çekilen login bilgisi eşleşmeli
    if (!data || !data.login) {
      return null;
    }

    return data;
  } catch (error) {
    console.error('GitHub API bağlantı hatası:', error);
    return null;
  }
}

/**
 * Kullanıcının en çok yıldız alan GERÇEK repolarını çeker.
 */
export async function fetchTopStarredRepos(
  rawUsername: string,
  accessToken?: string
): Promise<Repository[]> {
  const username = sanitizeUsername(rawUsername);
  if (!username || !isValidGitHubUsername(username)) return [];

  try {
    const res = await fetch(
      `${GITHUB_API_BASE}/users/${encodeURIComponent(username)}/repos?per_page=100&sort=updated`,
      {
        headers: getHeaders(accessToken),
        next: { revalidate: 600 },
      }
    );

    if (!res.ok) {
      console.warn(`GitHub repos fetch error HTTP ${res.status} for ${username}`);
      return [];
    }

    const repos: GitHubRepoData[] = await res.json();
    if (!Array.isArray(repos)) return [];

    const nonForks = repos.filter((r) => !r.fork);
    const sorted = (nonForks.length > 0 ? nonForks : repos).sort(
      (a, b) => b.stargazers_count - a.stargazers_count
    );

    const targetRepos = sorted.slice(0, 6);

    const repoPromises = targetRepos.map(async (repo) => {
      let languages: Record<string, number> = {};
      try {
        const langRes = await fetch(
          `${GITHUB_API_BASE}/repos/${encodeURIComponent(username)}/${encodeURIComponent(repo.name)}/languages`,
          { headers: getHeaders(accessToken) }
        );
        if (langRes.ok) {
          languages = await langRes.json();
        }
      } catch (err) {
        console.warn(`Language fetch error for ${repo.name}:`, err);
      }

      return {
        github_repo_id: repo.id,
        name: repo.name,
        full_name: repo.full_name,
        description: repo.description || null,
        html_url: repo.html_url,
        homepage: repo.homepage || null,
        stargazers_count: repo.stargazers_count,
        forks_count: repo.forks_count,
        language: repo.language || (Object.keys(languages)[0] ?? 'Code'),
        languages,
        topics: repo.topics || [],
        is_visible: true,
        is_featured: false,
      } as Repository;
    });

    return await Promise.all(repoPromises);
  } catch (error) {
    console.error('Error fetching top starred repos:', error);
    return [];
  }
}

export interface DiscoverProfileSummary {
  username: string;
  name: string | null;
  avatarUrl: string;
  location: string | null;
  topLanguages: string[];
  totalStars: number;
}

/**
 * Keşfet sayfası için hafif özet: dil breakdown çağrıları yapılmaz
 * (repo.language alanı yeterli), sadece 2 istek/kullanıcı.
 */
export async function fetchDiscoverProfileSummary(rawUsername: string, accessToken?: string): Promise<DiscoverProfileSummary | null> {
  const username = sanitizeUsername(rawUsername);
  if (!username || !isValidGitHubUsername(username)) return null;

  const userData = await fetchGitHubUserData(username, accessToken);
  if (!userData) return null;

  try {
    const res = await fetch(`${GITHUB_API_BASE}/users/${encodeURIComponent(username)}/repos?per_page=100&sort=updated`, {
      headers: getHeaders(accessToken),
      next: { revalidate: 600 },
    });
    const repos: GitHubRepoData[] = res.ok ? await res.json() : [];
    const nonForks = Array.isArray(repos) ? repos.filter((r) => !r.fork) : [];

    const langCounts = new Map<string, number>();
    let totalStars = 0;
    for (const repo of nonForks) {
      totalStars += repo.stargazers_count || 0;
      if (repo.language) langCounts.set(repo.language, (langCounts.get(repo.language) || 0) + 1);
    }

    const topLanguages = Array.from(langCounts.entries()).sort((a, b) => b[1] - a[1]).slice(0, 3).map(([lang]) => lang);

    return {
      username: userData.login,
      name: userData.name,
      avatarUrl: userData.avatar_url,
      location: userData.location,
      topLanguages,
      totalStars,
    };
  } catch (error) {
    console.warn(`Discover summary fetch error for ${username}:`, error);
    return {
      username: userData.login,
      name: userData.name,
      avatarUrl: userData.avatar_url,
      location: userData.location,
      topLanguages: [],
      totalStars: 0,
    };
  }
}

export interface ExternalContribution {
  repoFullName: string;
  repoUrl: string;
  mergedPrCount: number;
  stars: number;
}

/**
 * Kullanıcının KENDİ repoları dışında, birleşmiş (merged) PR açtığı
 * projeleri GitHub Search API üzerinden gerçek veriyle döner.
 */
export async function fetchExternalContributions(rawUsername: string, accessToken?: string): Promise<ExternalContribution[]> {
  const username = sanitizeUsername(rawUsername);
  if (!username || !isValidGitHubUsername(username)) return [];

  try {
    const searchRes = await fetch(
      `${GITHUB_API_BASE}/search/issues?q=${encodeURIComponent(`author:${username} type:pr is:merged`)}&per_page=100&sort=created&order=desc`,
      { headers: getHeaders(accessToken), next: { revalidate: 3600 } }
    );
    if (!searchRes.ok) return [];

    const searchData = await searchRes.json();
    const items: { repository_url: string }[] = Array.isArray(searchData.items) ? searchData.items : [];

    const countsByRepo = new Map<string, number>();
    for (const item of items) {
      const fullName = item.repository_url.replace(`${GITHUB_API_BASE}/repos/`, '');
      const ownerLogin = fullName.split('/')[0];
      if (ownerLogin.toLowerCase() === username.toLowerCase()) continue; // kendi reposu, dış katkı sayılmaz
      countsByRepo.set(fullName, (countsByRepo.get(fullName) || 0) + 1);
    }

    const topRepos = Array.from(countsByRepo.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8);

    const contributions = await Promise.all(
      topRepos.map(async ([fullName, mergedPrCount]) => {
        let stars = 0;
        try {
          const repoRes = await fetch(`${GITHUB_API_BASE}/repos/${fullName}`, { headers: getHeaders(accessToken), next: { revalidate: 3600 } });
          if (repoRes.ok) {
            const repoData = await repoRes.json();
            stars = repoData.stargazers_count || 0;
          }
        } catch {
          // repo bilgisi alınamazsa yıldız 0 kalır, katkı yine de gösterilir
        }
        return { repoFullName: fullName, repoUrl: `https://github.com/${fullName}`, mergedPrCount, stars };
      })
    );

    return contributions.sort((a, b) => b.stars - a.stars);
  } catch (error) {
    console.warn('Error fetching external contributions:', error);
    return [];
  }
}

/**
 * Yalnızca harici demo amacıyla mock veri üreticiler
 */
export function getMockGitHubUserData(username: string): GitHubUserData {
  const clean = sanitizeUsername(username) || 'ornek-ogrenci';
  return {
    id: 583231,
    login: clean,
    name: 'Elif Kaya',
    avatar_url: 'https://avatars.githubusercontent.com/u/583231?v=4',
    bio: 'Full-stack Web Geliştirici',
    company: 'Kodfolyo Tech',
    location: 'İstanbul, Türkiye',
    email: 'ogrenci@example.com',
    blog: `https://github.com/${clean}`,
    html_url: `https://github.com/${clean}`,
    public_repos: 14,
    followers: 128,
    following: 42,
  };
}

export function getMockRepositories(username: string): Repository[] {
  const user = sanitizeUsername(username) || 'ornek-ogrenci';
  return [
    {
      github_repo_id: 101,
      name: 'kodfolyo-app',
      full_name: `${user}/kodfolyo-app`,
      description: 'GitHub profil verilerinden otomatik modern tek sayfa portföy oluşturan web uygulaması.',
      html_url: `https://github.com/${user}/kodfolyo-app`,
      homepage: 'https://kodfolyo.dev',
      stargazers_count: 42,
      forks_count: 8,
      language: 'TypeScript',
      languages: { TypeScript: 15400, CSS: 2300, HTML: 1200 },
      topics: ['nextjs', 'react', 'tailwind', 'supabase', 'portfolio'],
      is_visible: true,
      is_featured: true,
    },
    {
      github_repo_id: 102,
      name: 'smart-task-manager',
      full_name: `${user}/smart-task-manager`,
      description: 'Öğrenciler için ders takibi ve çalışma zamanlayıcısı sunan PWA uygulaması.',
      html_url: `https://github.com/${user}/smart-task-manager`,
      stargazers_count: 28,
      forks_count: 5,
      language: 'TypeScript',
      languages: { TypeScript: 12000, React: 8500 },
      topics: ['pwa', 'productivity', 'student'],
      is_visible: true,
    },
  ];
}
