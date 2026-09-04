'use client';

import { useState } from 'react';
import type React from 'react';
import Image from 'next/image';
import { CustomLink } from '@/types';
import { Trash2, Plus, Link2, X, FileText, Globe, Mail, Tag, Phone } from 'lucide-react';
import { LinkedinIcon } from '@/components/icons/LinkedinIcon';
import { DiscordIcon } from '@/components/icons/DiscordIcon';
import { StackOverflowIcon } from '@/components/icons/StackOverflowIcon';

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
  { key: 'phone', label: 'Telefon', icon: Phone },
  { key: 'discord', label: 'Discord', icon: DiscordIcon },
  { key: 'stackoverflow', label: 'Stack Overflow', icon: StackOverflowIcon },
];

function iconFor(key?: string) {
  return ICON_CHOICES.find((c) => c.key === key)?.icon || Link2;
}

const QUICK_SUGGESTIONS: { label: string; iconName: string; urlHint: string }[] = [
  { label: 'LinkedIn', iconName: 'linkedin', urlHint: 'linkedin.com/in/' },
  { label: 'CV', iconName: 'cv', urlHint: '' },
  { label: 'Web Sitesi', iconName: 'globe', urlHint: '' },
  { label: 'E-posta', iconName: 'email', urlHint: 'mailto:' },
  { label: 'Telefon', iconName: 'phone', urlHint: 'tel:' },
  { label: 'Discord', iconName: 'discord', urlHint: '' },
  { label: 'Stack Overflow', iconName: 'stackoverflow', urlHint: 'stackoverflow.com/users/' },
];

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
    if (!/^(https?:|mailto:|tel:)/.test(formattedUrl)) {
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
      {links.length === 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, textAlign: 'center', padding: '30px 20px', borderRadius: 16, border: '1px dashed rgba(228,228,231,.9)', color: '#A1A1AA' }}>
          <span style={{ position: 'relative', width: 44, height: 44 }}>
            <Image src="/icons/linkler.png" alt="" fill sizes="44px" style={{ objectFit: 'contain' }} />
          </span>
          <span style={{ fontSize: 12.5 }}>Henüz özel bağlantı eklemedin.</span>
        </div>
      )}
      {links.length > 0 && (
        <div style={{ background: '#FFFFFF', border: '1px solid rgba(228,228,231,.8)', borderRadius: 16, boxShadow: '0 1px 2px 0 rgba(0,0,0,0.04)', overflow: 'hidden' }}>
          {links.map((link) => {
            const Icon = iconFor(link.iconName);
            return (
              <div key={link.id} style={{ display: 'flex', alignItems: 'center', gap: 11, padding: '10px 16px', borderBottom: '1px solid rgba(228,228,231,.06)' }}>
                <span style={{ display: 'grid', placeItems: 'center', width: 28, height: 28, borderRadius: 8, background: '#FAFAFA', border: '1px solid rgba(228,228,231,.09)', color: '#52525B', flexShrink: 0 }}>
                  <Icon className="w-3.5 h-3.5" />
                </span>
                <span style={{ flexShrink: 0, fontSize: 13, fontWeight: 500 }}>{link.label}</span>
                <span style={{ flex: 1, minWidth: 0, fontFamily: 'var(--font-mono)', fontSize: 11.5, color: '#A1A1AA', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{link.url}</span>
                <button onClick={() => handleRemoveLink(link.id)} style={{ display: 'grid', placeItems: 'center', width: 27, height: 27, border: '1px solid rgba(228,228,231,.09)', borderRadius: 7, background: '#FFFFFF', color: '#A1A1AA', cursor: 'pointer', flexShrink: 0 }}>
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })}
        </div>
      )}

      <div style={{ background: '#FAFAFA', border: '1px solid rgba(228,228,231,.8)', borderRadius: 16, boxShadow: '0 1px 2px 0 rgba(0,0,0,0.04)', padding: '14px 16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7, flexWrap: 'wrap', marginBottom: 12 }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9.5, letterSpacing: '.06em', textTransform: 'uppercase', color: '#A1A1AA', marginRight: 2 }}>Hızlı ekle</span>
          {QUICK_SUGGESTIONS.map((s) => (
            <button
              key={s.label}
              type="button"
              onClick={() => { setNewLabel(s.label); setIconName(s.iconName); setNewUrl(s.urlHint); }}
              className="hover:bg-zinc-100 transition-colors"
              style={{ fontSize: 11.5, fontWeight: 500, color: '#52525B', background: '#FFFFFF', border: '1px solid #E4E4E7', borderRadius: 999, padding: '4px 11px', cursor: 'pointer' }}
            >
              + {s.label}
            </button>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 9, flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', flex: '0 0 150px' }}>
            <Tag className="w-3.5 h-3.5" style={{ position: 'absolute', left: 9, top: '50%', transform: 'translateY(-50%)', color: '#A1A1AA', pointerEvents: 'none' }} />
            <input
              placeholder="Etiket"
              value={newLabel}
              onChange={(e) => setNewLabel(e.target.value)}
              className="w-full bg-white border border-zinc-200 focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 rounded-lg text-sm text-zinc-900 placeholder:text-zinc-400 transition-all outline-none pl-8 pr-2.5 py-1.5"
            />
          </div>
          <div style={{ position: 'relative', flex: 1, minWidth: 180 }}>
            <Link2 className="w-3.5 h-3.5" style={{ position: 'absolute', left: 9, top: '50%', transform: 'translateY(-50%)', color: '#A1A1AA', pointerEvents: 'none' }} />
            <input
              placeholder="https://"
              value={newUrl}
              onChange={(e) => setNewUrl(e.target.value)}
              className="w-full bg-white border border-zinc-200 focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 rounded-lg text-sm text-zinc-900 placeholder:text-zinc-400 transition-all outline-none pl-8 pr-2.5 py-1.5"
              style={{ fontFamily: 'var(--font-mono)' }}
            />
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap', marginTop: 10 }}>
          {ICON_CHOICES.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              type="button"
              title={label}
              onClick={() => setIconName(key)}
              className="hover:bg-zinc-50 transition-colors"
              style={{ display: 'grid', placeItems: 'center', width: 32, height: 32, borderRadius: 8, cursor: 'pointer', background: '#FFFFFF', border: iconName === key ? '1px solid #18181B' : '1px solid rgba(228,228,231,.14)', color: iconName === key ? '#18181B' : '#A1A1AA' }}
            >
              <Icon className="w-3.5 h-3.5" />
            </button>
          ))}
          <div style={{ flex: 1 }} />
          <button
            type="button"
            onClick={handleAddLink}
            disabled={!ready}
            className={ready ? 'hover:bg-zinc-800 transition-colors' : ''}
            style={{ display: 'flex', alignItems: 'center', gap: 6, height: 32, padding: '0 14px', border: 0, borderRadius: 8, fontSize: 12.5, fontWeight: 500, cursor: ready ? 'pointer' : 'not-allowed', background: ready ? '#18181B' : 'rgba(228,228,231,.07)', color: ready ? '#FFFFFF' : '#A1A1AA' }}
          >
            <Plus className="w-3.5 h-3.5" /> bağlantı ekle
          </button>
        </div>
      </div>
    </div>
  );
}
