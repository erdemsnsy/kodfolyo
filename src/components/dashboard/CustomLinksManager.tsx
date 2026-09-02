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
    <div className="rounded-3xl border border-[#3a3530] bg-[#1f1a16] p-6 sm:p-8 shadow-[5px_5px_0_0_#14110f] space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-[#ff5a3c]/10 text-[#ff5a3c] border border-[#ff5a3c]/25">
            <Link2 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-[#fdf6ec]">Özel Bağlantılar & CV Linki</h2>
            <p className="text-xs text-[#d6d0c7]">
              LinkedIn profilinizi, CV PDF veya kişisel blog bağlantınızı ekleyin
            </p>
          </div>
        </div>

        <button
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-1.5 rounded-full bg-[#ff5a3c] hover:bg-[#ff7159] px-4 py-2 text-xs font-bold text-[#14110f] shadow-[3px_3px_0_0_#14110f] transition disabled:opacity-50"
        >
          <Save className="w-3.5 h-3.5" />
          <span>{isSaving ? 'Kaydediliyor...' : 'Kaydet'}</span>
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 p-4 rounded-xl border border-[#3a3530] bg-[#14110f] text-xs">
        <input
          type="text"
          placeholder="Etiket (LinkedIn, CV PDF)"
          value={newLabel}
          onChange={(e) => setNewLabel(e.target.value)}
          className="flex-1 rounded-lg border border-[#3a3530] bg-[#1f1a16] px-3.5 py-2 text-[#fdf6ec] placeholder-[#9a948b] focus:border-[#ff5a3c] focus:outline-none"
        />
        <input
          type="text"
          placeholder="URL (https://...)"
          value={newUrl}
          onChange={(e) => setNewUrl(e.target.value)}
          className="flex-1 rounded-lg border border-[#3a3530] bg-[#1f1a16] px-3.5 py-2 text-[#fdf6ec] placeholder-[#9a948b] focus:border-[#ff5a3c] focus:outline-none"
        />
        <select
          value={iconName}
          onChange={(e) => setIconName(e.target.value)}
          className="rounded-lg border border-[#3a3530] bg-[#1f1a16] px-3 py-2 text-[#fdf6ec] focus:border-[#ff5a3c] focus:outline-none"
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
          className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg bg-[#ff5a3c]/15 text-[#ff5a3c] border border-[#ff5a3c]/30 font-bold shadow transition disabled:opacity-40"
        >
          <Plus className="w-4 h-4" />
          <span>Ekle</span>
        </button>
      </div>

      {links.length === 0 ? (
        <p className="text-xs text-[#9a948b] italic text-center py-3">
          Henüz özel bir bağlantı eklenmedi. (Kullanıcı eklemezse butonlar portfolyoda görünmez)
        </p>
      ) : (
        <div className="space-y-2.5 text-xs">
          {links.map((link) => (
            <div
              key={link.id}
              className="flex items-center justify-between p-3 rounded-lg border border-[#3a3530] bg-[#14110f] text-[#fdf6ec]"
            >
              <div className="flex items-center gap-3">
                <span className="font-bold text-[#fdf6ec] px-2.5 py-0.5 rounded bg-[#291f19] border border-[#3a3530]">
                  {link.label}
                </span>
                <span className="text-[#d6d0c7] truncate max-w-xs sm:max-w-md">{link.url}</span>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1 rounded bg-[#1f1a16] text-[#d6d0c7] hover:text-[#fdf6ec] transition"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
                <button
                  type="button"
                  onClick={() => handleRemoveLink(link.id)}
                  className="p-1 rounded bg-[#1f1a16] text-[#d6d0c7] hover:text-red-400 transition"
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
