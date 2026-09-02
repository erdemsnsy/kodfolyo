'use client';

import { Repository, ThemeType } from '@/types';
import { getTheme } from '@/lib/theme';
import { Star, GitFork, ExternalLink, Rocket } from 'lucide-react';

interface FeaturedProjectCardProps {
  repo: Repository;
  themeType?: ThemeType;
}

// Süslü, çizgili soyut görsel yer tutucu — theme'in iki vurgu rengini kullanır.
function AbstractPlaceholder({ colorA, colorB }: { colorA: string; colorB: string }) {
  return (
    <svg width="100%" height="100%" viewBox="0 0 260 200" preserveAspectRatio="xMidYMid slice">
      <rect width="260" height="200" fill={`${colorA}0D`} />
      {Array.from({ length: 9 }).map((_, i) => (
        <line key={i} x1={-40 + i * 40} y1="220" x2={i * 40 + 100} y2="-20" stroke={i % 2 === 0 ? colorA : colorB} strokeWidth="2" opacity="0.35" />
      ))}
      <circle cx="180" cy="70" r="34" fill="none" stroke={colorA} strokeWidth="2" opacity="0.6" />
      <circle cx="90" cy="140" r="20" fill={colorB} opacity="0.25" />
    </svg>
  );
}

export default function FeaturedProjectCard({ repo, themeType }: FeaturedProjectCardProps) {
  const theme = getTheme(themeType);

  return (
    <div style={{ maxWidth: 1020, margin: '0 auto', padding: '0 clamp(16px, 5vw, 40px) 24px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 1fr', borderRadius: 18, overflow: 'hidden', border: `1px solid ${theme.border}`, background: theme.card }} className="featured-project-grid">
        <div style={{ padding: 28, display: 'flex', flexDirection: 'column', gap: 14 }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: theme.a, textTransform: 'uppercase', letterSpacing: '.06em' }}>
            ★ Vitrin Projesi
          </span>
          <h3 style={{ margin: 0, fontFamily: 'var(--font-mono)', fontSize: 20, fontWeight: 500, color: theme.ink }}>{repo.name}</h3>
          <p style={{ margin: 0, fontSize: 14.5, lineHeight: 1.6, color: theme.muted }}>
            {repo.description || 'Açıklama belirtilmemiş.'}
          </p>

          {repo.topics && repo.topics.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {repo.topics.slice(0, 5).map((topic) => (
                <span key={topic} style={{ fontFamily: 'var(--font-mono)', fontSize: 11, padding: '4px 10px', borderRadius: 999, background: 'rgba(25,23,32,.05)', color: theme.dim }}>
                  #{topic}
                </span>
              ))}
            </div>
          )}

          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 'auto', paddingTop: 10, flexWrap: 'wrap' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontFamily: 'var(--font-mono)', fontSize: 12.5, color: theme.mutedLight }}>
              <Star className="w-3.5 h-3.5" /> {repo.stargazers_count}
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontFamily: 'var(--font-mono)', fontSize: 12.5, color: theme.mutedLight }}>
              <GitFork className="w-3.5 h-3.5" /> {repo.forks_count}
            </span>
            <a
              href={repo.html_url} target="_blank" rel="noopener noreferrer"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 600, color: theme.ink, textDecoration: 'none', marginLeft: 'auto' }}
            >
              <ExternalLink className="w-3.5 h-3.5" /> GitHub
            </a>
            {repo.homepage && (
              <a
                href={repo.homepage} target="_blank" rel="noopener noreferrer"
                style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 700, color: '#F4F1EA', background: theme.a, borderRadius: 999, padding: '7px 14px', textDecoration: 'none' }}
              >
                <Rocket className="w-3.5 h-3.5" /> Canlı Demo
              </a>
            )}
          </div>
        </div>

        <div className="featured-project-visual" style={{ minHeight: 160 }}>
          <AbstractPlaceholder colorA={theme.a} colorB={theme.b} />
        </div>
      </div>

      <style>{`
        @media (max-width: 640px) {
          .featured-project-grid { grid-template-columns: 1fr !important; }
          .featured-project-visual { display: none; }
        }
      `}</style>
    </div>
  );
}
