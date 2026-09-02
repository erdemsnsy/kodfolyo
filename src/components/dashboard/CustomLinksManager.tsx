'use client';

import { useState } from 'react';
import { CustomLink } from '@/types';

interface CustomLinksManagerProps {
  customLinks: CustomLink[];
  onSaveLinks: (links: CustomLink[]) => Promise<void>;
}

const ICONS: Record<string, string> = {
  'external-link': '🔗', linkedin: '💼', twitter: '🐦', cv: '📄', globe: '🌐', email: '✉️',
};

export default function CustomLinksManager({ customLinks, onSaveLinks }: CustomLinksManagerProps) {
  const [links, setLinks] = useState<CustomLink[]>(customLinks || []);
  const [prevCustomLinks, setPrevCustomLinks] = useState<CustomLink[]>(customLinks);
  const [newLabel, setNewLabel] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const [iconName, setIconName] = useState<string>('external-link');

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

    const newEntry: CustomLink = { id: Date.now().toString(), label: newLabel.trim(), url: formattedUrl, iconName };
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

  const fieldStyle: React.CSSProperties = {
    flex: 1, background: '#FFFFFF', border: '1px solid rgba(25,23,32,.12)', borderRadius: 10, padding: '9px 12px',
    color: '#191720', fontSize: 13, outline: 'none',
  };

  return (
    <div style={{ padding: 20, borderRadius: 14, background: '#FFFFFF', border: '1px solid rgba(25,23,32,.09)' }}>
      <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 3 }}>Özel bağlantılar</div>
      <div style={{ fontSize: 13.5, color: '#6B6675', marginBottom: 16 }}>Portfolyonun üstünde buton olarak çıkar.</div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
        {links.map((link) => (
          <div key={link.id} style={{ display: 'flex', alignItems: 'center', gap: 11, padding: '11px 13px', borderRadius: 11, background: '#FBF9F4', border: '1px solid rgba(25,23,32,.1)' }}>
            <span style={{ fontSize: 15 }}>{ICONS[link.iconName || 'external-link']}</span>
            <div style={{ minWidth: 0, flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 600 }}>{link.label}</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11.5, color: '#8C8797', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{link.url}</div>
            </div>
            <button onClick={() => handleRemoveLink(link.id)} style={{ width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, color: '#A09BA8', background: 'transparent', border: 0, cursor: 'pointer' }}>×</button>
          </div>
        ))}

        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <input placeholder="Etiket (LinkedIn, CV PDF)" value={newLabel} onChange={(e) => setNewLabel(e.target.value)} style={fieldStyle} />
          <input placeholder="URL (https://...)" value={newUrl} onChange={(e) => setNewUrl(e.target.value)} style={fieldStyle} />
          <select value={iconName} onChange={(e) => setIconName(e.target.value)} style={{ ...fieldStyle, flex: 'unset' }}>
            <option value="external-link">🔗 Bağlantı</option>
            <option value="linkedin">💼 LinkedIn</option>
            <option value="twitter">🐦 Twitter / X</option>
            <option value="cv">📄 CV / PDF</option>
            <option value="globe">🌐 Web Sitesi</option>
            <option value="email">✉️ E-posta</option>
          </select>
        </div>
        <button
          type="button"
          onClick={handleAddLink}
          disabled={!newLabel.trim() || !newUrl.trim()}
          style={{ fontFamily: 'var(--font-mono)', fontSize: 12.5, color: '#00845E', background: 'transparent', border: '1px dashed rgba(0,166,118,.4)', borderRadius: 11, padding: 11, cursor: 'pointer', opacity: !newLabel.trim() || !newUrl.trim() ? 0.5 : 1 }}
        >
          + bağlantı ekle
        </button>
      </div>
    </div>
  );
}
