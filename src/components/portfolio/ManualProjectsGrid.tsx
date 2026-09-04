'use client';

import { ManualProject, ThemeType } from '@/types';
import { getTheme } from '@/lib/theme';
import { ExternalLink, FolderGit2 } from 'lucide-react';

interface ManualProjectsGridProps {
  projects: ManualProject[];
  themeType?: ThemeType;
}

// GitHub reposu olmayan projeler (freelance, okul ödevi, kapalı kaynak iş)
// için ikinci bir grid — ProjectGrid'in reposuz karşılığı.
export default function ManualProjectsGrid({ projects, themeType }: ManualProjectsGridProps) {
  const theme = getTheme(themeType);

  if (!projects || projects.length === 0) return null;

  return (
    <section style={{ padding: '0 clamp(16px, 5vw, 40px) 60px' }}>
      <div style={{ maxWidth: 1020, margin: '0 auto' }}>
        <h2 style={{ margin: '0 0 20px', fontSize: 28, fontWeight: 800, letterSpacing: '-.03em', color: theme.ink }}>
          Diğer Projeler
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 14 }}>
          {projects.map((project) => {
            const Wrapper = project.url ? 'a' : 'div';
            return (
              <Wrapper
                key={project.id}
                {...(project.url ? { href: project.url, target: '_blank', rel: 'noopener noreferrer' } : {})}
                style={{ display: 'flex', flexDirection: 'column', borderRadius: 15, background: 'rgba(25,23,32,.035)', border: `1px solid ${theme.border}`, textDecoration: 'none', overflow: 'hidden' }}
              >
                {project.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element -- kullanıcı tanımlı, keyfi host
                  <img src={project.imageUrl} alt="" style={{ width: '100%', height: 140, objectFit: 'cover' }} />
                ) : (
                  <div style={{ width: '100%', height: 140, display: 'grid', placeItems: 'center', background: theme.surfaceAlt, color: theme.faint }}>
                    <FolderGit2 className="w-8 h-8" />
                  </div>
                )}
                <div style={{ padding: 20 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, marginBottom: 9 }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 15, fontWeight: 500, color: theme.ink }}>{project.title}</span>
                    {project.url && <ExternalLink className="w-3.5 h-3.5" style={{ color: theme.mutedLight, flexShrink: 0 }} />}
                  </div>
                  <div style={{ fontSize: 14, lineHeight: 1.5, color: theme.muted }}>
                    {project.description || 'Açıklama belirtilmemiş.'}
                  </div>
                </div>
              </Wrapper>
            );
          })}
        </div>
      </div>
    </section>
  );
}
