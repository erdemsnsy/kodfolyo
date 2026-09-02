'use client';

import { useState } from 'react';
import { UserProfile } from '@/types';
import { Sparkles, RefreshCw } from 'lucide-react';

interface ProfileEditorProps {
  profile: UserProfile;
  onSave: (updated: Partial<UserProfile>) => Promise<void>;
}

const inputStyle: React.CSSProperties = {
  width: '100%', marginTop: 7, background: '#FBF9F4', border: '1px solid rgba(25,23,32,.12)', borderRadius: 10,
  padding: '11px 13px', color: '#191720', fontFamily: 'var(--font-sans)', fontSize: 14.5, outline: 'none',
};

const labelStyle: React.CSSProperties = {
  fontFamily: 'var(--font-mono)', fontSize: 11, color: '#8C8797', letterSpacing: '.04em',
};

export default function ProfileEditor({ profile, onSave }: ProfileEditorProps) {
  const [customBio, setCustomBio] = useState(profile.custom_bio ?? profile.bio ?? '');
  const [name, setName] = useState(profile.name ?? '');
  const [location, setLocation] = useState(profile.location ?? '');
  const [company, setCompany] = useState(profile.company ?? '');
  const [blog, setBlog] = useState(profile.blog ?? '');
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

  return (
    <div style={{ padding: 24, borderRadius: 16, background: '#FFFFFF', border: '1px solid rgba(25,23,32,.09)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
        <div style={{ fontSize: 16, fontWeight: 700 }}>Temel bilgiler</div>
        <button
          type="button"
          onClick={() => handleGenerateAiBio('professional')}
          disabled={isGeneratingBio}
          style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', borderRadius: 9, background: 'rgba(99,102,241,.12)', color: '#4F46E5', border: '1px solid rgba(99,102,241,.28)', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}
        >
          {isGeneratingBio ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
          AI Biyografi
        </button>
      </div>
      <div style={{ fontSize: 13.5, color: '#6B6675', marginBottom: 18 }}>GitHub&apos;dan çekildi, istediğin gibi değiştirebilirsin.</div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        <label>
          <span style={labelStyle}>İSİM</span>
          <input value={name} onChange={(e) => { setName(e.target.value); notifyChange({ name: e.target.value }); }} style={inputStyle} />
        </label>
        <label>
          <span style={labelStyle}>KONUM</span>
          <input value={location} onChange={(e) => { setLocation(e.target.value); notifyChange({ location: e.target.value }); }} placeholder="İstanbul, Türkiye" style={inputStyle} />
        </label>
        <label>
          <span style={labelStyle}>ŞİRKET</span>
          <input value={company} onChange={(e) => { setCompany(e.target.value); notifyChange({ company: e.target.value }); }} placeholder="Kodfolyo Tech" style={inputStyle} />
        </label>
        <label>
          <span style={labelStyle}>WEB SİTESİ</span>
          <input value={blog} onChange={(e) => { setBlog(e.target.value); notifyChange({ blog: e.target.value }); }} placeholder="https://gokhan.dev" style={inputStyle} />
        </label>
        <label style={{ gridColumn: 'span 2' }}>
          <span style={labelStyle}>BİYOGRAFİ</span>
          <textarea
            value={customBio}
            onChange={(e) => { setCustomBio(e.target.value); notifyChange({ custom_bio: e.target.value }); }}
            rows={3}
            placeholder="Kendinizden ve hedeflerinizden bahsedin..."
            style={{ ...inputStyle, lineHeight: 1.5, resize: 'vertical' }}
          />
        </label>
      </div>

      {aiSuggestions.length > 0 && (
        <div style={{ marginTop: 14, display: 'flex', flexDirection: 'column', gap: 6 }}>
          <span style={{ fontSize: 11, color: '#4F46E5', fontWeight: 700 }}>✨ AI Önerileri — uygulamak için tıkla</span>
          {aiSuggestions.map((sug, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => { setCustomBio(sug); notifyChange({ custom_bio: sug }); }}
              style={{ textAlign: 'left', padding: 10, borderRadius: 10, border: '1px solid rgba(99,102,241,.25)', background: 'rgba(99,102,241,.06)', fontSize: 12.5, color: '#3A3644', cursor: 'pointer' }}
            >
              {sug}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
