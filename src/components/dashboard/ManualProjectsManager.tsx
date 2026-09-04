'use client';

import { useState } from 'react';
import type React from 'react';
import { ManualProject } from '@/types';
import { Trash2, Plus, FolderGit2, Link2, ImageIcon, AlignLeft } from 'lucide-react';

interface ManualProjectsManagerProps {
  projects: ManualProject[];
  onSaveProjects: (projects: ManualProject[]) => Promise<void>;
}

const FIELD_CLASS =
  'w-full bg-white border border-zinc-200 focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 rounded-lg text-sm text-zinc-900 placeholder:text-zinc-400 transition-all outline-none pl-8 pr-2.5 py-1.5';

function IconField({ icon: Icon, ...props }: { icon: typeof FolderGit2 } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div style={{ position: 'relative' }}>
      <Icon className="w-3.5 h-3.5" style={{ position: 'absolute', left: 9, top: '50%', transform: 'translateY(-50%)', color: '#A1A1AA', pointerEvents: 'none' }} />
      <input {...props} className={FIELD_CLASS} />
    </div>
  );
}

// GitHub'da olmayan projeler için: freelance iş, okul ödevi, kapalı kaynak
// çalışma gibi — repo listesinden bağımsız, elle eklenen kartlar.
export default function ManualProjectsManager({ projects, onSaveProjects }: ManualProjectsManagerProps) {
  const [list, setList] = useState<ManualProject[]>(projects || []);
  const [prevProjects, setPrevProjects] = useState<ManualProject[]>(projects);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [url, setUrl] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  if (projects !== prevProjects) {
    setPrevProjects(projects);
    setList(projects || []);
  }

  const ready = title.trim().length > 0;

  const handleAdd = () => {
    if (!ready) return;
    const entry: ManualProject = {
      id: Date.now().toString(),
      title: title.trim(),
      description: description.trim(),
      url: url.trim() || undefined,
      imageUrl: imageUrl.trim() || undefined,
    };
    const updated = [entry, ...list];
    setList(updated);
    setTitle('');
    setDescription('');
    setUrl('');
    setImageUrl('');
    onSaveProjects(updated).catch(console.error);
  };

  const handleRemove = (id: string) => {
    const updated = list.filter((p) => p.id !== id);
    setList(updated);
    onSaveProjects(updated).catch(console.error);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {list.length > 0 ? (
        <div style={{ background: '#FFFFFF', border: '1px solid rgba(228,228,231,.8)', borderRadius: 16, boxShadow: '0 1px 2px 0 rgba(0,0,0,0.04)', overflow: 'hidden' }}>
          {list.map((project) => (
            <div key={project.id} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: '13px 16px', borderBottom: '1px solid rgba(228,228,231,.06)' }}>
              <span style={{ display: 'grid', placeItems: 'center', width: 30, height: 30, borderRadius: 9, background: '#FAFAFA', border: '1px solid rgba(228,228,231,.8)', color: '#52525B', flexShrink: 0, overflow: 'hidden' }}>
                {/* next/image kullanılmıyor: URL kullanıcıdan geliyor, next.config.ts'nin
                    izinli host listesine (remotePatterns) girmesi garanti değil. */}
                {project.imageUrl ? <img src={project.imageUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <FolderGit2 className="w-3.5 h-3.5" />}
              </span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, flexWrap: 'wrap' }}>
                  <span style={{ fontSize: 13.5, fontWeight: 600 }}>{project.title}</span>
                  {project.url && (
                    <a href={project.url} target="_blank" rel="noopener noreferrer" style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: '#A1A1AA' }}>
                      {project.url.replace(/^https?:\/\//, '')}
                    </a>
                  )}
                </div>
                {project.description && <div style={{ fontSize: 12, color: '#71717A', marginTop: 5, lineHeight: 1.5 }}>{project.description}</div>}
              </div>
              <button
                onClick={() => handleRemove(project.id)}
                style={{ display: 'grid', placeItems: 'center', width: 27, height: 27, border: '1px solid rgba(228,228,231,.09)', borderRadius: 7, background: '#FFFFFF', color: '#A1A1AA', cursor: 'pointer', flexShrink: 0 }}
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, textAlign: 'center', padding: '30px 20px', borderRadius: 16, border: '1px dashed rgba(228,228,231,.9)', color: '#A1A1AA' }}>
          <FolderGit2 className="w-8 h-8" />
          <span style={{ fontSize: 12.5 }}>Henüz GitHub dışı proje eklemedin.</span>
        </div>
      )}

      <div style={{ background: '#FAFAFA', border: '1px solid rgba(228,228,231,.8)', borderRadius: 16, boxShadow: '0 1px 2px 0 rgba(0,0,0,0.04)', padding: '14px 16px' }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9.5, letterSpacing: '.07em', textTransform: 'uppercase', color: '#A1A1AA', marginBottom: 11 }}>Yeni proje</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 9 }}>
          <IconField icon={FolderGit2} placeholder="Proje adı" value={title} onChange={(e) => setTitle(e.target.value)} />
          <IconField icon={Link2} placeholder="https://... (opsiyonel)" value={url} onChange={(e) => setUrl(e.target.value)} style={{ fontFamily: 'var(--font-mono)' }} />
          <div style={{ gridColumn: '1 / -1' }}>
            <IconField icon={ImageIcon} placeholder="Görsel URL (opsiyonel)" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} style={{ fontFamily: 'var(--font-mono)' }} />
          </div>
          <div style={{ position: 'relative', gridColumn: '1 / -1' }}>
            <AlignLeft className="w-3.5 h-3.5" style={{ position: 'absolute', left: 9, top: 11, color: '#A1A1AA', pointerEvents: 'none' }} />
            <textarea placeholder="Kısa açıklama" value={description} onChange={(e) => setDescription(e.target.value)} rows={2} className={`${FIELD_CLASS} resize-y`} style={{ lineHeight: 1.5 }} />
          </div>
        </div>
        <button
          type="button"
          onClick={handleAdd}
          disabled={!ready}
          className={ready ? 'hover:bg-zinc-800 transition-colors' : ''}
          style={{
            marginTop: 11, display: 'flex', alignItems: 'center', gap: 6, height: 32, padding: '0 14px', border: 0, borderRadius: 8,
            fontSize: 12.5, fontWeight: 500, cursor: ready ? 'pointer' : 'not-allowed',
            background: ready ? '#18181B' : 'rgba(228,228,231,.07)', color: ready ? '#FFFFFF' : '#A1A1AA',
          }}
        >
          <Plus className="w-3.5 h-3.5" /> proje ekle
        </button>
      </div>
    </div>
  );
}
