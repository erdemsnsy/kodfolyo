'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, ShieldCheck, Cpu, RefreshCw, Code2, AlertCircle } from 'lucide-react';
import { GithubIcon } from '@/components/icons/GithubIcon';
import { sanitizeUsername } from '@/lib/github/fetcher';
import Kodi from '@/components/mascot/Kodi';

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
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <div className="flex flex-col lg:flex-row items-center gap-10">
          <div className="flex-1 text-center lg:text-left space-y-6">
            {/* Kurumsal Rozet */}
            <div className="inline-flex items-center gap-2 rounded-full border border-[#3a2c22] bg-[#1f1a16] px-4 py-1.5 text-xs font-semibold text-[#cbb9a0] shadow-[3px_3px_0_0_#14110f]">
              <Code2 className="h-3.5 w-3.5 text-[#ff5a3c]" />
              <span>Geliştiriciler İçin Kurumsal & Sade Portfolyo Üreteci</span>
            </div>

            {/* Ana Başlık */}
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#fdf6ec] leading-tight">
              GitHub Kullanıcı Adını Gir, <br className="hidden sm:inline" />
              <span className="text-[#f5b83d]">Profesyonel Portfolyonu</span> Anında Çek
            </h1>

            {/* Gövde Metni */}
            <p className="mx-auto lg:mx-0 max-w-2xl text-sm sm:text-base text-[#cbb9a0] leading-relaxed">
              Karmaşık şablonları unut. GitHub kullanıcı adını veya profil URL adresini gir; profilin, projelerin ve dillerin <code className="text-[#fdf6ec] bg-[#1f1a16] px-2 py-0.5 rounded border border-[#3a2c22]">/kullaniciadi</code> adresinde kurumsal bir sade kimlikle yayınlansın.
            </p>

            {/* Hızlı Kullanıcı Adı Girme Formu */}
            <form onSubmit={handleGeneratePortfolio} className="mx-auto lg:mx-0 max-w-lg pt-2 space-y-3">
              <div className="flex flex-col sm:flex-row gap-2.5 p-2 rounded-full border border-[#3a2c22] bg-[#1f1a16] shadow-[4px_4px_0_0_#14110f]">
                <div className="flex items-center gap-2 pl-4 pr-3 flex-1 text-sm text-[#fdf6ec]">
                  <span className="text-[#8a7864] font-bold">@</span>
                  <input
                    type="text"
                    value={usernameInput}
                    onChange={(e) => {
                      setUsernameInput(e.target.value);
                      if (errorMsg) setErrorMsg(null);
                    }}
                    placeholder="github_kullanici_adi veya URL"
                    className="w-full bg-transparent border-none outline-none placeholder-[#8a7864] text-xs sm:text-sm"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isLoading || !usernameInput.trim()}
                  className="flex items-center justify-center gap-2 rounded-full bg-[#ff5a3c] hover:bg-[#ff7159] px-6 py-3 text-xs font-bold text-[#14110f] shadow-[3px_3px_0_0_#f5b83d] transition active:scale-95 disabled:opacity-50 shrink-0"
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
                <div className="flex items-center justify-center lg:justify-start gap-1.5 text-xs text-red-400 font-medium">
                  <AlertCircle className="w-4 h-4" />
                  <span>{errorMsg}</span>
                </div>
              )}
            </form>

            {/* Örnek Hızlı Seçenekler */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 text-xs text-[#cbb9a0] pt-1">
              <span>Örnek canlı profiller:</span>
              {['mvanhorn', 'torvalds', 'gaearon', 'sindresorhus'].map((demoUser) => (
                <button
                  key={demoUser}
                  onClick={() => {
                    setUsernameInput(demoUser);
                    router.push(`/${demoUser}`);
                  }}
                  className="px-2.5 py-1 rounded-full bg-[#1f1a16] border border-[#3a2c22] hover:border-[#ff5a3c] hover:text-[#fdf6ec] transition"
                >
                  @{demoUser}
                </button>
              ))}
            </div>

            {/* Güvence Etiketleri */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 pt-4 text-xs text-[#8a7864]">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#ff5a3c]" />
                Otomatik Profil & URL Ayıklama
              </span>
              <span className="flex items-center gap-1.5">
                <Cpu className="w-4 h-4 text-[#8a7864]" />
                GitHub Public REST API Senkronizasyonu
              </span>
            </div>
          </div>

          <div className="shrink-0">
            <Kodi pose="jump" size={170} />
          </div>
        </div>
      </div>
    </section>
  );
}
