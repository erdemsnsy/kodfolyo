'use client';

import { ThemeType } from '@/types';
import { themes } from '@/lib/theme';

interface ThemeSelectorProps {
  currentTheme: ThemeType;
  onSelectTheme: (theme: ThemeType) => Promise<void>;
}

const WASH: Record<ThemeType, string> = {
  gece: 'rgba(31,58,232,.05)',
  kagit: 'rgba(180,83,31,.06)',
  neon: 'rgba(0,132,94,.06)',
  mercan: 'rgba(198,49,78,.05)',
};

export default function ThemeSelector({ currentTheme, onSelectTheme }: ThemeSelectorProps) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
      {Object.values(themes).map((t) => {
        const selected = currentTheme === t.id;
        return (
          <button
            key={t.id}
            type="button"
            onClick={() => onSelectTheme(t.id)}
            style={{
              display: 'block', width: '100%', textAlign: 'left', padding: 0, borderRadius: 12, overflow: 'hidden',
              cursor: 'pointer', background: '#FFFFFF',
              border: selected ? '1px solid #191720' : '1px solid rgba(25,23,32,.09)',
              boxShadow: selected ? '0 0 0 3px rgba(25,23,32,.06)' : 'none',
            }}
          >
            <span style={{ display: 'block', padding: '14px 14px 16px', background: WASH[t.id] }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                <span style={{ width: 26, height: 26, borderRadius: '50%', background: '#EBE7DD', flexShrink: 0 }} />
                <span style={{ display: 'block' }}>
                  <span style={{ display: 'block', width: 74, height: 7, borderRadius: 999, background: 'rgba(25,23,32,.55)' }} />
                  <span style={{ display: 'block', width: 48, height: 5, borderRadius: 999, marginTop: 5, background: 'rgba(25,23,32,.2)' }} />
                </span>
              </span>
              <span style={{ display: 'block', width: '100%', height: 5, borderRadius: 999, marginTop: 12, background: 'rgba(25,23,32,.13)' }} />
              <span style={{ display: 'block', width: '70%', height: 5, borderRadius: 999, marginTop: 5, background: 'rgba(25,23,32,.13)' }} />
              <span style={{ display: 'flex', gap: 5, marginTop: 12 }}>
                <span style={{ width: 44, height: 14, borderRadius: 5, background: t.a }} />
                <span style={{ width: 30, height: 14, borderRadius: 5, background: t.b }} />
                <span style={{ flex: 1, height: 14, borderRadius: 5, background: 'rgba(25,23,32,.07)' }} />
              </span>
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '11px 14px', borderTop: '1px solid rgba(25,23,32,.09)' }}>
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
  );
}
