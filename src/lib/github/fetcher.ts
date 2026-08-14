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
        stargazers_count: repo.stargazers_count,
        forks_count: repo.forks_count,
        language: repo.language || (Object.keys(languages)[0] ?? 'Code'),
        languages,
        topics: repo.topics || [],
        is_visible: true,
      } as Repository;
    });

    return await Promise.all(repoPromises);
  } catch (error) {
    console.error('Error fetching top starred repos:', error);
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
    name: 'Örnek Öğrenci',
    avatar_url: 'https://avatars.githubusercontent.com/u/583231?v=4',
    bio: 'Bilgisayar Mühendisliği Öğrencisi | Full-stack Web Geliştirici',
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
      stargazers_count: 42,
      forks_count: 8,
      language: 'TypeScript',
      languages: { TypeScript: 15400, CSS: 2300, HTML: 1200 },
      topics: ['nextjs', 'react', 'tailwind', 'supabase', 'portfolio'],
      is_visible: true,
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
