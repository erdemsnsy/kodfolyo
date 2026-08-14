'use client';

import { useState } from 'react';
import { UserProfile } from '@/types';
import { User, Sparkles, RefreshCw } from 'lucide-react';

interface ProfileEditorProps {
  profile: UserProfile;
  onSave: (updated: Partial<UserProfile>) => Promise<void>;
}

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
        body: JSON.stringify({
          username: profile.username,
          name,
          company,
          location,
          tone,
        }),
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
    <div className="rounded-2xl border border-[#23272e] bg-[#141619] p-6 sm:p-8 shadow-xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-white/5 text-white border border-white/10">
            <User className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white">Profil & Biyografi Düzenleme</h2>
            <p className="text-xs text-[#94a3b8]">
              Portfolyo sitenizde görünecek özel biyografi ve kişisel iletişim bilgilerinizi girin.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => handleGenerateAiBio('professional')}
          disabled={isGeneratingBio}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 text-xs font-semibold transition"
        >
          {isGeneratingBio ? (
            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          )}
          <span>AI Biyografi Üret</span>
        </button>
      </div>

      <div className="space-y-5">
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-semibold text-slate-300">
              Özel Biyografi (Custom Bio)
            </label>
            {aiSuggestions.length > 0 && (
              <span className="text-[11px] text-indigo-400 font-medium">Uygulamak için öneriye tıklayın</span>
            )}
          </div>

          <textarea
            value={customBio}
            onChange={(e) => {
              setCustomBio(e.target.value);
              notifyChange({ custom_bio: e.target.value });
            }}
            rows={3}
            placeholder="Kendinizden ve hedeflerinizden bahsedin..."
            className="w-full rounded-xl border border-[#23272e] bg-[#0c0d0e] px-4 py-3 text-sm text-white placeholder-[#64748b] focus:border-white focus:outline-none transition"
          />

          {aiSuggestions.length > 0 && (
            <div className="space-y-2 pt-2">
              <span className="text-[11px] text-[#94a3b8] font-bold">✨ AI Önerileri:</span>
              <div className="space-y-1.5">
                {aiSuggestions.map((sug, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setCustomBio(sug);
                      notifyChange({ custom_bio: sug });
                    }}
                    className="w-full text-left p-2.5 rounded-lg border border-[#23272e] bg-[#0c0d0e] hover:border-indigo-500/50 hover:bg-indigo-500/10 text-xs text-slate-200 transition"
                  >
                    {sug}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="space-y-1.5">
            <label className="block font-semibold text-slate-300">Görüntülenecek İsim</label>
            <input
              type="text"
              value={name}
              onChange={(e) => { setName(e.target.value); notifyChange({ name: e.target.value }); }}
              className="w-full rounded-xl border border-[#23272e] bg-[#0c0d0e] px-4 py-2.5 text-sm text-white focus:border-white focus:outline-none transition"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block font-semibold text-slate-300">Konum / Şehir</label>
            <input
              type="text"
              value={location}
              onChange={(e) => { setLocation(e.target.value); notifyChange({ location: e.target.value }); }}
              placeholder="İstanbul, Türkiye"
              className="w-full rounded-xl border border-[#23272e] bg-[#0c0d0e] px-4 py-2.5 text-sm text-white focus:border-white focus:outline-none transition"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="space-y-1.5">
            <label className="block font-semibold text-slate-300">Okul / Şirket</label>
            <input
              type="text"
              value={company}
              onChange={(e) => { setCompany(e.target.value); notifyChange({ company: e.target.value }); }}
              placeholder="İTÜ Bilgisayar Mühendisliği"
              className="w-full rounded-xl border border-[#23272e] bg-[#0c0d0e] px-4 py-2.5 text-sm text-white focus:border-white focus:outline-none transition"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block font-semibold text-slate-300">Web Sitesi / Blog</label>
            <input
              type="text"
              value={blog}
              onChange={(e) => { setBlog(e.target.value); notifyChange({ blog: e.target.value }); }}
              placeholder="https://gokhan.dev"
              className="w-full rounded-xl border border-[#23272e] bg-[#0c0d0e] px-4 py-2.5 text-sm text-white focus:border-white focus:outline-none transition"
            />
          </div>
        </div>

      </div>
    </div>
  );
}
