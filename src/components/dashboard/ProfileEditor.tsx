'use client';

import { useState } from 'react';
import type React from 'react';
import { UserProfile } from '@/types';
import { Sparkles, RefreshCw, User, MapPin, Building2, Globe, Rss, AlignLeft, Search } from 'lucide-react';

interface ProfileEditorProps {
  profile: UserProfile;
  onSave: (updated: Partial<UserProfile>) => Promise<void>;
}

const INPUT_CLASS =
  'w-full bg-zinc-50/50 border border-zinc-200 focus:bg-white focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 rounded-lg text-sm text-zinc-900 placeholder:text-zinc-400 transition-all outline-none pl-8 pr-3 py-1.5';

const labelStyle: React.CSSProperties = {
  fontFamily: 'var(--font-mono)', fontSize: 10.5, letterSpacing: '.05em', textTransform: 'uppercase', color: '#A1A1AA',
};

export default function ProfileEditor({ profile, onSave }: ProfileEditorProps) {
  const [customBio, setCustomBio] = useState(profile.custom_bio ?? profile.bio ?? '');
  const [name, setName] = useState(profile.name ?? '');
  const [location, setLocation] = useState(profile.location ?? '');
  const [company, setCompany] = useState(profile.company ?? '');
  const [blog, setBlog] = useState(profile.blog ?? '');
  const [rssUrl, setRssUrl] = useState(profile.rss_url ?? '');
  const [seoTitle, setSeoTitle] = useState(profile.seo_title ?? '');
  const [seoDescription, setSeoDescription] = useState(profile.seo_description ?? '');
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

  const fields: { label: string; value: string; set: (v: string) => void; placeholder: string; icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }> }[] = [
    { label: 'İsim', value: name, set: (v) => { setName(v); notifyChange({ name: v }); }, placeholder: 'Ad Soyad', icon: User },
    { label: 'Konum', value: location, set: (v) => { setLocation(v); notifyChange({ location: v }); }, placeholder: 'Şehir, Ülke', icon: MapPin },
    { label: 'Şirket', value: company, set: (v) => { setCompany(v); notifyChange({ company: v }); }, placeholder: 'Şirket', icon: Building2 },
    { label: 'Web sitesi', value: blog, set: (v) => { setBlog(v); notifyChange({ blog: v }); }, placeholder: 'site.com', icon: Globe },
    { label: 'RSS', value: rssUrl, set: (v) => { setRssUrl(v); notifyChange({ rss_url: v }); }, placeholder: 'dev.to/feed/kullanici', icon: Rss },
  ];

  const completion = [
    { label: 'İsim', ok: !!name.trim() },
    { label: 'Konum', ok: !!location.trim() },
    { label: 'Şirket', ok: !!company.trim() },
    { label: 'Web sitesi', ok: !!blog.trim() },
    { label: 'RSS', ok: !!rssUrl.trim() },
    { label: 'Biyografi', ok: !!customBio.trim() },
  ];
  const completeCount = completion.filter((c) => c.ok).length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
    <div style={{ background: '#FFFFFF', border: '1px solid rgba(228,228,231,.8)', borderRadius: 16, boxShadow: '0 1px 2px 0 rgba(0,0,0,0.04)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, padding: '13px 16px', borderBottom: '1px solid rgba(228,228,231,.09)' }}>
        <span style={{ fontSize: 13, fontWeight: 600 }}>Temel bilgiler</span>
        <button
          type="button"
          onClick={() => handleGenerateAiBio('professional')}
          disabled={isGeneratingBio}
          className="hover:bg-zinc-100 transition-colors"
          style={{ display: 'flex', alignItems: 'center', gap: 6, height: 30, padding: '0 11px', border: '1px solid rgba(24,24,27,.28)', borderRadius: 8, background: 'rgba(24,24,27,.06)', color: '#18181B', fontSize: 12, fontWeight: 500, cursor: 'pointer' }}
        >
          {isGeneratingBio ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
          {isGeneratingBio ? 'yazılıyor…' : 'AI biyografi'}
        </button>
      </div>

      {aiSuggestions.length > 0 && (
        <div style={{ padding: '12px 16px', background: '#FAFAFA', borderBottom: '1px solid rgba(228,228,231,.09)', display: 'flex', flexDirection: 'column', gap: 7 }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9.5, letterSpacing: '.07em', textTransform: 'uppercase', color: '#A1A1AA' }}>3 öneri · tıkla, uygulansın</span>
          {aiSuggestions.map((sug, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => { setCustomBio(sug); notifyChange({ custom_bio: sug }); setAiSuggestions([]); }}
              style={{ textAlign: 'left', padding: '10px 12px', border: '1px solid rgba(228,228,231,.09)', borderRadius: 9, background: '#FFFFFF', color: '#52525B', fontSize: 12.5, lineHeight: 1.5, cursor: 'pointer' }}
            >
              {sug}
            </button>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4" style={{ padding: '14px 16px' }}>
        {fields.map((f) => (
          <div key={f.label} className="flex flex-col gap-1">
            <span style={labelStyle}>{f.label}</span>
            <div style={{ position: 'relative' }}>
              <f.icon className="w-3.5 h-3.5" style={{ position: 'absolute', left: 9, top: '50%', transform: 'translateY(-50%)', color: '#A1A1AA', pointerEvents: 'none' }} />
              <input value={f.value} onChange={(e) => f.set(e.target.value)} placeholder={f.placeholder} className={INPUT_CLASS} />
            </div>
          </div>
        ))}
        <div className="col-span-full flex flex-col gap-1">
          <span style={labelStyle}>Biyografi</span>
          <div style={{ position: 'relative' }}>
            <AlignLeft className="w-3.5 h-3.5" style={{ position: 'absolute', left: 9, top: 11, color: '#A1A1AA', pointerEvents: 'none' }} />
            <textarea
              value={customBio}
              onChange={(e) => { setCustomBio(e.target.value); notifyChange({ custom_bio: e.target.value }); }}
              rows={4}
              placeholder="Kendinizden ve hedeflerinizden bahsedin..."
              className={`${INPUT_CLASS} resize-y`}
              style={{ lineHeight: 1.55 }}
            />
          </div>
        </div>
      </div>
    </div>

      <div style={{ background: '#FFFFFF', border: '1px solid rgba(228,228,231,.8)', borderRadius: 16, boxShadow: '0 1px 2px 0 rgba(0,0,0,0.04)', padding: '16px 18px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginBottom: 12 }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '.07em', textTransform: 'uppercase', color: '#A1A1AA' }}>Profil tamamlanma</span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11.5, color: '#71717A' }}>{completeCount}/{completion.length}</span>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {completion.map((c) => (
            <span
              key={c.label}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 6, padding: '5px 11px', borderRadius: 999,
                fontSize: 12, fontWeight: 500,
                background: c.ok ? 'rgba(0,166,118,.1)' : '#FAFAFA',
                color: c.ok ? '#00845E' : '#A1A1AA',
                border: `1px solid ${c.ok ? 'rgba(0,166,118,.25)' : '#E4E4E7'}`,
              }}
            >
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: c.ok ? '#00845E' : '#D4D4D8' }} />
              {c.label}
            </span>
          ))}
        </div>
      </div>

      <div style={{ background: '#FFFFFF', border: '1px solid rgba(228,228,231,.8)', borderRadius: 16, boxShadow: '0 1px 2px 0 rgba(0,0,0,0.04)', padding: '16px 18px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 12 }}>
          <Search className="w-3.5 h-3.5" style={{ color: '#A1A1AA' }} />
          <span style={{ fontSize: 13, fontWeight: 600 }}>SEO</span>
          <span style={{ fontSize: 11.5, color: '#A1A1AA' }}>— Google&apos;da nasıl göründüğünü özelleştir, boş bırakırsan otomatik oluşur.</span>
        </div>
        <div className="grid grid-cols-1 gap-4">
          <div className="flex flex-col gap-1">
            <span style={labelStyle}>Sayfa başlığı</span>
            <div style={{ position: 'relative' }}>
              <Search className="w-3.5 h-3.5" style={{ position: 'absolute', left: 9, top: '50%', transform: 'translateY(-50%)', color: '#A1A1AA', pointerEvents: 'none' }} />
              <input
                value={seoTitle}
                onChange={(e) => { setSeoTitle(e.target.value); notifyChange({ seo_title: e.target.value }); }}
                placeholder={`${name || profile.username} (@${profile.username}) - Kodfolyo`}
                className={INPUT_CLASS}
              />
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <span style={labelStyle}>Sayfa açıklaması</span>
            <div style={{ position: 'relative' }}>
              <AlignLeft className="w-3.5 h-3.5" style={{ position: 'absolute', left: 9, top: 11, color: '#A1A1AA', pointerEvents: 'none' }} />
              <textarea
                value={seoDescription}
                onChange={(e) => { setSeoDescription(e.target.value); notifyChange({ seo_description: e.target.value }); }}
                rows={2}
                placeholder="Arama sonuçlarında görünecek kısa açıklama (~160 karakter)"
                className={`${INPUT_CLASS} resize-y`}
                style={{ lineHeight: 1.55 }}
              />
            </div>
            <span style={{ fontSize: 10.5, color: seoDescription.length > 160 ? '#C6314E' : '#A1A1AA', textAlign: 'right' }}>{seoDescription.length}/160</span>
          </div>
        </div>
      </div>
    </div>
  );
}
