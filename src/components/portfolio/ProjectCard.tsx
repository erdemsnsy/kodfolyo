'use client';

import { Repository, ThemeType } from '@/types';
import { getTheme } from '@/lib/theme';
import { Star, GitFork, ExternalLink, FolderGit2 } from 'lucide-react';

interface ProjectCardProps {
  repo: Repository;
  themeType?: ThemeType;
  customAccent?: string | null;
}

export default function ProjectCard({ repo, themeType, customAccent }: ProjectCardProps) {
  const theme = getTheme(themeType, customAccent);

  return (
    <div
      className={`group relative flex flex-col justify-between p-5 rounded-2xl ${theme.card} ${theme.cardHover} transition-all duration-300`}
      style={theme.cardStyle}
    >
      <div className="space-y-3">
        {/* Repo Başlık */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className={`p-2 rounded-xl ${theme.iconBg} border ${theme.iconBorder} shrink-0`}>
              <FolderGit2 className="w-4 h-4 opacity-80" />
            </div>
            <h3 className={`text-base font-bold tracking-tight truncate ${theme.textPrimary}`}>
              {repo.name}
            </h3>
          </div>

          <a
            href={repo.html_url}
            target="_blank"
            rel="noopener noreferrer"
            className={`p-1.5 rounded-lg ${theme.badge} transition shrink-0`}
            style={theme.badgeStyle}
            title="GitHub'da Gör"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Açıklama */}
        <p className={`text-xs sm:text-sm line-clamp-2 leading-relaxed ${theme.textSecondary}`}>
          {repo.description || 'Açıklama belirtilmemiş.'}
        </p>

        {/* Etiketler */}
        {repo.topics && repo.topics.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {repo.topics.slice(0, 3).map((topic) => (
              <span
                key={topic}
                className={`text-[10px] px-2 py-0.5 rounded-md font-medium ${theme.badge}`}
                style={theme.badgeStyle}
              >
                #{topic}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Alt Bilgi */}
      <div className={`flex items-center justify-between pt-3.5 mt-3 border-t ${theme.border} text-xs ${theme.textMuted}`}>
        <span className={`flex items-center gap-1.5 font-semibold text-[11px] ${theme.subtextColor}`}>
          <span className={`w-2 h-2 rounded-full ${theme.isLight ? 'bg-slate-700' : 'bg-slate-300'}`} />
          {repo.language || 'Code'}
        </span>

        <div className="flex items-center gap-3">
          <span className={`flex items-center gap-1 transition ${theme.textPrimary}`}>
            <Star className={`w-3.5 h-3.5 ${theme.starColor}`} />
            {repo.stargazers_count}
          </span>
          <span className="flex items-center gap-1">
            <GitFork className="w-3.5 h-3.5 opacity-80" />
            {repo.forks_count}
          </span>
        </div>
      </div>
    </div>
  );
}
