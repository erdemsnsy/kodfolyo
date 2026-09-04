export type ThemeType = 'gece' | 'kagit' | 'neon' | 'mercan' | 'zeytin' | 'lavanta' | 'bordo' | 'turkuaz' | 'hardal' | 'karbon';

export interface CustomLink {
  id: string;
  label: string;
  url: string;
  iconName?: string;
}

export interface ExperienceEntry {
  id: string;
  role: string;
  organization: string;
  dateRange: string;
  description: string;
}

export interface ManualProject {
  id: string;
  title: string;
  description: string;
  url?: string;
  imageUrl?: string;
}

export interface Certificate {
  id: string;
  name: string;
  issuer: string;
  date: string;
  url?: string;
}

export interface SectionVisibility {
  techStack: boolean;
  featuredProject: boolean;
  projects: boolean;
  manualProjects: boolean;
  experience: boolean;
  certificates: boolean;
  externalContributions: boolean;
  blogPosts: boolean;
}

export const DEFAULT_SECTION_VISIBILITY: SectionVisibility = {
  techStack: true,
  featuredProject: true,
  projects: true,
  manualProjects: true,
  experience: true,
  certificates: true,
  externalContributions: true,
  blogPosts: true,
};

export interface UserProfile {
  id: string;
  github_id: string;
  username: string;
  name: string | null;
  avatar_url: string;
  bio: string | null;
  custom_bio: string | null;
  company: string | null;
  location: string | null;
  email: string | null;
  blog: string | null;
  theme: ThemeType;
  custom_links: CustomLink[];
  experience: ExperienceEntry[];
  manual_projects: ManualProject[];
  certificates: Certificate[];
  section_visibility: SectionVisibility;
  is_published?: boolean;
  custom_domain?: string | null;
  custom_domain_verified?: boolean;
  rss_url?: string | null;
  seo_title?: string | null;
  seo_description?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface Repository {
  id?: string;
  user_id?: string;
  github_repo_id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  homepage?: string | null;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  languages?: Record<string, number>;
  topics?: string[];
  is_visible: boolean;
  is_featured?: boolean;
  updated_at?: string;
}

export interface GitHubUserData {
  id: number;
  login: string;
  name: string | null;
  avatar_url: string;
  bio: string | null;
  company: string | null;
  location: string | null;
  email: string | null;
  blog: string | null;
  html_url: string;
  public_repos: number;
  followers: number;
  following: number;
}

export interface GitHubRepoData {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  homepage?: string | null;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  topics?: string[];
  fork: boolean;
  archived: boolean;
  updated_at: string;
}
