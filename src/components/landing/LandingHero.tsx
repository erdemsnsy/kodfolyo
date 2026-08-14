'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, ShieldCheck, Cpu, RefreshCw, Code2, AlertCircle } from 'lucide-react';
import { GithubIcon } from '@/components/icons/GithubIcon';
import { sanitizeUsername } from '@/lib/github/fetcher';

export default function LandingHero() {
  const router = useRouter();
  const [usernameInput, setUsernameInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleGeneratePortfolio = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanUser = sanitizeUsername(usernameInput);
    if (!cleanUser) return;

    setIsLoading(true);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/github/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: cleanUser }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setErrorMsg(`"${cleanUser}" adında geçerli bir GitHub kullanıcısı bulunamadı.`);
        setIsLoading(false);
        return;
      }

      if (typeof window !== 'undefined') {
        localStorage.setItem('kodfolyo_active_username', cleanUser);
      }
      router.push(`/${cleanUser}`);
    } catch (err) {
      console.error(err);
      if (typeof window !== 'undefined') {
        localStorage.setItem('kodfolyo_active_username', cleanUser);
      }
      router.push(`/${cleanUser}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="relative overflow-hidden pt-14 pb-14 sm:pt-20 sm:pb-24">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 text-center space-y-6">
        {/* Kurumsal Rozet */}
        <div className="inline-flex items-center gap-2 rounded-full border border-[#23272e] bg-[#141619] px-4 py-1.5 text-xs font-semibold text-slate-300 shadow-sm">
          <Code2 className="h-3.5 w-3.5 text-white" />
          <span>Geliştiriciler İçin Kurumsal & Sade Portfolyo Üreteci</span>
        </div>

        {/* Ana Başlık */}
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
          GitHub Kullanıcı Adını Gir, <br className="hidden sm:inline" />
          <span className="text-slate-300 underline decoration-slate-600 underline-offset-8">Profesyonel Portfolyonu</span> Anında Çek
        </h1>

        {/* Gövde Metni */}
        <p className="mx-auto max-w-2xl text-sm sm:text-base text-[#94a3b8] leading-relaxed">
          Karmaşık şablonları unut. GitHub kullanıcı adını veya profil URL adresini gir; profilin, projelerin ve dillerin <code className="text-white bg-[#141619] px-2 py-0.5 rounded border border-[#23272e]">/kullaniciadi</code> adresinde kurumsal bir sade kimlikle yayınlansın.
        </p>

        {/* Hızlı Kullanıcı Adı Girme Formu */}
        <form onSubmit={handleGeneratePortfolio} className="mx-auto max-w-lg pt-2 space-y-3">
          <div className="flex flex-col sm:flex-row gap-2.5 p-2 rounded-2xl border border-[#23272e] bg-[#141619] shadow-2xl">
            <div className="flex items-center gap-2 px-3 flex-1 text-sm text-[#f8fafc]">
              <span className="text-slate-400 font-bold">@</span>
              <input
                type="text"
                value={usernameInput}
                onChange={(e) => {
                  setUsernameInput(e.target.value);
                  if (errorMsg) setErrorMsg(null);
                }}
                placeholder="github_kullanici_adi veya URL"
                className="w-full bg-transparent border-none outline-none placeholder-[#64748b] text-xs sm:text-sm"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading || !usernameInput.trim()}
              className="flex items-center justify-center gap-2 rounded-xl bg-white hover:bg-slate-200 px-6 py-3 text-xs font-bold text-slate-950 shadow transition active:scale-95 disabled:opacity-50 shrink-0"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Çekiliyor...</span>
                </>
              ) : (
                <>
                  <GithubIcon className="w-4 h-4" />
                  <span>Portfolyomu Çek</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>

          {/* Doğrulama Hata Mesajı */}
          {errorMsg && (
            <div className="flex items-center justify-center gap-1.5 text-xs text-red-400 font-medium">
              <AlertCircle className="w-4 h-4" />
              <span>{errorMsg}</span>
            </div>
          )}
        </form>

        {/* Örnek Hızlı Seçenekler */}
        <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-[#94a3b8] pt-1">
          <span>Örnek canlı profiller:</span>
          {['mvanhorn', 'torvalds', 'gaearon', 'sindresorhus'].map((demoUser) => (
            <button
              key={demoUser}
              onClick={() => {
                setUsernameInput(demoUser);
                router.push(`/${demoUser}`);
              }}
              className="px-2.5 py-1 rounded-lg bg-[#141619] border border-[#23272e] hover:border-slate-400 hover:text-white transition"
            >
              @{demoUser}
            </button>
          ))}
        </div>

        {/* Güvence Etiketleri */}
        <div className="flex flex-wrap items-center justify-center gap-6 pt-4 text-xs text-[#64748b]">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-white" />
            Otomatik Profil & URL Ayıklama
          </span>
          <span className="flex items-center gap-1.5">
            <Cpu className="w-4 h-4 text-slate-400" />
            GitHub Public REST API Senkronizasyonu
          </span>
        </div>
      </div>
    </section>
  );
}
