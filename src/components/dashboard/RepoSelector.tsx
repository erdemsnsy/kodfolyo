'use client';

import { useState } from 'react';
import { Repository } from '@/types';
import { FolderGit2, Eye, EyeOff, Star, GitFork } from 'lucide-react';

interface RepoSelectorProps {
  repos: Repository[];
  onToggleVisibility: (repoId: number, isVisible: boolean) => Promise<void>;
}

export default function RepoSelector({ repos, onToggleVisibility }: RepoSelectorProps) {
  const [localRepos, setLocalRepos] = useState<Repository[]>(repos);
  const [prevRepos, setPrevRepos] = useState<Repository[]>(repos);
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  if (repos !== prevRepos) {
    setPrevRepos(repos);
    setLocalRepos(repos);
  }

  const handleToggle = async (repoId: number, currentVisible: boolean) => {
    const nextState = !currentVisible;
    setUpdatingId(repoId);

    setLocalRepos((prev) =>
      prev.map((r) => (r.github_repo_id === repoId ? { ...r, is_visible: nextState } : r))
    );

    try {
      await onToggleVisibility(repoId, nextState);
    } catch (err) {
      console.error(err);
      setLocalRepos((prev) =>
        prev.map((r) => (r.github_repo_id === repoId ? { ...r, is_visible: currentVisible } : r))
      );
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="rounded-3xl border border-[#384139] bg-[#17201b] p-6 sm:p-8 shadow-[5px_5px_0_0_#0d1310] space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-2.5 rounded-xl bg-[#1fd88f]/10 text-[#1fd88f] border border-[#1fd88f]/25">
          <FolderGit2 className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-base font-bold text-[#f2f7f0]">Görünür Repolar Yönetimi</h2>
          <p className="text-xs text-[#c9d1cb]">
            En çok yıldız alan 6 proje arasından hangilerinin portfolyoda listeleneceğini seçin
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
        {localRepos.map((repo) => {
          const isVisible = repo.is_visible !== false;
          const isLoading = updatingId === repo.github_repo_id;

          return (
            <div
              key={repo.github_repo_id || repo.name}
              className={`flex items-center justify-between p-4 rounded-xl border transition-all ${
                isVisible
                  ? 'border-[#384139] bg-[#0d1310]'
                  : 'border-[#1e2a23] bg-[#0d1310]/40 opacity-50'
              }`}
            >
              <div className="space-y-1 min-w-0 pr-3">
                <div className="flex items-center gap-2">
                  <h4 className="text-xs font-bold text-[#f2f7f0] truncate">{repo.name}</h4>
                  {repo.language && (
                    <span className="text-[10px] px-2 py-0.5 rounded bg-[#1e2a23] text-[#c9d1cb] border border-[#384139]">
                      {repo.language}
                    </span>
                  )}
                </div>
                <p className="text-xs text-[#c9d1cb] line-clamp-1">{repo.description || 'Açıklama yok'}</p>
                <div className="flex items-center gap-3 text-[11px] text-[#93a297]">
                  <span className="flex items-center gap-1">
                    <Star className="w-3 h-3 text-[#f0b429] fill-[#f0b429]/20" />
                    {repo.stargazers_count}
                  </span>
                  <span className="flex items-center gap-1">
                    <GitFork className="w-3 h-3" />
                    {repo.forks_count}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleToggle(repo.github_repo_id, isVisible)}
                disabled={isLoading}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                  isVisible
                    ? 'bg-[#1fd88f]/15 text-[#1fd88f] border border-[#1fd88f]/30'
                    : 'bg-[#1e2a23] text-[#93a297] border border-[#384139]'
                }`}
              >
                {isVisible ? (
                  <>
                    <Eye className="w-3.5 h-3.5" />
                    <span>Görünür</span>
                  </>
                ) : (
                  <>
                    <EyeOff className="w-3.5 h-3.5" />
                    <span>Gizli</span>
                  </>
                )}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
