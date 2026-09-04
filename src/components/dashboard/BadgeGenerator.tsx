'use client';

import { useState } from 'react';
import { ThemeType } from '@/types';
import { themes } from '@/lib/theme';
import { Copy, Check } from 'lucide-react';

interface BadgeGeneratorProps {
  username: string;
  size: 'sm' | 'md' | 'lg';
  theme: ThemeType;
  onSizeChange: (size: 'sm' | 'md' | 'lg') => void;
  onThemeChange: (theme: ThemeType) => void;
}

const SIZES: { id: 'sm' | 'md' | 'lg'; label: string }[] = [
  { id: 'sm', label: 'Küçük' },
  { id: 'md', label: 'Orta' },
  { id: 'lg', label: 'Büyük' },
];

function CodeBlock({ label, code }: { label: string; code: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <div style={{ background: '#FFFFFF', border: '1px solid rgba(228,228,231,.8)', borderRadius: 16, boxShadow: '0 1px 2px 0 rgba(0,0,0,0.04)', overflow: 'hidden' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '9px 13px', borderBottom: '1px solid rgba(228,228,231,.09)' }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '.07em', textTransform: 'uppercase', color: '#A1A1AA' }}>{label}</span>
        <button
          type="button"
          onClick={() => { navigator.clipboard.writeText(code); setCopied(true); setTimeout(() => setCopied(false), 1400); }}
          style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '4px 9px', border: '1px solid rgba(228,228,231,.09)', borderRadius: 6, background: '#FAFAFA', color: '#52525B', fontSize: 11, cursor: 'pointer' }}
        >
          {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
          {copied ? 'kopyalandı' : 'kopyala'}
        </button>
      </div>
      <pre style={{ margin: 0, padding: '12px 13px', background: '#FAFAFA', fontFamily: 'var(--font-mono)', fontSize: 11, lineHeight: 1.65, color: '#52525B', whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
        {code}
      </pre>
    </div>
  );
}

export default function BadgeGenerator({ username, size, theme, onSizeChange, onThemeChange }: BadgeGeneratorProps) {
  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://kodfolyo.dev';
  const badgeUrl = `${origin}/api/badge/${username}?size=${size}&theme=${theme}`;
  const portfolioUrl = `${origin}/${username}`;

  const htmlCode = `<a href="${portfolioUrl}"><img src="${badgeUrl}" alt="${username} Kodfolyo" /></a>`;
  const markdownCode = `[![${username} Kodfolyo](${badgeUrl})](${portfolioUrl})`;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ background: '#FFFFFF', border: '1px solid rgba(228,228,231,.8)', borderRadius: 16, boxShadow: '0 1px 2px 0 rgba(0,0,0,0.04)', padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 22, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9.5, letterSpacing: '.07em', textTransform: 'uppercase', color: '#A1A1AA' }}>Boyut</span>
          <div style={{ display: 'flex', padding: 2, borderRadius: 8, background: '#F4F4F5', gap: 2 }}>
            {SIZES.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => onSizeChange(s.id)}
                style={{ padding: '5px 12px', border: 0, borderRadius: 6, fontSize: 12, fontWeight: 500, cursor: 'pointer', background: size === s.id ? '#FFFFFF' : 'transparent', color: size === s.id ? '#18181B' : '#71717A' }}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9.5, letterSpacing: '.07em', textTransform: 'uppercase', color: '#A1A1AA' }}>Tema</span>
          <div style={{ display: 'flex', gap: 7 }}>
            {Object.values(themes).map((t) => (
              <button
                key={t.id}
                type="button"
                title={t.name}
                onClick={() => onThemeChange(t.id)}
                style={{ width: 22, height: 22, borderRadius: '50%', cursor: 'pointer', padding: 0, background: t.a, border: theme === t.id ? '3px solid rgba(228,228,231,.5)' : '1px solid rgba(228,228,231,.14)' }}
              />
            ))}
          </div>
        </div>
      </div>

      <div style={{ background: '#FFFFFF', border: '1px solid rgba(228,228,231,.8)', borderRadius: 16, boxShadow: '0 1px 2px 0 rgba(0,0,0,0.04)', overflow: 'hidden' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '9px 13px', borderBottom: '1px solid rgba(228,228,231,.09)' }}>
          <span style={{ display: 'flex', gap: 5 }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#E4E4E7' }} />
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#E4E4E7' }} />
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#E4E4E7' }} />
          </span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10.5, color: '#A1A1AA' }}>README.md · önizleme</span>
        </div>
        <div style={{ padding: '18px 20px' }}>
          <div style={{ fontSize: 19, fontWeight: 800, letterSpacing: '-.02em', marginBottom: 8 }}>Merhaba, ben {username} 👋</div>
          <div style={{ fontSize: 13, color: '#52525B', lineHeight: 1.6, marginBottom: 12 }}>Yazılım geliştiriyorum, açık kaynağı seviyorum. Güncel projelerim ve profilim aşağıdaki rozette.</div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img key={badgeUrl} src={badgeUrl} alt={`${username} Kodfolyo rozeti`} style={{ display: 'block', maxWidth: '100%' }} />
        </div>
      </div>

      <CodeBlock label="Markdown" code={markdownCode} />
      <CodeBlock label="HTML" code={htmlCode} />
    </div>
  );
}
