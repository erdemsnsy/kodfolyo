import { ThemeType } from '@/types';

export interface ThemeDef {
  id: ThemeType;
  name: string;
  bg: string;
  a: string;
  b: string;
}

// Kodfolyo Design System — Claude Design'da hazırlanan sistemden birebir alındı.
// Sadece zemin (bg) ve iki vurgu rengi (a, b) temaya göre değişir; geri kalan
// nötr tonlar (ink/muted/kart/border) sabittir — tek bir açık/kağıt sistemi.
export const themes: Record<ThemeType, ThemeDef> = {
  gece: { id: 'gece', name: 'Kobalt', bg: '#F4F1EA', a: '#1F3AE8', b: '#00A676' },
  kagit: { id: 'kagit', name: 'Kil', bg: '#F8F2E6', a: '#B4531F', b: '#2E6F5E' },
  neon: { id: 'neon', name: 'Nane', bg: '#EDF5F1', a: '#00845E', b: '#1F3AE8' },
  mercan: { id: 'mercan', name: 'Gül', bg: '#F9EFEE', a: '#C6314E', b: '#6B4BD6' },
};

export interface ThemeConfig extends ThemeDef {
  ink: string;
  muted: string;
  mutedLight: string;
  body: string;
  dim: string;
  faint: string;
  card: string;
  surface: string;
  surfaceAlt: string;
  border: string;
  borderStrong: string;
  gradient: string;
}

export function getTheme(themeName?: ThemeType): ThemeConfig {
  const t = (themeName && themes[themeName]) ? themes[themeName] : themes.gece;

  return {
    ...t,
    ink: '#191720',
    muted: '#6B6675',
    mutedLight: '#8C8797',
    body: '#56515F',
    dim: '#3A3644',
    faint: '#A09BA8',
    card: '#FFFFFF',
    surface: '#FBF9F4',
    surfaceAlt: '#EBE7DD',
    border: 'rgba(25,23,32,.1)',
    borderStrong: 'rgba(25,23,32,.16)',
    gradient: `linear-gradient(135deg, ${t.a}, ${t.b})`,
  };
}
