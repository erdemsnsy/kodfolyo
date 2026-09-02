'use client';

import { useState } from 'react';
import { ThemeType } from '@/types';
import { themes } from '@/lib/theme';
import { Copy, Check } from 'lucide-react';

interface BadgeGeneratorProps {
  username: string;
  defaultTheme: ThemeType;
}

const SIZES: { id: 'sm' | 'md' | 'lg'; label: string }[] = [
  { id: 'sm', label: 'Küçük' },
  { id: 'md', label: 'Orta' },
  { id: 'lg', label: 'Büyük' },
];

function CodeBlock({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <div style={{ position: 'relative' }}>
      <pre style={{ margin: 0, padding: '11px 44px 11px 13px', borderRadius: 10, background: '#191720', color: '#EDEBF2', fontFamily: 'var(--font-mono)', fontSize: 11.5, overflowX: 'auto', whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
        {code}
      </pre>
      <button
        type="button"
        onClick={() => { navigator.clipboard.writeText(code); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
        style={{ position: 'absolute', top: 6, right: 6, width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,.1)', border: 0, borderRadius: 7, color: '#EDEBF2', cursor: 'pointer' }}
      >
        {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
      </button>
    </div>
  );
}

export default function BadgeGenerator({ username, defaultTheme }: BadgeGeneratorProps) {
  const [size, setSize] = useState<'sm' | 'md' | 'lg'>('md');
  const [theme, setTheme] = useState<ThemeType>(defaultTheme);

  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://kodfolyo.dev';
  const badgeUrl = `${origin}/api/badge/${username}?size=${size}&theme=${theme}`;
  const portfolioUrl = `${origin}/${username}`;

  const htmlCode = `<a href="${portfolioUrl}"><img src="${badgeUrl}" alt="${username} Kodfolyo" /></a>`;
  const markdownCode = `[![${username} Kodfolyo](${badgeUrl})](${portfolioUrl})`;

  return (
    <div style={{ padding: 24, borderRadius: 16, background: '#FFFFFF', border: '1px solid rgba(25,23,32,.09)' }}>
      <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 3 }}>Gömülebilir Rozet</div>
      <div style={{ fontSize: 13.5, color: '#6B6675', marginBottom: 18 }}>README&apos;ine veya sitene ekleyebileceğin, canlı verinle güncellenen bir rozet.</div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, borderRadius: 13, background: '#FBF9F4', border: '1px solid rgba(25,23,32,.08)', marginBottom: 16 }}>
        {/* key ile img'i zorla yeniden yükle; boyut/tema değişince anında güncellensin */}
        <img key={badgeUrl} src={badgeUrl} alt={`${username} rozet önizleme`} style={{ maxWidth: '100%' }} />
      </div>

      <div style={{ display: 'flex', gap: 18, flexWrap: 'wrap', marginBottom: 18 }}>
        <div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: '#8C8797', marginBottom: 7 }}>BOYUT</div>
          <div style={{ display: 'flex', gap: 6 }}>
            {SIZES.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setSize(s.id)}
                style={{
                  fontFamily: 'var(--font-sans)', fontSize: 12.5, fontWeight: 600, padding: '7px 13px', borderRadius: 999, cursor: 'pointer',
                  border: `1px solid ${size === s.id ? '#1F3AE8' : 'rgba(25,23,32,.14)'}`,
                  background: size === s.id ? 'rgba(31,58,232,.08)' : 'transparent',
                  color: size === s.id ? '#1F3AE8' : '#56515F',
                }}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: '#8C8797', marginBottom: 7 }}>TEMA</div>
          <div style={{ display: 'flex', gap: 6 }}>
            {Object.values(themes).map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setTheme(t.id)}
                title={t.name}
                style={{
                  width: 28, height: 28, borderRadius: '50%', cursor: 'pointer', padding: 0,
                  border: theme === t.id ? '2px solid #191720' : '2px solid transparent',
                  background: `linear-gradient(135deg, ${t.a}, ${t.b})`,
                }}
              />
            ))}
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: '#8C8797', marginBottom: 6 }}>MARKDOWN</div>
          <CodeBlock code={markdownCode} />
        </div>
        <div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: '#8C8797', marginBottom: 6 }}>HTML</div>
          <CodeBlock code={htmlCode} />
        </div>
      </div>
    </div>
  );
}
