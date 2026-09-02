export type ThemeType = 'gece' | 'kagit' | 'neon' | 'mercan';

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

export interface SectionVisibility {
  techStack: boolean;
  featuredProject: boolean;
  projects: boolean;
  experience: boolean;
}

export const DEFAULT_SECTION_VISIBILITY: SectionVisibility = {
  techStack: true,
  featuredProject: true,
  projects: true,
  experience: true,
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
  section_visibility: SectionVisibility;
  is_published?: boolean;
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
