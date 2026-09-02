'use client';

import { ThemeType } from '@/types';
import { themes } from '@/lib/theme';

interface ThemeSelectorProps {
  currentTheme: ThemeType;
  onSelectTheme: (theme: ThemeType) => Promise<void>;
}

export default function ThemeSelector({ currentTheme, onSelectTheme }: ThemeSelectorProps) {
  const t = themes[currentTheme] || themes.gece;

  return (
    <div style={{ padding: 24, borderRadius: 16, background: '#FFFFFF', border: '1px solid rgba(25,23,32,.09)' }}>
      <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 14 }}>Tema</div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        {Object.values(themes).map((theme) => {
          const selected = currentTheme === theme.id;
          return (
            <button
              key={theme.id}
              type="button"
              onClick={() => onSelectTheme(theme.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: 10, padding: 12, borderRadius: 12, cursor: 'pointer',
                textAlign: 'left', background: '#FBF9F4',
                border: selected ? '1px solid #1F3AE8' : '1px solid rgba(25,23,32,.1)',
              }}
            >
              <span style={{ width: 26, height: 26, borderRadius: 8, flexShrink: 0, background: `linear-gradient(135deg, ${theme.a}, ${theme.b})` }} />
              <span style={{ fontSize: 13, fontWeight: 600, color: '#191720' }}>{theme.name}</span>
            </button>
          );
        })}
      </div>

      <div style={{ marginTop: 14, padding: 14, borderRadius: 12, border: '1px solid rgba(25,23,32,.09)', background: '#FBF9F4' }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10.5, color: '#8C8797', marginBottom: 10 }}>CANLI ÖNİZLEME</div>
        <div style={{ padding: 13, borderRadius: 11, background: t.bg, border: '1px solid rgba(25,23,32,.1)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
            <span style={{ width: 30, height: 30, borderRadius: 9, background: `linear-gradient(135deg, ${t.a}, ${t.b})` }} />
            <div>
              <div style={{ fontSize: 12.5, fontWeight: 700, color: '#191720' }}>Portfolyon</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: t.a }}>@kullaniciadi</div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 5, marginTop: 11 }}>
            <span style={{ flex: 1, height: 6, borderRadius: 999, background: t.a }} />
            <span style={{ flex: 1, height: 6, borderRadius: 999, background: t.b }} />
            <span style={{ flex: 1, height: 6, borderRadius: 999, background: 'rgba(25,23,32,.14)' }} />
          </div>
        </div>
      </div>
    </div>
  );
}
