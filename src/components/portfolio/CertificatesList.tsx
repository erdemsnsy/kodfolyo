'use client';

import { Certificate, ThemeType } from '@/types';
import { getTheme } from '@/lib/theme';
import { Award, ExternalLink } from 'lucide-react';

interface CertificatesListProps {
  certificates: Certificate[];
  themeType?: ThemeType;
}

export default function CertificatesList({ certificates, themeType }: CertificatesListProps) {
  const theme = getTheme(themeType);

  if (!certificates || certificates.length === 0) return null;

  return (
    <section style={{ padding: '0 clamp(16px, 5vw, 40px) 60px' }}>
      <div style={{ maxWidth: 1020, margin: '0 auto' }}>
        <h2 style={{ margin: '0 0 20px', fontSize: 28, fontWeight: 800, letterSpacing: '-.03em', color: theme.ink }}>
          Sertifikalar
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 12 }}>
          {certificates.map((cert) => {
            const Wrapper = cert.url ? 'a' : 'div';
            return (
              <Wrapper
                key={cert.id}
                {...(cert.url ? { href: cert.url, target: '_blank', rel: 'noopener noreferrer' } : {})}
                style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: 16, borderRadius: 13, border: `1px solid ${theme.border}`, background: theme.card, textDecoration: 'none' }}
              >
                <span style={{ display: 'grid', placeItems: 'center', width: 34, height: 34, borderRadius: 10, background: theme.surfaceAlt, color: theme.a, flexShrink: 0 }}>
                  <Award className="w-4 h-4" />
                </span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ fontSize: 14, fontWeight: 700, color: theme.ink }}>{cert.name}</span>
                    {cert.url && <ExternalLink className="w-3 h-3" style={{ color: theme.mutedLight, flexShrink: 0 }} />}
                  </div>
                  <div style={{ fontSize: 12.5, color: theme.muted, marginTop: 2 }}>{cert.issuer}</div>
                  {cert.date && <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: theme.mutedLight, marginTop: 4 }}>{cert.date}</div>}
                </div>
              </Wrapper>
            );
          })}
        </div>
      </div>
    </section>
  );
}
