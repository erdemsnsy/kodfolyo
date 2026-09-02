'use client';

import { Repository, ThemeType } from '@/types';
import { getTheme } from '@/lib/theme';
import { Star, GitFork } from 'lucide-react';
import { languageColor, relativeTimeTr } from '@/lib/languageColors';

interface ProjectCardProps {
  repo: Repository;
  themeType?: ThemeType;
}

export default function ProjectCard({ repo, themeType }: ProjectCardProps) {
  const theme = getTheme(themeType);

  return (
    <div style={{ padding: 20, borderRadius: 15, background: 'rgba(25,23,32,.035)', border: `1px solid ${theme.border}`, transition: '.18s' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 14, marginBottom: 9 }}>
        <a
          href={repo.html_url} target="_blank" rel="noopener noreferrer"
          style={{ fontFamily: 'var(--font-mono)', fontSize: 15, fontWeight: 500, color: theme.ink, textDecoration: 'none' }}
        >
          {repo.name}
        </a>
      </div>
      <div style={{ fontSize: 14, lineHeight: 1.5, color: theme.muted, marginBottom: 18, minHeight: 42 }}>
        {repo.description || 'Açıklama belirtilmemiş.'}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, fontFamily: 'var(--font-mono)', fontSize: 12.5, color: theme.mutedLight, flexWrap: 'wrap' }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
          <span style={{ width: 9, height: 9, borderRadius: '50%', background: languageColor(repo.language) }} />
          {repo.language || 'Code'}
        </span>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}><Star className="w-3.5 h-3.5" /> {repo.stargazers_count}</span>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}><GitFork className="w-3.5 h-3.5" /> {repo.forks_count}</span>
        {repo.updated_at && <span style={{ marginLeft: 'auto' }}>{relativeTimeTr(repo.updated_at)}</span>}
      </div>
    </div>
  );
}
