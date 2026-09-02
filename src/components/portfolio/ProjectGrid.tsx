'use client';

import { Repository, ThemeType } from '@/types';
import { getTheme } from '@/lib/theme';
import ProjectCard from './ProjectCard';
import { FolderGit2 } from 'lucide-react';

interface ProjectGridProps {
  repos: Repository[];
  themeType?: ThemeType;
}

export default function ProjectGrid({ repos, themeType }: ProjectGridProps) {
  const theme = getTheme(themeType);
  const visibleRepos = repos.filter((r) => r.is_visible !== false);

  if (visibleRepos.length === 0) {
    return (
      <div style={{ maxWidth: 1020, margin: '0 auto', padding: '0 clamp(16px, 5vw, 40px) 60px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 18, padding: 22, borderRadius: 13, background: theme.surface, border: `1px dashed ${theme.borderStrong}` }}>
          <FolderGit2 className="w-8 h-8" style={{ color: theme.muted }} />
          <div>
            <div style={{ fontSize: 14.5, fontWeight: 700, marginBottom: 4, color: theme.ink }}>Görünür Repo Bulunmuyor</div>
            <div style={{ fontSize: 13.5, color: theme.muted }}>Henüz görünür durumda repo seçilmemiş veya veriler senkronize edilmedi.</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <section style={{ padding: '46px clamp(16px, 5vw, 40px) 80px' }}>
      <div style={{ maxWidth: 1020, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 18 }}>
          <h2 style={{ margin: 0, fontSize: 28, fontWeight: 800, letterSpacing: '-.03em', color: theme.ink }}>Öne çıkan projeler</h2>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: theme.mutedLight }}>{visibleRepos.length} repo</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 14 }}>
          {visibleRepos.map((repo) => (
            <ProjectCard key={repo.github_repo_id || repo.name} repo={repo} themeType={themeType} />
          ))}
        </div>
      </div>
    </section>
  );
}
