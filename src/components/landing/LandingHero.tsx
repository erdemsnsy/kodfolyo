'use client';

import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, ShieldCheck, Cpu, RefreshCw, Code2, AlertCircle } from 'lucide-react';
import { GithubIcon } from '@/components/icons/GithubIcon';
import { sanitizeUsername } from '@/lib/github/fetcher';
import Kodi from '@/components/mascot/Kodi';

const STAR_LAYER_FAR = [
  { x: 8, y: 18, r: 2 }, { x: 22, y: 62, r: 1.5 }, { x: 40, y: 14, r: 2 },
  { x: 63, y: 78, r: 1.5 }, { x: 78, y: 30, r: 2 }, { x: 91, y: 55, r: 1.5 },
  { x: 15, y: 85, r: 1.5 }, { x: 55, y: 45, r: 2 },
];

const PARTICLE_LAYER_NEAR = [
  { x: 12, y: 40, r: 4, color: '#1fd88f' }, { x: 30, y: 75, r: 3, color: '#f0b429' },
  { x: 70, y: 20, r: 3.5, color: '#ff5c8a' }, { x: 85, y: 65, r: 3, color: '#1fd88f' },
  { x: 50, y: 88, r: 3, color: '#f0b429' },
];

export default function LandingHero() {
  const router = useRouter();
  const [usernameInput, setUsernameInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ['start start', 'end end'] });

  // Evre 1 (0 - 0.35): uçuş rotası çizilir, Kodi rotayı takip ederek yaklaşır
  // Evre 2 (0.35 - 0.75): uçak penceresi büyür, Kodi yerine süzülür
  // Evre 3 (0.75 - 1): sahne yerine oturur, ipuçları tamamen kaybolur
  const routeDraw = useTransform(scrollYProgress, [0, 0.35], [0, 1]);
  const routeOpacity = useTransform(scrollYProgress, [0, 0.32, 0.42], [1, 1, 0]);

  const farLayerY = useTransform(scrollYProgress, [0, 1], [0, -60]);
  const nearLayerY = useTransform(scrollYProgress, [0, 1], [0, -160]);
  const nearLayerOpacity = useTransform(scrollYProgress, [0, 0.5, 0.85], [0.9, 0.6, 0]);

  const clipPath = useTransform(
    scrollYProgress,
    [0, 1],
    ['circle(16vmax at 50% 45%)', 'circle(75vmax at 50% 45%)']
  );
  const frameOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);
  const hintOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);

  // Kodi: sağ üstten rotayı takip ederek gelir, döner, yerine yerleşip ufak bir sekmeyle oturur
  const kodiX = useTransform(scrollYProgress, [0, 0.35, 0.75, 1], [340, 90, 0, 0]);
  const kodiY = useTransform(scrollYProgress, [0, 0.2, 0.35, 0.75, 0.85, 1], [-280, -320, -230, -20, 6, 0]);
  const kodiRotate = useTransform(scrollYProgress, [0, 0.35, 0.75, 1], [-34, -18, 6, 0]);
  const kodiScale = useTransform(scrollYProgress, [0, 0.35, 0.75, 1], [0.5, 0.72, 1.06, 1]);
  const kodiOpacity = useTransform(scrollYProgress, [0, 0.04, 1], [0, 1, 1]);

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
    <div ref={containerRef} className="relative" style={{ height: '280vh' }}>
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-[#0d1310] flex items-center">
        {/* Katman 1: uzak yıldızlar — en yavaş kayan paralaks katman */}
        <motion.svg
          style={{ y: farLayerY }}
          className="pointer-events-none absolute inset-0 w-full h-full"
          preserveAspectRatio="xMidYMid slice"
          viewBox="0 0 100 100"
        >
          {STAR_LAYER_FAR.map((s, i) => (
            <circle key={i} cx={s.x} cy={s.y} r={s.r / 10} fill="#c9d1cb" opacity={0.35} />
          ))}
        </motion.svg>

        {/* Katman 2: renkli parçacıklar — daha hızlı kayan orta katman, ilerleyince solar */}
        <motion.svg
          style={{ y: nearLayerY, opacity: nearLayerOpacity }}
          className="pointer-events-none absolute inset-0 w-full h-full"
          preserveAspectRatio="xMidYMid slice"
          viewBox="0 0 100 100"
        >
          {PARTICLE_LAYER_NEAR.map((p, i) => (
            <circle key={i} cx={p.x} cy={p.y} r={p.r / 10} fill={p.color} opacity={0.5} />
          ))}
        </motion.svg>

        {/* Uçuş rotası — scroll'la birlikte çizilir, pencere açılınca solar */}
        <motion.svg
          style={{ opacity: routeOpacity }}
          className="pointer-events-none absolute inset-0 w-full h-full"
          viewBox="0 0 1280 900"
          preserveAspectRatio="xMidYMid slice"
        >
          <motion.path
            d="M 1220 700 C 1120 520, 1080 380, 1000 260 C 960 200, 920 160, 860 130"
            fill="none"
            stroke="#93a297"
            strokeWidth="2.5"
            strokeDasharray="3 16"
            strokeLinecap="round"
            style={{ pathLength: routeDraw }}
          />
        </motion.svg>

        {/* Uçak penceresi çerçevesi — scroll başlar başlamaz erkenden solar */}
        <motion.div
          style={{ opacity: frameOpacity }}
          className="pointer-events-none absolute inset-0 flex items-center justify-center"
        >
          <div
            className="rounded-[50%] border-[6px] border-[#384139]"
            style={{ width: '30vh', height: '24vh', boxShadow: '0 0 0 10px #17201b, 0 0 60px rgba(0,0,0,0.6)' }}
          />
        </motion.div>

        {/* Gerçek hero içeriği — pencere büyüdükçe ortaya çıkar */}
        <motion.div style={{ clipPath }} className="absolute inset-0 flex items-center overflow-hidden">
          <section className="relative w-full overflow-hidden pt-14 pb-14 sm:pt-20 sm:pb-24">
            <div className="mx-auto max-w-5xl px-4 sm:px-6">
              <div className="flex flex-col lg:flex-row items-center gap-10">
                <div className="flex-1 text-center lg:text-left space-y-6">
                  {/* Kurumsal Rozet */}
                  <div className="inline-flex items-center gap-2 rounded-full border border-[#384139] bg-[#17201b] px-4 py-1.5 text-xs font-semibold text-[#c9d1cb] shadow-[3px_3px_0_0_#0d1310]">
                    <Code2 className="h-3.5 w-3.5 text-[#1fd88f]" />
                    <span>Geliştiriciler İçin Kurumsal & Sade Portfolyo Üreteci</span>
                  </div>

                  {/* Ana Başlık */}
                  <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#f2f7f0] leading-tight">
                    GitHub Kullanıcı Adını Gir, <br className="hidden sm:inline" />
                    <span className="text-[#f0b429]">Profesyonel Portfolyonu</span> Anında Çek
                  </h1>

                  {/* Gövde Metni */}
                  <p className="mx-auto lg:mx-0 max-w-2xl text-sm sm:text-base text-[#c9d1cb] leading-relaxed">
                    Karmaşık şablonları unut. GitHub kullanıcı adını veya profil URL adresini gir; profilin, projelerin ve dillerin <code className="text-[#f2f7f0] bg-[#17201b] px-2 py-0.5 rounded border border-[#384139]">/kullaniciadi</code> adresinde kurumsal bir sade kimlikle yayınlansın.
                  </p>

                  {/* Hızlı Kullanıcı Adı Girme Formu */}
                  <form onSubmit={handleGeneratePortfolio} className="mx-auto lg:mx-0 max-w-lg pt-2 space-y-3">
                    <div className="flex flex-col sm:flex-row gap-2.5 p-2 rounded-full border border-[#384139] bg-[#17201b] shadow-[4px_4px_0_0_#0d1310]">
                      <div className="flex items-center gap-2 pl-4 pr-3 flex-1 text-sm text-[#f2f7f0]">
                        <span className="text-[#93a297] font-bold">@</span>
                        <input
                          type="text"
                          value={usernameInput}
                          onChange={(e) => {
                            setUsernameInput(e.target.value);
                            if (errorMsg) setErrorMsg(null);
                          }}
                          placeholder="github_kullanici_adi veya URL"
                          className="w-full bg-transparent border-none outline-none placeholder-[#93a297] text-xs sm:text-sm"
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={isLoading || !usernameInput.trim()}
                        className="flex items-center justify-center gap-2 rounded-full bg-[#1fd88f] hover:bg-[#4eeaa8] px-6 py-3 text-xs font-bold text-[#0d1310] shadow-[3px_3px_0_0_#f0b429] transition active:scale-95 disabled:opacity-50 shrink-0"
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
                  <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 text-xs text-[#c9d1cb] pt-1">
                    <span>Örnek canlı profiller:</span>
                    {['mvanhorn', 'torvalds', 'gaearon', 'sindresorhus'].map((demoUser) => (
                      <button
                        key={demoUser}
                        onClick={() => {
                          setUsernameInput(demoUser);
                          router.push(`/${demoUser}`);
                        }}
                        className="px-2.5 py-1 rounded-full bg-[#17201b] border border-[#384139] hover:border-[#1fd88f] hover:text-[#f2f7f0] transition"
                      >
                        @{demoUser}
                      </button>
                    ))}
                  </div>

                  {/* Güvence Etiketleri */}
                  <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 pt-4 text-xs text-[#93a297]">
                    <span className="flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-[#1fd88f]" />
                      Otomatik Profil & URL Ayıklama
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Cpu className="w-4 h-4 text-[#93a297]" />
                      GitHub Public REST API Senkronizasyonu
                    </span>
                  </div>
                </div>

                {/* Kodi burada uçmuyor — asıl uçuşu yapan, aşağıdaki bağımsız katmandaki kopyası.
                    Bu boş alan sadece metin sütununun genişliğini masaüstünde sabit tutar. */}
                <div className="hidden lg:block shrink-0" style={{ width: 170, height: 207 }} />
              </div>
            </div>
          </section>
        </motion.div>

        {/* Kodi'nin uçuş katmanı — pencerenin dışında, tüm sahnenin üstünde, serbestçe hareket eder */}
        <div className="pointer-events-none absolute inset-0 hidden lg:block">
          <div className="relative mx-auto max-w-5xl h-full px-4 sm:px-6">
            <motion.div
              className="absolute right-4 sm:right-6"
              style={{ top: '30%', x: kodiX, y: kodiY, rotate: kodiRotate, scale: kodiScale, opacity: kodiOpacity }}
            >
              <Kodi pose="jump" size={170} />
            </motion.div>
          </div>
        </div>

        {/* Mobilde uçuş yok — Kodi sade halde, sahnenin bir parçası olarak görünür */}
        <div className="pointer-events-none absolute bottom-10 right-4 lg:hidden">
          <Kodi pose="idle" size={90} />
        </div>

        {/* Kaydırma ipucu — erkenden solar */}
        <motion.p
          style={{ opacity: hintOpacity }}
          className="pointer-events-none absolute bottom-8 inset-x-0 text-center text-xs text-[#93a297]"
        >
          Kaydır ve keşfet ↓
        </motion.p>
      </div>
    </div>
  );
}
