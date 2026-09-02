'use client';

import { Repository, ThemeType } from '@/types';
import { getTheme } from '@/lib/theme';
import ProjectCard from './ProjectCard';
import { FolderGit2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { fadeUp } from '@/lib/motion';

interface ProjectGridProps {
  repos: Repository[];
  themeType?: ThemeType;
  customAccent?: string | null;
}

export default function ProjectGrid({ repos, themeType, customAccent }: ProjectGridProps) {
  const theme = getTheme(themeType, customAccent);
  const visibleRepos = repos.filter((r) => r.is_visible !== false);

  if (visibleRepos.length === 0) {
    return (
      <div className="mx-auto max-w-4xl px-4 sm:px-6 my-8 text-center">
        <div className={`p-8 rounded-2xl ${theme.card}`}>
          <FolderGit2 className={`w-8 h-8 mx-auto mb-2 ${theme.textMuted}`} />
          <h3 className={`text-sm font-bold ${theme.textPrimary}`}>Görünür Repo Bulunmuyor</h3>
          <p className={`text-xs ${theme.textMuted} mt-1`}>
            Henüz görünür durumda repo seçilmemiş veya veriler senkronize edilmedi.
          </p>
        </div>
      </div>
    );
  }

  return (
    <section className="mx-auto max-w-4xl px-4 sm:px-6 my-8 space-y-4">
      {/* Başlık */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.6 }}
        className={`flex items-center justify-between border-b ${theme.border} pb-2 text-xs font-bold uppercase tracking-wider`}
      >
        <div className="flex items-center gap-2">
          <FolderGit2 className="w-4 h-4 text-slate-400" />
          <span className={theme.textPrimary}>Öne Çıkan Projeler</span>
        </div>
        <span className={`text-[11px] ${theme.textMuted}`}>{visibleRepos.length} Repozituvar</span>
      </motion.div>

      {/* Grid Düzeni */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {visibleRepos.map((repo) => (
          <ProjectCard key={repo.github_repo_id || repo.name} repo={repo} themeType={themeType} customAccent={customAccent} />
        ))}
      </div>
    </section>
  );
}
