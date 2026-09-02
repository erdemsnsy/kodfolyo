import { ThemeType } from '@/types';
import { getTheme } from '@/lib/theme';
import type { ExternalContribution } from '@/lib/github/fetcher';
import { GitPullRequest, Star } from 'lucide-react';

interface ExternalContributionsProps {
  contributions: ExternalContribution[];
  themeType?: ThemeType;
}

export default function ExternalContributions({ contributions, themeType }: ExternalContributionsProps) {
  const theme = getTheme(themeType);

  if (!contributions || contributions.length === 0) return null;

  return (
    <section style={{ padding: '0 clamp(16px, 5vw, 40px) 60px' }}>
      <div style={{ maxWidth: 1020, margin: '0 auto' }}>
        <h2 style={{ margin: '0 0 20px', fontSize: 28, fontWeight: 800, letterSpacing: '-.03em', color: theme.ink }}>
          Dış Katkılar
        </h2>

        <div style={{ display: 'flex', gap: 12, overflowX: 'auto', paddingBottom: 6 }}>
          {contributions.map((c) => (
            <a
              key={c.repoFullName}
              href={c.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                flexShrink: 0, minWidth: 200, display: 'flex', flexDirection: 'column', gap: 10, padding: 16, borderRadius: 13,
                border: `1px solid ${theme.border}`, background: theme.card, textDecoration: 'none',
              }}
            >
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 600, color: theme.ink, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {c.repoFullName}
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 12.5, color: theme.a, fontWeight: 600 }}>
                  <GitPullRequest className="w-3.5 h-3.5" /> {c.mergedPrCount} PR
                </span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontFamily: 'var(--font-mono)', fontSize: 12, color: theme.mutedLight }}>
                  <Star className="w-3.5 h-3.5" /> {c.stars}
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
