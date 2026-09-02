'use client';

import { ExperienceEntry, ThemeType } from '@/types';
import { getTheme } from '@/lib/theme';

interface ExperienceTimelineProps {
  entries: ExperienceEntry[];
  themeType?: ThemeType;
}

export default function ExperienceTimeline({ entries, themeType }: ExperienceTimelineProps) {
  const theme = getTheme(themeType);

  if (!entries || entries.length === 0) return null;

  return (
    <section style={{ padding: '0 clamp(16px, 5vw, 40px) 60px' }}>
      <div style={{ maxWidth: 1020, margin: '0 auto' }}>
        <h2 style={{ margin: '0 0 20px', fontSize: 28, fontWeight: 800, letterSpacing: '-.03em', color: theme.ink }}>
          Deneyim & Eğitim
        </h2>

        <div style={{ position: 'relative', paddingLeft: 24 }}>
          <div style={{ position: 'absolute', left: 5, top: 6, bottom: 6, width: 2, background: theme.border }} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 26 }}>
            {entries.map((entry) => (
              <div key={entry.id} style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: -24, top: 4, width: 12, height: 12, borderRadius: '50%', background: theme.a, border: `2px solid ${theme.card}`, boxShadow: `0 0 0 2px ${theme.border}` }} />
                <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
                  <span style={{ fontSize: 15.5, fontWeight: 700, color: theme.ink }}>{entry.role}</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: theme.mutedLight }}>{entry.dateRange}</span>
                </div>
                <div style={{ fontSize: 13.5, color: theme.a, fontWeight: 600, marginTop: 2 }}>{entry.organization}</div>
                {entry.description && (
                  <p style={{ margin: '6px 0 0', fontSize: 13.5, lineHeight: 1.55, color: theme.muted, maxWidth: 640 }}>{entry.description}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
