'use client';

import { useState } from 'react';
import { Repository } from '@/types';
import { languageColor } from '@/lib/languageColors';

interface RepoSelectorProps {
  repos: Repository[];
  onToggleVisibility: (repoId: number, isVisible: boolean) => Promise<void>;
}

export default function RepoSelector({ repos, onToggleVisibility }: RepoSelectorProps) {
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

  const visibleCount = localRepos.filter((r) => r.is_visible !== false).length;

  return (
    <div style={{ padding: 24, borderRadius: 16, background: '#FFFFFF', border: '1px solid rgba(25,23,32,.09)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <div>
          <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 3 }}>Görünür repolar</div>
          <div style={{ fontSize: 13.5, color: '#6B6675' }}>{visibleCount} repo portfolyonda gösteriliyor.</div>
        </div>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11.5, color: '#8C8797' }}>YILDIZA GÖRE SIRALI</span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {localRepos.map((repo) => {
          const isVisible = repo.is_visible !== false;
          return (
            <div
              key={repo.github_repo_id || repo.name}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, padding: '13px 15px',
                borderRadius: 12, background: '#FBF9F4', border: `1px solid ${isVisible ? 'rgba(31,58,232,.22)' : 'rgba(25,23,32,.07)'}`,
                opacity: isVisible ? 1 : 0.5,
              }}
            >
              <div style={{ minWidth: 0 }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 13.5, color: '#191720' }}>{repo.name}</div>
                <div style={{ fontSize: 12.5, color: '#6B6675', marginTop: 3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{repo.description || 'Açıklama yok'}</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexShrink: 0 }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: '#8C8797' }}>★ {repo.stargazers_count}</span>
                {repo.language && (
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11.5, padding: '3px 9px', borderRadius: 999, background: `${languageColor(repo.language)}22`, color: languageColor(repo.language) }}>
                    {repo.language}
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => handleToggle(repo.github_repo_id, isVisible)}
                  style={{ position: 'relative', width: 42, height: 24, borderRadius: 999, border: 0, cursor: 'pointer', padding: 0, background: isVisible ? '#1F3AE8' : 'rgba(25,23,32,.14)' }}
                >
                  <span style={{ position: 'absolute', top: 3, left: isVisible ? 21 : 3, width: 18, height: 18, borderRadius: '50%', background: '#F4F1EA', transition: 'left .16s ease' }} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
