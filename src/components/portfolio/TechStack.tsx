'use client';

import { Repository, ThemeType } from '@/types';
import { getTheme } from '@/lib/theme';
import { Code2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { fadeUp } from '@/lib/motion';

interface TechStackProps {
  repos: Repository[];
  themeType?: ThemeType;
  customAccent?: string | null;
}

const LANGUAGE_COLORS: Record<string, string> = {
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

export default function TechStack({ repos, themeType, customAccent }: TechStackProps) {
  const theme = getTheme(themeType, customAccent);

  const langCounts: Record<string, number> = {};
  let totalScore = 0;

  repos.forEach((repo) => {
    if (repo.is_visible !== false) {
      if (repo.language) {
        langCounts[repo.language] = (langCounts[repo.language] || 0) + 3;
        totalScore += 3;
      }
      if (repo.languages) {
        Object.entries(repo.languages).forEach(([lang, bytes]) => {
          langCounts[lang] = (langCounts[lang] || 0) + Math.min(bytes, 5000);
          totalScore += Math.min(bytes, 5000);
        });
      }
    }
  });

  const sortedLangs = Object.entries(langCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 7);

  if (sortedLangs.length === 0) return null;

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 my-6">
      <motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.4 }}
        className={`p-5 sm:p-6 rounded-2xl ${theme.card} space-y-4`}
        style={theme.cardStyle}
      >
        {/* Başlık */}
        <div className={`flex items-center justify-between border-b ${theme.border} pb-3`}>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider">
            <Code2 className="w-4 h-4 text-slate-400" />
            <span className={theme.textPrimary}>Teknoloji Yetkinlikleri</span>
          </div>
          <span className={`text-[11px] ${theme.textMuted}`}>GitHub API Spektrumu</span>
        </div>

        {/* Dil Çubuğu */}
        <div className={`h-2.5 w-full overflow-hidden rounded-md ${theme.progressBarBg} flex gap-0.5`}>
          {sortedLangs.map(([lang, count], idx) => {
            const pct = Math.max(3, Math.round((count / (totalScore || 1)) * 100));
            const color = LANGUAGE_COLORS[lang] || '#818cf8';

            return (
              <motion.div
                key={lang}
                initial={{ width: 0 }}
                whileInView={{ width: `${pct}%` }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.6, delay: idx * 0.06, ease: 'easeOut' }}
                style={{ backgroundColor: color }}
                title={`${lang}: %${pct}`}
                className="h-full hover:opacity-80"
              />
            );
          })}
        </div>

        {/* Dil Dağılım İsimleri */}
        <div className="flex flex-wrap gap-x-5 gap-y-2 pt-1 text-xs">
          {sortedLangs.map(([lang, count]) => {
            const pct = Math.round((count / (totalScore || 1)) * 100);
            const color = LANGUAGE_COLORS[lang] || '#818cf8';

            return (
              <div key={lang} className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
                <span className={`font-semibold ${theme.textPrimary}`}>{lang}</span>
                <span className={theme.textMuted}>%{pct}</span>
              </div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}
