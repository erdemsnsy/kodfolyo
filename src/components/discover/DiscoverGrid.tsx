'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, Star } from 'lucide-react';
import { languageColor } from '@/lib/languageColors';
import type { DiscoverProfileSummary } from '@/lib/github/fetcher';

interface DiscoverGridProps {
  profiles: DiscoverProfileSummary[];
}

export default function DiscoverGrid({ profiles }: DiscoverGridProps) {
  const [search, setSearch] = useState('');
  const [langFilter, setLangFilter] = useState<string | null>(null);
  const [locationFilter, setLocationFilter] = useState<string | null>(null);

  const languages = useMemo(() => {
    const set = new Set<string>();
    profiles.forEach((p) => p.topLanguages.forEach((l) => set.add(l)));
    return Array.from(set).sort();
  }, [profiles]);

  const locations = useMemo(() => {
    const set = new Set<string>();
    profiles.forEach((p) => { if (p.location) set.add(p.location); });
    return Array.from(set).sort();
  }, [profiles]);

  const filtered = profiles.filter((p) => {
    const q = search.trim().toLowerCase();
    const matchesSearch = !q || p.username.toLowerCase().includes(q) || (p.name || '').toLowerCase().includes(q);
    const matchesLang = !langFilter || p.topLanguages.includes(langFilter);
    const matchesLocation = !locationFilter || p.location === locationFilter;
    return matchesSearch && matchesLang && matchesLocation;
  });

  const chipStyle = (active: boolean): React.CSSProperties => ({
    fontFamily: 'var(--font-mono)', fontSize: 12, padding: '6px 13px', borderRadius: 999, cursor: 'pointer',
    border: `1px solid ${active ? '#1F3AE8' : 'rgba(25,23,32,.14)'}`,
    background: active ? 'rgba(31,58,232,.08)' : 'transparent',
    color: active ? '#1F3AE8' : '#56515F',
  });

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#FFFFFF', border: '1px solid rgba(25,23,32,.14)', borderRadius: 13, padding: '5px 5px 5px 16px', marginBottom: 20, maxWidth: 420 }}>
        <Search className="w-4 h-4" style={{ color: '#8C8797' }} />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="İsim veya kullanıcı adı ara..."
          style={{ flex: 1, minWidth: 0, background: 'transparent', border: 0, outline: 'none', color: '#191720', fontSize: 14, padding: '10px 4px' }}
        />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 26 }}>
        <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap', alignItems: 'center' }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: '#8C8797', marginRight: 4 }}>DİL</span>
          <button type="button" onClick={() => setLangFilter(null)} style={chipStyle(langFilter === null)}>Tümü</button>
          {languages.map((l) => (
            <button key={l} type="button" onClick={() => setLangFilter(l)} style={chipStyle(langFilter === l)}>{l}</button>
          ))}
        </div>
        {locations.length > 0 && (
          <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap', alignItems: 'center' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: '#8C8797', marginRight: 4 }}>KONUM</span>
            <button type="button" onClick={() => setLocationFilter(null)} style={chipStyle(locationFilter === null)}>Tümü</button>
            {locations.map((l) => (
              <button key={l} type="button" onClick={() => setLocationFilter(l)} style={chipStyle(locationFilter === l)}>{l}</button>
            ))}
          </div>
        )}
      </div>

      {filtered.length === 0 ? (
        <div style={{ padding: 32, textAlign: 'center', color: '#8C8797', fontSize: 14 }}>Eşleşen profil bulunamadı.</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 14 }}>
          {filtered.map((p) => (
            <Link
              key={p.username}
              href={`/${p.username}`}
              style={{ display: 'flex', flexDirection: 'column', gap: 12, padding: 18, borderRadius: 15, border: '1px solid rgba(25,23,32,.1)', background: '#FFFFFF', textDecoration: 'none' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
                <div style={{ position: 'relative', width: 46, height: 46, borderRadius: '50%', overflow: 'hidden', flexShrink: 0, background: '#EBE7DD' }}>
                  <Image src={p.avatarUrl} alt={p.username} fill className="object-cover" />
                </div>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 14.5, fontWeight: 700, color: '#191720', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name || p.username}</div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: '#8C8797' }}>@{p.username}</div>
                </div>
              </div>

              {p.topLanguages.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                  {p.topLanguages.map((l) => (
                    <span key={l} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 11.5, fontFamily: 'var(--font-mono)', padding: '3px 9px', borderRadius: 999, background: `${languageColor(l)}1A`, color: languageColor(l) }}>
                      {l}
                    </span>
                  ))}
                </div>
              )}

              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontFamily: 'var(--font-mono)', fontSize: 12.5, color: '#6B6675' }}>
                <Star className="w-3.5 h-3.5" style={{ color: '#F5B83D' }} /> {p.totalStars} yıldız
                {p.location && <span style={{ marginLeft: 'auto', color: '#8C8797', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.location}</span>}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
