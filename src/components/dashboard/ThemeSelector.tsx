'use client';

import { ThemeType } from '@/types';
import { themes } from '@/lib/theme';

interface ThemeSelectorProps {
  currentTheme: ThemeType;
  onSelectTheme: (theme: ThemeType) => Promise<void>;
}

const WASH: Record<ThemeType, string> = {
  gece: 'rgba(24,24,27,.05)',
  kagit: 'rgba(180,83,31,.06)',
  neon: 'rgba(0,132,94,.06)',
  mercan: 'rgba(198,49,78,.05)',
  zeytin: 'rgba(107,122,58,.07)',
  lavanta: 'rgba(124,92,191,.06)',
  bordo: 'rgba(122,46,59,.06)',
  turkuaz: 'rgba(14,131,136,.06)',
  hardal: 'rgba(204,154,6,.07)',
  karbon: 'rgba(24,24,27,.05)',
};

export default function ThemeSelector({ currentTheme, onSelectTheme }: ThemeSelectorProps) {
  const current = themes[currentTheme];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
      {Object.values(themes).map((t) => {
        const selected = currentTheme === t.id;
        return (
          <button
            key={t.id}
            type="button"
            onClick={() => onSelectTheme(t.id)}
            style={{
              display: 'block', width: '100%', textAlign: 'left', padding: 0, borderRadius: 16, overflow: 'hidden',
              cursor: 'pointer', background: '#FFFFFF',
              border: selected ? '1px solid #18181B' : '1px solid rgba(228,228,231,.8)',
              boxShadow: selected ? '0 0 0 3px rgba(24,24,27,.08)' : '0 1px 2px 0 rgba(0,0,0,0.04)',
            }}
          >
            <span style={{ display: 'block', padding: '14px 14px 16px', background: WASH[t.id] }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                <span style={{ width: 26, height: 26, borderRadius: '50%', background: '#F4F4F5', flexShrink: 0 }} />
                <span style={{ display: 'block' }}>
                  <span style={{ display: 'block', width: 74, height: 7, borderRadius: 999, background: 'rgba(228,228,231,.55)' }} />
                  <span style={{ display: 'block', width: 48, height: 5, borderRadius: 999, marginTop: 5, background: 'rgba(228,228,231,.2)' }} />
                </span>
              </span>
              <span style={{ display: 'block', width: '100%', height: 5, borderRadius: 999, marginTop: 12, background: 'rgba(228,228,231,.13)' }} />
              <span style={{ display: 'block', width: '70%', height: 5, borderRadius: 999, marginTop: 5, background: 'rgba(228,228,231,.13)' }} />
              <span style={{ display: 'flex', gap: 5, marginTop: 12 }}>
                <span style={{ width: 44, height: 14, borderRadius: 5, background: t.a }} />
                <span style={{ width: 30, height: 14, borderRadius: 5, background: t.b }} />
                <span style={{ flex: 1, height: 14, borderRadius: 5, background: 'rgba(228,228,231,.07)' }} />
              </span>
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '11px 14px', borderTop: '1px solid rgba(228,228,231,.09)' }}>
              <span style={{ display: 'flex', flexShrink: 0 }}>
                <span style={{ width: 16, height: 16, borderRadius: '50%', background: t.a }} />
                <span style={{ width: 16, height: 16, borderRadius: '50%', marginLeft: -6, background: t.b }} />
              </span>
              <span style={{ flex: 1, fontSize: 13.5, fontWeight: 600 }}>{t.name}</span>
              {selected && <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10.5, color: '#00845E' }}>seçili</span>}
            </span>
          </button>
        );
      })}
    </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', borderRadius: 14, border: '1px dashed rgba(228,228,231,.9)' }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
          <span style={{ width: 12, height: 12, borderRadius: '50%', background: current.a }} />
          <span style={{ width: 12, height: 12, borderRadius: '50%', marginLeft: -6, background: current.b }} />
        </span>
        <span style={{ fontSize: 12, color: '#71717A', lineHeight: 1.5 }}>
          Şu an <b style={{ color: '#18181B', fontWeight: 600 }}>{current.name}</b> seçili. Değişiklik sağdaki canlı önizlemede anında görünür, portfolyonu ziyaret etmene gerek yok.
        </span>
      </div>
    </div>
  );
}
