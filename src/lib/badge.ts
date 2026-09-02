import { Repository, ThemeType } from '@/types';
import { getTheme } from '@/lib/theme';
import { languageColor } from '@/lib/languageColors';

export type BadgeSize = 'sm' | 'md' | 'lg';

const SIZE_MAP: Record<BadgeSize, { w: number; h: number; avatar: number; nameSize: number; metaSize: number; pad: number }> = {
  sm: { w: 300, h: 78, avatar: 44, nameSize: 14, metaSize: 11, pad: 14 },
  md: { w: 380, h: 96, avatar: 56, nameSize: 16.5, metaSize: 12, pad: 18 },
  lg: { w: 460, h: 116, avatar: 68, nameSize: 19, metaSize: 13, pad: 22 },
};

interface BadgeInput {
  username: string;
  name: string | null;
  avatarUrl: string;
  starCount: number;
  repos: Repository[];
  theme?: ThemeType;
  size?: BadgeSize;
}

function esc(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// Gerçek repo verisinden dil dağılımı çıkarır — TechStack ile aynı ağırlıklandırma mantığı.
function computeLangBar(repos: Repository[]): { lang: string; pct: number }[] {
  const counts: Record<string, number> = {};
  let total = 0;
  repos.forEach((repo) => {
    if (repo.is_visible === false) return;
    if (repo.language) {
      counts[repo.language] = (counts[repo.language] || 0) + 3;
      total += 3;
    }
    if (repo.languages) {
      Object.entries(repo.languages).forEach(([lang, bytes]) => {
        counts[lang] = (counts[lang] || 0) + Math.min(bytes, 5000);
        total += Math.min(bytes, 5000);
      });
    }
  });
  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4)
    .map(([lang, count]) => ({ lang, pct: Math.max(4, Math.round((count / (total || 1)) * 100)) }));
}

export function generateBadgeSVG({ username, name, avatarUrl, starCount, repos, theme: themeType, size = 'md' }: BadgeInput): string {
  const theme = getTheme(themeType);
  const dims = SIZE_MAP[size];
  const displayName = name || username;
  const langs = computeLangBar(repos);
  const barX = dims.pad + dims.avatar + 14;
  const barW = dims.w - barX - dims.pad;
  const barY = dims.h - dims.pad - 8;

  let barX_ = barX;
  const barSegments = langs
    .map(({ lang, pct }) => {
      const segW = (pct / 100) * barW;
      const seg = `<rect x="${barX_.toFixed(1)}" y="${barY}" width="${Math.max(segW, 2).toFixed(1)}" height="6" rx="3" fill="${languageColor(lang)}" />`;
      barX_ += segW + 1.5;
      return seg;
    })
    .join('');

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${dims.w}" height="${dims.h}" viewBox="0 0 ${dims.w} ${dims.h}">
  <defs>
    <clipPath id="avatarClip"><circle cx="${dims.pad + dims.avatar / 2}" cy="${dims.h / 2}" r="${dims.avatar / 2}" /></clipPath>
    <linearGradient id="grad" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${theme.a}" />
      <stop offset="1" stop-color="${theme.b}" />
    </linearGradient>
  </defs>
  <rect x="0.5" y="0.5" width="${dims.w - 1}" height="${dims.h - 1}" rx="14" fill="${theme.card}" stroke="rgba(25,23,32,.12)" />
  <rect x="0.5" y="0.5" width="6" height="${dims.h - 1}" rx="3" fill="url(#grad)" />
  <circle cx="${dims.pad + dims.avatar / 2}" cy="${dims.h / 2}" r="${dims.avatar / 2 + 1.5}" fill="none" stroke="${theme.a}" stroke-width="1.5" />
  <image href="${esc(avatarUrl)}" x="${dims.pad}" y="${(dims.h - dims.avatar) / 2}" width="${dims.avatar}" height="${dims.avatar}" clip-path="url(#avatarClip)" />
  <text x="${barX}" y="${dims.pad + dims.nameSize}" font-family="Arial, sans-serif" font-weight="800" font-size="${dims.nameSize}" fill="${theme.ink}">${esc(displayName)}</text>
  <text x="${barX}" y="${dims.pad + dims.nameSize + dims.metaSize + 6}" font-family="monospace" font-size="${dims.metaSize}" fill="${theme.muted}">@${esc(username)} · ★ ${starCount} · kodfolyo.dev</text>
  ${barSegments}
</svg>`;
}
