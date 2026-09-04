'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, RefreshCw, AlertCircle } from 'lucide-react';
import Kodi from '@/components/mascot/Kodi';
import PublishCelebration from './PublishCelebration';
import FetchingOverlay from './FetchingOverlay';

const DEMOS = ['torvalds', 'sindresorhus', 'gaearon'];
// FetchingOverlay'in 4 adımını (STEP_DURATION_MS=700 * 4) en az bir kez göster —
// gerçek fetch bunun altında bitse bile ekran "adım adım" hissi vermeden akıp gitmesin.
const MIN_LOADING_DURATION_MS = 2800;

export default function LandingHero() {
  const router = useRouter();
  const [usernameInput, setUsernameInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [publishedUsername, setPublishedUsername] = useState<string | null>(null);

  const handleGeneratePortfolio = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanUser = usernameInput.trim().toLowerCase();
    if (!cleanUser) return;

    setIsLoading(true);
    setErrorMsg(null);
    const startedAt = Date.now();

    // Gerçek istek ne kadar sürerse sürsün en az MIN_LOADING_DURATION_MS bekle —
    // adım adım yükleme ekranı yarıda kesilip "aşırı kısa" akıp gitmesin.
    const waitForMinDuration = async () => {
      const elapsed = Date.now() - startedAt;
      if (elapsed < MIN_LOADING_DURATION_MS) {
        await new Promise((resolve) => setTimeout(resolve, MIN_LOADING_DURATION_MS - elapsed));
      }
    };

    try {
      const res = await fetch('/api/github/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: cleanUser }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        await waitForMinDuration();
        setErrorMsg(`"${cleanUser}" adında geçerli bir GitHub kullanıcısı bulunamadı.`);
        setIsLoading(false);
        return;
      }

      if (typeof window !== 'undefined') {
        localStorage.setItem('kodfolyo_active_username', cleanUser);
      }
      await waitForMinDuration();
      setPublishedUsername(cleanUser);
    } catch (err) {
      console.error(err);
      await waitForMinDuration();
      router.push(`/${cleanUser}`);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <FetchingOverlay />;
  }

  if (publishedUsername) {
    return (
      <PublishCelebration
        username={publishedUsername}
        onGoToPortfolio={() => router.push(`/${publishedUsername}`)}
        onEdit={() => router.push(`/dashboard?username=${encodeURIComponent(publishedUsername)}`)}
      />
    );
  }

  return (
    <div id="hero" style={{ position: 'relative', padding: '78px clamp(16px, 5vw, 40px) 30px', overflow: 'hidden' }}>
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: 'linear-gradient(rgba(228,228,231,.045) 1px,transparent 1px),linear-gradient(90deg,rgba(228,228,231,.045) 1px,transparent 1px)',
        backgroundSize: '60px 60px',
        maskImage: 'radial-gradient(ellipse 90% 70% at 50% 0%, #000 20%, transparent 78%)',
      }} />
      <div style={{ position: 'absolute', top: -180, left: '12%', width: 520, height: 520, borderRadius: '50%', background: 'radial-gradient(circle, rgba(24,24,27,.22), transparent 68%)', filter: 'blur(30px)' }} />
      <div style={{ position: 'absolute', top: -120, right: '8%', width: 460, height: 460, borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,166,118,.24), transparent 68%)', filter: 'blur(30px)' }} />

      <div style={{ position: 'relative', maxWidth: 1180, margin: '0 auto', display: 'grid', gridTemplateColumns: '1.15fr .85fr', gap: 48, alignItems: 'center' }} className="hero-grid">
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontFamily: 'var(--font-mono)', fontSize: 12, padding: '6px 12px', borderRadius: 999, background: 'rgba(228,228,231,.05)', border: '1px solid rgba(228,228,231,.12)', color: '#3F3F46', marginBottom: 22 }}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#18181B', boxShadow: '0 0 10px #18181B' }} />
            GitHub profilinden saniyeler içinde portfolyo
          </div>

          <h1 style={{ margin: 0, fontSize: 'clamp(32px, 7vw, 56px)', lineHeight: 1.02, fontWeight: 900, letterSpacing: '-.045em', color: '#18181B' }}>
            Commit&apos;lerin<br />zaten portfolyon.<br />
            <span style={{ color: '#71717A' }}>
              Biz sadece yayına alıyoruz.
            </span>
          </h1>

          {/* Mobilde: küçük maskot başlığın hemen altında (masaüstünde gizli) */}
          <div className="mascot-mobile-only" style={{ display: 'none', justifyContent: 'center', margin: '18px 0' }}>
            <Kodi size={150} grayscale />
          </div>

          <p style={{ margin: '22px 0 30px', fontSize: 17, lineHeight: 1.55, color: '#52525B', maxWidth: 520 }}>
            GitHub kullanıcı adını yaz; profilin, biyografin, en çok yıldız alan projelerin ve dil dağılımın canlı bir portfolyo sayfasına dönüşsün. Kod yazmadan, tasarım yapmadan.
          </p>

          <form onSubmit={handleGeneratePortfolio} style={{ display: 'flex', gap: 10, maxWidth: 560, flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: 220, display: 'flex', alignItems: 'center', gap: 2, background: '#FFFFFF', border: '1px solid rgba(228,228,231,.14)', borderRadius: 13, padding: '5px 5px 5px 16px' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 15, color: '#A1A1AA' }}>github.com/</span>
              <input
                value={usernameInput}
                onChange={(e) => { setUsernameInput(e.target.value); if (errorMsg) setErrorMsg(null); }}
                placeholder="kullaniciadi"
                className="focus:ring-1 focus:ring-zinc-900 rounded-md"
                style={{ flex: 1, minWidth: 0, background: 'transparent', border: 0, outline: 'none', color: '#18181B', fontFamily: 'var(--font-mono)', fontSize: 15, padding: '11px 4px' }}
              />
            </div>
            <button
              type="submit"
              disabled={isLoading || !usernameInput.trim()}
              style={{
                display: 'flex', alignItems: 'center', gap: 9, fontFamily: 'var(--font-sans)', fontSize: 15, fontWeight: 700,
                color: '#F9FAFB', background: '#18181B', border: 0, borderRadius: 13, padding: '0 24px', cursor: 'pointer',
                boxShadow: '0 10px 28px rgba(24,24,27,.32)', opacity: isLoading || !usernameInput.trim() ? 0.6 : 1,
              }}
            >
              {isLoading ? (
                <><RefreshCw className="w-4 h-4 animate-spin" /> Çekiliyor...</>
              ) : (
                <>Portfolyomu Çek <ArrowRight className="w-4 h-4" /></>
              )}
            </button>
          </form>

          {errorMsg && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 12, fontSize: 13, color: '#C6314E', fontWeight: 500 }}>
              <AlertCircle className="w-4 h-4" /> {errorMsg}
            </div>
          )}

          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 20, flexWrap: 'wrap' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: '#A1A1AA' }}>ÖRNEKLER</span>
            {DEMOS.map((name) => (
              <button
                key={name}
                onClick={() => router.push(`/${name}`)}
                style={{ fontFamily: 'var(--font-mono)', fontSize: 12.5, color: '#3F3F46', background: 'rgba(228,228,231,.05)', border: '1px solid rgba(228,228,231,.1)', borderRadius: 999, padding: '6px 13px', cursor: 'pointer' }}
              >
                /{name}
              </button>
            ))}
          </div>
        </div>

        {/* Maskot — masaüstü versiyonu */}
        <div className="mascot-desktop-only" style={{ position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center', height: 420 }}>
          <div style={{ position: 'absolute', width: 340, height: 340, borderRadius: '50%', background: 'radial-gradient(circle, rgba(24,24,27,.18), transparent 70%)' }} />
          <div style={{ position: 'absolute', width: 380, height: 380, border: '1px dashed rgba(228,228,231,.12)', borderRadius: '50%' }} />
          <Kodi size={280} grayscale />
        </div>
      </div>

      <style>{`
        @media (max-width: 860px) {
          .hero-grid { grid-template-columns: 1fr !important; }
          .mascot-desktop-only { display: none !important; }
          .mascot-mobile-only { display: flex !important; }
        }
      `}</style>
    </div>
  );
}
