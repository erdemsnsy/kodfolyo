'use client';

import { Repository, ThemeType } from '@/types';
import { getTheme } from '@/lib/theme';
import { languageColor } from '@/lib/languageColors';

interface TechStackProps {
  repos: Repository[];
  themeType?: ThemeType;
}

export default function TechStack({ repos, themeType }: TechStackProps) {
  const theme = getTheme(themeType);

  const langCounts: Record<string, number> = {};
  let totalScore = 0;

  repos.forEach((repo) => {
    if (repo.is_visible !== false) {
      if (repo.language) {
        langCounts[repo.language] = (langCounts[repo.language] || 0) + 3;
        totalScore += 3;
      }
      if (repo.languages) {
        Object.entries(repo.languages).forEach(([lang, bytes]) => {
          langCounts[lang] = (langCounts[lang] || 0) + Math.min(bytes, 5000);
          totalScore += Math.min(bytes, 5000);
        });
      }
    }
  });

  const sortedLangs = Object.entries(langCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 7);

  if (sortedLangs.length === 0) return null;

  const visibleRepoCount = repos.filter((r) => r.is_visible !== false).length;

  return (
    <div style={{ padding: '8px clamp(16px, 5vw, 40px) 0' }}>
      <div style={{ maxWidth: 1020, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 12 }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: theme.mutedLight }}>
            DİL DAĞILIMI · {visibleRepoCount} REPO
          </span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: theme.mutedLight }}>%100</span>
        </div>

        <div style={{ display: 'flex', height: 12, borderRadius: 999, overflow: 'hidden', gap: 2 }}>
          {sortedLangs.map(([lang, count]) => {
            const pct = Math.max(3, Math.round((count / (totalScore || 1)) * 100));
            return <div key={lang} style={{ width: `${pct}%`, background: languageColor(lang) }} title={`${lang}: %${pct}`} />;
          })}
        </div>

        <div style={{ display: 'flex', gap: 18, flexWrap: 'wrap', marginTop: 13 }}>
          {sortedLangs.map(([lang, count]) => {
            const pct = Math.round((count / (totalScore || 1)) * 100);
            return (
              <span key={lang} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 13, color: theme.dim }}>
                <span style={{ width: 9, height: 9, borderRadius: '50%', background: languageColor(lang) }} />
                {lang} <span style={{ fontFamily: 'var(--font-mono)', color: theme.mutedLight }}>%{pct}</span>
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
}
