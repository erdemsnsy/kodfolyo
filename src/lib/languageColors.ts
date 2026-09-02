export const LANGUAGE_COLORS: Record<string, string> = {
  TypeScript: '#3178c6',
  JavaScript: '#f1e05a',
  Python: '#3572A5',
  Java: '#b07219',
  'C++': '#f34b7d',
  C: '#555555',
  'C#': '#178600',
  Go: '#00ADD8',
  Rust: '#dea584',
  PHP: '#4F5D95',
  HTML: '#e34c26',
  CSS: '#563d7c',
  Vue: '#41b883',
  React: '#61dafb',
  Swift: '#F05138',
  Kotlin: '#A97BFF',
  Dart: '#00B4AB',
  Shell: '#89e051',
};

export function languageColor(lang?: string | null): string {
  if (!lang) return '#6B6675';
  return LANGUAGE_COLORS[lang] || '#6B6675';
}

export function relativeTimeTr(iso?: string): string {
  if (!iso) return '';
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return '';
  const diffMs = Date.now() - then;
  const minute = 60000, hour = 3600000, day = 86400000, week = day * 7, month = day * 30;
  if (diffMs < hour) return Math.max(1, Math.round(diffMs / minute)) + ' dakika önce';
  if (diffMs < day) return Math.round(diffMs / hour) + ' saat önce';
  if (diffMs < week) return Math.round(diffMs / day) + ' gün önce';
  if (diffMs < month) return Math.round(diffMs / week) + ' hafta önce';
  return Math.round(diffMs / month) + ' ay önce';
}
