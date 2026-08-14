'use client';

import { useState } from 'react';
import { CustomLink } from '@/types';
import { Link2, Plus, Trash2, ExternalLink, Save } from 'lucide-react';

interface CustomLinksManagerProps {
  customLinks: CustomLink[];
  onSaveLinks: (links: CustomLink[]) => Promise<void>;
}

export default function CustomLinksManager({ customLinks, onSaveLinks }: CustomLinksManagerProps) {
  const [links, setLinks] = useState<CustomLink[]>(customLinks || []);
  const [prevCustomLinks, setPrevCustomLinks] = useState<CustomLink[]>(customLinks);
  const [newLabel, setNewLabel] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const [iconName, setIconName] = useState<string>('external-link');
  const [isSaving, setIsSaving] = useState(false);

  if (customLinks !== prevCustomLinks) {
    setPrevCustomLinks(customLinks);
    setLinks(customLinks || []);
  }

  const handleAddLink = () => {
    if (!newLabel.trim() || !newUrl.trim()) return;

    let formattedUrl = newUrl.trim();
    if (!formattedUrl.startsWith('http://') && !formattedUrl.startsWith('https://')) {
      formattedUrl = `https://${formattedUrl}`;
    }

    const newEntry: CustomLink = {
      id: Date.now().toString(),
      label: newLabel.trim(),
      url: formattedUrl,
      iconName: iconName,
    };

    const updated = [...links, newEntry];
    setLinks(updated);
    setNewLabel('');
    setNewUrl('');
    setIconName('external-link');
    onSaveLinks(updated).catch(console.error);
  };

  const handleRemoveLink = (id: string) => {
    const updated = links.filter((l) => l.id !== id);
    setLinks(updated);
    onSaveLinks(updated).catch(console.error);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSaveLinks(links);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="rounded-2xl border border-[#23272e] bg-[#141619] p-6 sm:p-8 shadow-xl space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-white/5 text-white border border-white/10">
            <Link2 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white">Özel Bağlantılar & CV Linki</h2>
            <p className="text-xs text-[#94a3b8]">
              LinkedIn profilinizi, CV PDF veya kişisel blog bağlantınızı ekleyin
            </p>
          </div>
        </div>

        <button
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-1.5 rounded-xl bg-white hover:bg-slate-200 px-4 py-2 text-xs font-bold text-slate-950 shadow transition disabled:opacity-50"
        >
          <Save className="w-3.5 h-3.5" />
          <span>{isSaving ? 'Kaydediliyor...' : 'Kaydet'}</span>
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 p-4 rounded-xl border border-[#23272e] bg-[#0c0d0e] text-xs">
        <input
          type="text"
          placeholder="Etiket (LinkedIn, CV PDF)"
          value={newLabel}
          onChange={(e) => setNewLabel(e.target.value)}
          className="flex-1 rounded-lg border border-[#23272e] bg-[#141619] px-3.5 py-2 text-white placeholder-[#64748b] focus:border-white focus:outline-none"
        />
        <input
          type="text"
          placeholder="URL (https://...)"
          value={newUrl}
          onChange={(e) => setNewUrl(e.target.value)}
          className="flex-1 rounded-lg border border-[#23272e] bg-[#141619] px-3.5 py-2 text-white placeholder-[#64748b] focus:border-white focus:outline-none"
        />
        <select
          value={iconName}
          onChange={(e) => setIconName(e.target.value)}
          className="rounded-lg border border-[#23272e] bg-[#141619] px-3 py-2 text-white focus:border-white focus:outline-none"
        >
          <option value="external-link">🔗 Bağlantı</option>
          <option value="linkedin">💼 LinkedIn</option>
          <option value="twitter">🐦 Twitter / X</option>
          <option value="cv">📄 CV / PDF</option>
          <option value="globe">🌐 Web Sitesi</option>
          <option value="email">✉️ E-posta</option>
        </select>
        <button
          type="button"
          onClick={handleAddLink}
          disabled={!newLabel.trim() || !newUrl.trim()}
          className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg bg-white/10 text-white border border-white/20 font-bold shadow transition disabled:opacity-40"
        >
          <Plus className="w-4 h-4" />
          <span>Ekle</span>
        </button>
      </div>

      {links.length === 0 ? (
        <p className="text-xs text-[#64748b] italic text-center py-3">
          Henüz özel bir bağlantı eklenmedi. (Kullanıcı eklemezse butonlar portfolyoda görünmez)
        </p>
      ) : (
        <div className="space-y-2.5 text-xs">
          {links.map((link) => (
            <div
              key={link.id}
              className="flex items-center justify-between p-3 rounded-lg border border-[#23272e] bg-[#0c0d0e] text-white"
            >
              <div className="flex items-center gap-3">
                <span className="font-bold text-white px-2.5 py-0.5 rounded bg-[#1e2229] border border-[#2d323c]">
                  {link.label}
                </span>
                <span className="text-[#94a3b8] truncate max-w-xs sm:max-w-md">{link.url}</span>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1 rounded bg-[#141619] text-[#94a3b8] hover:text-white transition"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
                <button
                  type="button"
                  onClick={() => handleRemoveLink(link.id)}
                  className="p-1 rounded bg-[#141619] text-[#94a3b8] hover:text-red-400 transition"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
