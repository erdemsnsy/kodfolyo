'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, RefreshCw, AlertCircle } from 'lucide-react';
import Kodi from '@/components/mascot/Kodi';

const DEMOS = ['torvalds', 'sindresorhus', 'gaearon'];

export default function LandingHero() {
  const router = useRouter();
  const [usernameInput, setUsernameInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleGeneratePortfolio = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanUser = usernameInput.trim().toLowerCase();
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
      router.push(`/${cleanUser}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ position: 'relative', padding: '78px clamp(16px, 5vw, 40px) 30px', overflow: 'hidden' }}>
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: 'linear-gradient(rgba(25,23,32,.045) 1px,transparent 1px),linear-gradient(90deg,rgba(25,23,32,.045) 1px,transparent 1px)',
        backgroundSize: '60px 60px',
        maskImage: 'radial-gradient(ellipse 90% 70% at 50% 0%, #000 20%, transparent 78%)',
      }} />
      <div style={{ position: 'absolute', top: -180, left: '12%', width: 520, height: 520, borderRadius: '50%', background: 'radial-gradient(circle, rgba(31,58,232,.22), transparent 68%)', filter: 'blur(30px)' }} />
      <div style={{ position: 'absolute', top: -120, right: '8%', width: 460, height: 460, borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,166,118,.24), transparent 68%)', filter: 'blur(30px)' }} />

      <div style={{ position: 'relative', maxWidth: 1180, margin: '0 auto', display: 'grid', gridTemplateColumns: '1.15fr .85fr', gap: 48, alignItems: 'center' }} className="hero-grid">
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontFamily: 'var(--font-mono)', fontSize: 12, padding: '6px 12px', borderRadius: 999, background: 'rgba(25,23,32,.05)', border: '1px solid rgba(25,23,32,.12)', color: '#3A3644', marginBottom: 22 }}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#1F3AE8', boxShadow: '0 0 10px #1F3AE8' }} />
            GitHub profilinden saniyeler içinde portfolyo
          </div>

          <h1 style={{ margin: 0, fontSize: 'clamp(32px, 7vw, 56px)', lineHeight: 1.02, fontWeight: 900, letterSpacing: '-.045em', color: '#191720' }}>
            Commit&apos;lerin<br />zaten portfolyon.<br />
            <span style={{ background: 'linear-gradient(100deg,#1F3AE8,#00A676)', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}>
              Biz sadece yayına alıyoruz.
            </span>
          </h1>

          {/* Mobilde: küçük maskot başlığın hemen altında (masaüstünde gizli) */}
          <div className="mascot-mobile-only" style={{ display: 'none', justifyContent: 'center', margin: '18px 0' }}>
            <Kodi size={110} />
          </div>

          <p style={{ margin: '22px 0 30px', fontSize: 17, lineHeight: 1.55, color: '#56515F', maxWidth: 520 }}>
            GitHub kullanıcı adını yaz; profilin, biyografin, en çok yıldız alan projelerin ve dil dağılımın canlı bir portfolyo sayfasına dönüşsün. Kod yazmadan, tasarım yapmadan.
          </p>

          <form onSubmit={handleGeneratePortfolio} style={{ display: 'flex', gap: 10, maxWidth: 560, flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: 220, display: 'flex', alignItems: 'center', gap: 2, background: '#FFFFFF', border: '1px solid rgba(25,23,32,.14)', borderRadius: 13, padding: '5px 5px 5px 16px' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 15, color: '#8C8797' }}>github.com/</span>
              <input
                value={usernameInput}
                onChange={(e) => { setUsernameInput(e.target.value); if (errorMsg) setErrorMsg(null); }}
                placeholder="kullaniciadi"
                style={{ flex: 1, minWidth: 0, background: 'transparent', border: 0, outline: 'none', color: '#191720', fontFamily: 'var(--font-mono)', fontSize: 15, padding: '11px 4px' }}
              />
            </div>
            <button
              type="submit"
              disabled={isLoading || !usernameInput.trim()}
              style={{
                display: 'flex', alignItems: 'center', gap: 9, fontFamily: 'var(--font-sans)', fontSize: 15, fontWeight: 700,
                color: '#F4F1EA', background: '#1F3AE8', border: 0, borderRadius: 13, padding: '0 24px', cursor: 'pointer',
                boxShadow: '0 10px 28px rgba(31,58,232,.32)', opacity: isLoading || !usernameInput.trim() ? 0.6 : 1,
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
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: '#8C8797' }}>ÖRNEKLER</span>
            {DEMOS.map((name) => (
              <button
                key={name}
                onClick={() => router.push(`/${name}`)}
                style={{ fontFamily: 'var(--font-mono)', fontSize: 12.5, color: '#3A3644', background: 'rgba(25,23,32,.05)', border: '1px solid rgba(25,23,32,.1)', borderRadius: 999, padding: '6px 13px', cursor: 'pointer' }}
              >
                /{name}
              </button>
            ))}
          </div>
        </div>

        {/* Maskot — masaüstü versiyonu */}
        <div className="mascot-desktop-only" style={{ position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center', height: 380 }}>
          <div style={{ position: 'absolute', width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(31,58,232,.18), transparent 70%)' }} />
          <div style={{ position: 'absolute', width: 340, height: 340, border: '1px dashed rgba(25,23,32,.12)', borderRadius: '50%' }} />
          <Kodi size={220} />
          <div style={{ position: 'absolute', top: 30, right: 0, fontFamily: 'var(--font-mono)', fontSize: 12, color: '#F4F1EA', background: '#1F3AE8', padding: '6px 12px', borderRadius: 10, fontWeight: 500, transform: 'rotate(6deg)' }}>
            merhaba, ben Kodi 👋
          </div>
          <div style={{ position: 'absolute', bottom: 40, left: 0, fontFamily: 'var(--font-mono)', fontSize: 11.5, color: '#00845E', background: 'rgba(0,166,118,.12)', border: '1px solid rgba(0,166,118,.3)', padding: '6px 11px', borderRadius: 9, transform: 'rotate(-5deg)' }}>
            git fetch --portfolyo
          </div>
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
