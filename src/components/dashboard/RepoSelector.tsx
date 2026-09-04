'use client';

import { useState } from 'react';
import { Repository } from '@/types';
import { languageColor } from '@/lib/languageColors';
import { Star } from 'lucide-react';

interface RepoSelectorProps {
  repos: Repository[];
  onToggleVisibility: (repoId: number, isVisible: boolean) => Promise<void>;
  onSetFeatured: (repoId: number) => Promise<void>;
}

export default function RepoSelector({ repos, onToggleVisibility, onSetFeatured }: RepoSelectorProps) {
  const [localRepos, setLocalRepos] = useState<Repository[]>(repos);
  const [prevRepos, setPrevRepos] = useState<Repository[]>(repos);

  if (repos !== prevRepos) {
    setPrevRepos(repos);
    setLocalRepos(repos);
  }

  const handleToggle = async (repoId: number, currentVisible: boolean) => {
    const nextState = !currentVisible;
    setLocalRepos((prev) => prev.map((r) => (r.github_repo_id === repoId ? { ...r, is_visible: nextState } : r)));
    try {
      await onToggleVisibility(repoId, nextState);
    } catch (err) {
      console.error(err);
      setLocalRepos((prev) => prev.map((r) => (r.github_repo_id === repoId ? { ...r, is_visible: currentVisible } : r)));
    }
  };

  const handleSetFeatured = async (repoId: number) => {
    setLocalRepos((prev) => prev.map((r) => ({ ...r, is_featured: r.github_repo_id === repoId })));
    try {
      await onSetFeatured(repoId);
    } catch (err) {
      console.error(err);
    }
  };

  const visibleCount = localRepos.filter((r) => r.is_visible !== false).length;
  const hiddenCount = localRepos.length - visibleCount;

  return (
    <div style={{ background: '#FFFFFF', border: '1px solid rgba(228,228,231,.8)', borderRadius: 16, boxShadow: '0 1px 2px 0 rgba(0,0,0,0.04)', overflow: 'hidden' }}>
      <div style={{ padding: '11px 16px', borderBottom: '1px solid rgba(228,228,231,.09)', fontFamily: 'var(--font-mono)', fontSize: 11, color: '#A1A1AA' }}>
        {visibleCount} repo yayında · {hiddenCount} gizli · yıldıza tıklayıp vitrin projesi seç
      </div>

      {localRepos.map((repo) => {
        const isVisible = repo.is_visible !== false;
        const isFeatured = repo.is_featured === true;
        return (
          <div
            key={repo.github_repo_id || repo.name}
            style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 16px', borderBottom: '1px solid rgba(228,228,231,.06)' }}
          >
            <button
              type="button"
              onClick={() => handleSetFeatured(repo.github_repo_id)}
              title={isFeatured ? 'Vitrin projesi' : 'Vitrin projesi yap'}
              className={isFeatured ? 'fill-amber-400 text-amber-400' : 'text-[#C3BEC9]'}
              style={{ display: 'grid', placeItems: 'center', width: 26, height: 26, border: 0, borderRadius: 7, background: 'transparent', cursor: 'pointer', flexShrink: 0 }}
            >
              <Star className="w-4 h-4" />
            </button>

            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 500, color: isVisible ? '#18181B' : '#A1A1AA' }}>{repo.name}</div>
              <div style={{ fontSize: 11.5, color: '#A1A1AA', marginTop: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{repo.description || 'Açıklama yok'}</div>
            </div>

            <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontFamily: 'var(--font-mono)', fontSize: 11.5, color: '#71717A', flexShrink: 0 }}>
              <Star className="w-3 h-3" style={{ opacity: 0.5 }} />
              {repo.stargazers_count}
            </span>

            {repo.language && (
              <span style={{ display: 'flex', alignItems: 'center', gap: 5, width: 98, flexShrink: 0, fontFamily: 'var(--font-mono)', fontSize: 11, color: '#52525B' }}>
                <span style={{ width: 7, height: 7, borderRadius: '50%', flexShrink: 0, background: languageColor(repo.language) }} />
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{repo.language}</span>
              </span>
            )}

            <button
              type="button"
              onClick={() => handleToggle(repo.github_repo_id, isVisible)}
              style={{ position: 'relative', width: 36, height: 21, borderRadius: 999, border: 0, cursor: 'pointer', padding: 0, flexShrink: 0, background: isVisible ? '#00A676' : 'rgba(228,228,231,.16)' }}
            >
              <span style={{ position: 'absolute', top: 3, left: isVisible ? 18 : 3, width: 15, height: 15, borderRadius: '50%', background: '#FFFFFF', boxShadow: '0 1px 2px rgba(228,228,231,.25)', transition: 'left .15s ease' }} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
