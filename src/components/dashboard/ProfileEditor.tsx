'use client';

import { useState } from 'react';
import { UserProfile } from '@/types';
import { Sparkles, RefreshCw } from 'lucide-react';

interface ProfileEditorProps {
  profile: UserProfile;
  onSave: (updated: Partial<UserProfile>) => Promise<void>;
}

const inputStyle: React.CSSProperties = {
  flex: 1, minWidth: 0, padding: '7px 10px', border: '1px solid rgba(25,23,32,.12)', borderRadius: 7,
  background: '#FBF9F4', color: '#191720', fontFamily: 'var(--font-sans)', fontSize: 13, outline: 'none',
};

const labelStyle: React.CSSProperties = {
  flex: '0 0 108px', fontFamily: 'var(--font-mono)', fontSize: 10.5, letterSpacing: '.05em', textTransform: 'uppercase', color: '#8C8797',
};

export default function ProfileEditor({ profile, onSave }: ProfileEditorProps) {
  const [customBio, setCustomBio] = useState(profile.custom_bio ?? profile.bio ?? '');
  const [name, setName] = useState(profile.name ?? '');
  const [location, setLocation] = useState(profile.location ?? '');
  const [company, setCompany] = useState(profile.company ?? '');
  const [blog, setBlog] = useState(profile.blog ?? '');
  const [rssUrl, setRssUrl] = useState(profile.rss_url ?? '');
  const [isGeneratingBio, setIsGeneratingBio] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);

  const handleGenerateAiBio = async (tone: 'professional' | 'creative' | 'minimal' = 'professional') => {
    setIsGeneratingBio(true);
    try {
      const res = await fetch('/api/ai/bio-suggest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: profile.username, name, company, location, tone }),
      });
      const data = await res.json();
      if (data.success && data.suggestedBios) {
        setAiSuggestions(data.suggestedBios);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsGeneratingBio(false);
    }
  };

  const notifyChange = (fields: Partial<UserProfile>) => {
    onSave(fields).catch(console.error);
  };

  const fields: { label: string; value: string; set: (v: string) => void; placeholder: string }[] = [
    { label: 'İsim', value: name, set: (v) => { setName(v); notifyChange({ name: v }); }, placeholder: 'Ad Soyad' },
    { label: 'Konum', value: location, set: (v) => { setLocation(v); notifyChange({ location: v }); }, placeholder: 'Şehir, Ülke' },
    { label: 'Şirket', value: company, set: (v) => { setCompany(v); notifyChange({ company: v }); }, placeholder: 'Şirket' },
    { label: 'Web sitesi', value: blog, set: (v) => { setBlog(v); notifyChange({ blog: v }); }, placeholder: 'site.com' },
    { label: 'RSS', value: rssUrl, set: (v) => { setRssUrl(v); notifyChange({ rss_url: v }); }, placeholder: 'dev.to/feed/kullanici' },
  ];

  return (
    <div style={{ background: '#FFFFFF', border: '1px solid rgba(25,23,32,.09)', borderRadius: 12 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, padding: '13px 16px', borderBottom: '1px solid rgba(25,23,32,.09)' }}>
        <span style={{ fontSize: 13, fontWeight: 600 }}>Temel bilgiler</span>
        <button
          type="button"
          onClick={() => handleGenerateAiBio('professional')}
          disabled={isGeneratingBio}
          style={{ display: 'flex', alignItems: 'center', gap: 6, height: 30, padding: '0 11px', border: '1px solid rgba(31,58,232,.28)', borderRadius: 8, background: 'rgba(31,58,232,.06)', color: '#1F3AE8', fontSize: 12, fontWeight: 500, cursor: 'pointer' }}
        >
          {isGeneratingBio ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
          {isGeneratingBio ? 'yazılıyor…' : 'AI biyografi'}
        </button>
      </div>

      {aiSuggestions.length > 0 && (
        <div style={{ padding: '12px 16px', background: '#FBF9F4', borderBottom: '1px solid rgba(25,23,32,.09)', display: 'flex', flexDirection: 'column', gap: 7 }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9.5, letterSpacing: '.07em', textTransform: 'uppercase', color: '#8C8797' }}>3 öneri — tıkla, uygulansın</span>
          {aiSuggestions.map((sug, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => { setCustomBio(sug); notifyChange({ custom_bio: sug }); setAiSuggestions([]); }}
              style={{ textAlign: 'left', padding: '10px 12px', border: '1px solid rgba(25,23,32,.09)', borderRadius: 9, background: '#FFFFFF', color: '#56515F', fontSize: 12.5, lineHeight: 1.5, cursor: 'pointer' }}
            >
              {sug}
            </button>
          ))}
        </div>
      )}

      <div style={{ padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 2 }}>
        {fields.map((f) => (
          <div key={f.label} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '7px 0', borderBottom: '1px solid rgba(25,23,32,.06)' }}>
            <span style={labelStyle}>{f.label}</span>
            <input value={f.value} onChange={(e) => f.set(e.target.value)} placeholder={f.placeholder} style={inputStyle} />
          </div>
        ))}
        <div style={{ display: 'flex', gap: 14, paddingTop: 11 }}>
          <span style={{ ...labelStyle, paddingTop: 8 }}>Biyografi</span>
          <textarea
            value={customBio}
            onChange={(e) => { setCustomBio(e.target.value); notifyChange({ custom_bio: e.target.value }); }}
            rows={4}
            placeholder="Kendinizden ve hedeflerinizden bahsedin..."
            style={{ flex: 1, minWidth: 0, padding: '9px 11px', border: '1px solid rgba(25,23,32,.12)', borderRadius: 8, background: '#FBF9F4', fontSize: 13, lineHeight: 1.55, resize: 'vertical', outline: 'none', fontFamily: 'var(--font-sans)', color: '#191720' }}
          />
        </div>
      </div>
    </div>
  );
}
