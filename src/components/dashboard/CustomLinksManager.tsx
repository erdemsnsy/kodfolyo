'use client';

import { useState } from 'react';
import type React from 'react';
import { CustomLink } from '@/types';
import { Trash2, Plus, Link2, X, FileText, Globe, Mail } from 'lucide-react';
import { LinkedinIcon } from '@/components/icons/LinkedinIcon';

interface CustomLinksManagerProps {
  customLinks: CustomLink[];
  onSaveLinks: (links: CustomLink[]) => Promise<void>;
}

const ICON_CHOICES: { key: string; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { key: 'external-link', label: 'Bağlantı', icon: Link2 },
  { key: 'linkedin', label: 'LinkedIn', icon: LinkedinIcon },
  { key: 'twitter', label: 'Twitter / X', icon: X },
  { key: 'cv', label: 'CV', icon: FileText },
  { key: 'globe', label: 'Web Sitesi', icon: Globe },
  { key: 'email', label: 'E-posta', icon: Mail },
];

function iconFor(key?: string) {
  return ICON_CHOICES.find((c) => c.key === key)?.icon || Link2;
}

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

  const ready = newLabel.trim() && newUrl.trim();

  const handleAddLink = () => {
    if (!ready) return;

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

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {links.length > 0 && (
        <div style={{ background: '#FFFFFF', border: '1px solid rgba(25,23,32,.09)', borderRadius: 12, overflow: 'hidden' }}>
          {links.map((link) => {
            const Icon = iconFor(link.iconName);
            return (
              <div key={link.id} style={{ display: 'flex', alignItems: 'center', gap: 11, padding: '10px 16px', borderBottom: '1px solid rgba(25,23,32,.06)' }}>
                <span style={{ display: 'grid', placeItems: 'center', width: 28, height: 28, borderRadius: 8, background: '#FBF9F4', border: '1px solid rgba(25,23,32,.09)', color: '#56515F', flexShrink: 0 }}>
                  <Icon className="w-3.5 h-3.5" />
                </span>
                <span style={{ flexShrink: 0, fontSize: 13, fontWeight: 500 }}>{link.label}</span>
                <span style={{ flex: 1, minWidth: 0, fontFamily: 'var(--font-mono)', fontSize: 11.5, color: '#8C8797', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{link.url}</span>
                <button onClick={() => handleRemoveLink(link.id)} style={{ display: 'grid', placeItems: 'center', width: 27, height: 27, border: '1px solid rgba(25,23,32,.09)', borderRadius: 7, background: '#FFFFFF', color: '#8C8797', cursor: 'pointer', flexShrink: 0 }}>
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })}
        </div>
      )}

      <div style={{ background: '#FBF9F4', border: '1px solid rgba(25,23,32,.09)', borderRadius: 12, padding: '14px 16px' }}>
        <div style={{ display: 'flex', gap: 9, flexWrap: 'wrap' }}>
          <input
            placeholder="Etiket"
            value={newLabel}
            onChange={(e) => setNewLabel(e.target.value)}
            style={{ flex: '0 0 150px', padding: '8px 10px', border: '1px solid rgba(25,23,32,.12)', borderRadius: 7, background: '#FFFFFF', fontSize: 12.5, outline: 'none' }}
          />
          <input
            placeholder="https://"
            value={newUrl}
            onChange={(e) => setNewUrl(e.target.value)}
            style={{ flex: 1, minWidth: 180, padding: '8px 10px', border: '1px solid rgba(25,23,32,.12)', borderRadius: 7, background: '#FFFFFF', fontSize: 12.5, fontFamily: 'var(--font-mono)', outline: 'none' }}
          />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap', marginTop: 10 }}>
          {ICON_CHOICES.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              type="button"
              title={label}
              onClick={() => setIconName(key)}
              style={{ display: 'grid', placeItems: 'center', width: 32, height: 32, borderRadius: 8, cursor: 'pointer', background: '#FFFFFF', border: iconName === key ? '1px solid #1F3AE8' : '1px solid rgba(25,23,32,.14)', color: iconName === key ? '#1F3AE8' : '#8C8797' }}
            >
              <Icon className="w-3.5 h-3.5" />
            </button>
          ))}
          <div style={{ flex: 1 }} />
          <button
            type="button"
            onClick={handleAddLink}
            disabled={!ready}
            style={{ display: 'flex', alignItems: 'center', gap: 6, height: 32, padding: '0 14px', border: 0, borderRadius: 8, fontSize: 12.5, fontWeight: 500, cursor: ready ? 'pointer' : 'not-allowed', background: ready ? '#191720' : 'rgba(25,23,32,.07)', color: ready ? '#FFFFFF' : '#8C8797' }}
          >
            <Plus className="w-3.5 h-3.5" /> bağlantı ekle
          </button>
        </div>
      </div>
    </div>
  );
}
