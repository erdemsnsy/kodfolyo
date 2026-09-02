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
    <div className="rounded-3xl border border-[#384139] bg-[#17201b] p-6 sm:p-8 shadow-[5px_5px_0_0_#0d1310] space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-[#1fd88f]/10 text-[#1fd88f] border border-[#1fd88f]/25">
            <Link2 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-[#f2f7f0]">Özel Bağlantılar & CV Linki</h2>
            <p className="text-xs text-[#c9d1cb]">
              LinkedIn profilinizi, CV PDF veya kişisel blog bağlantınızı ekleyin
            </p>
          </div>
        </div>

        <button
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-1.5 rounded-full bg-[#1fd88f] hover:bg-[#4eeaa8] px-4 py-2 text-xs font-bold text-[#0d1310] shadow-[3px_3px_0_0_#0d1310] transition disabled:opacity-50"
        >
          <Save className="w-3.5 h-3.5" />
          <span>{isSaving ? 'Kaydediliyor...' : 'Kaydet'}</span>
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 p-4 rounded-xl border border-[#384139] bg-[#0d1310] text-xs">
        <input
          type="text"
          placeholder="Etiket (LinkedIn, CV PDF)"
          value={newLabel}
          onChange={(e) => setNewLabel(e.target.value)}
          className="flex-1 rounded-lg border border-[#384139] bg-[#17201b] px-3.5 py-2 text-[#f2f7f0] placeholder-[#93a297] focus:border-[#1fd88f] focus:outline-none"
        />
        <input
          type="text"
          placeholder="URL (https://...)"
          value={newUrl}
          onChange={(e) => setNewUrl(e.target.value)}
          className="flex-1 rounded-lg border border-[#384139] bg-[#17201b] px-3.5 py-2 text-[#f2f7f0] placeholder-[#93a297] focus:border-[#1fd88f] focus:outline-none"
        />
        <select
          value={iconName}
          onChange={(e) => setIconName(e.target.value)}
          className="rounded-lg border border-[#384139] bg-[#17201b] px-3 py-2 text-[#f2f7f0] focus:border-[#1fd88f] focus:outline-none"
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
          className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg bg-[#1fd88f]/15 text-[#1fd88f] border border-[#1fd88f]/30 font-bold shadow transition disabled:opacity-40"
        >
          <Plus className="w-4 h-4" />
          <span>Ekle</span>
        </button>
      </div>

      {links.length === 0 ? (
        <p className="text-xs text-[#93a297] italic text-center py-3">
          Henüz özel bir bağlantı eklenmedi. (Kullanıcı eklemezse butonlar portfolyoda görünmez)
        </p>
      ) : (
        <div className="space-y-2.5 text-xs">
          {links.map((link) => (
            <div
              key={link.id}
              className="flex items-center justify-between p-3 rounded-lg border border-[#384139] bg-[#0d1310] text-[#f2f7f0]"
            >
              <div className="flex items-center gap-3">
                <span className="font-bold text-[#f2f7f0] px-2.5 py-0.5 rounded bg-[#1e2a23] border border-[#384139]">
                  {link.label}
                </span>
                <span className="text-[#c9d1cb] truncate max-w-xs sm:max-w-md">{link.url}</span>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1 rounded bg-[#17201b] text-[#c9d1cb] hover:text-[#f2f7f0] transition"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
                <button
                  type="button"
                  onClick={() => handleRemoveLink(link.id)}
                  className="p-1 rounded bg-[#17201b] text-[#c9d1cb] hover:text-red-400 transition"
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
