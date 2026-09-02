import Navbar from '@/components/navbar/Navbar';
import LandingHero from '@/components/landing/LandingHero';
import LandingFeatures from '@/components/landing/LandingFeatures';
import LandingPreview from '@/components/landing/LandingPreview';
import Link from 'next/link';
import { KodfolyoLogo } from '@/components/icons/KodfolyoLogo';

export default function LandingPage() {
  return (
    <div style={{ fontFamily: 'var(--font-sans)', background: '#F4F1EA', color: '#191720', minHeight: '100vh', overflowX: 'hidden' }}>
      <Navbar />

      <main>
        <LandingHero />
        <LandingPreview />
        <LandingFeatures />

        {/* Kapanış CTA */}
        <div style={{ padding: '0 clamp(16px, 5vw, 40px) 80px' }}>
          <div style={{ position: 'relative', maxWidth: 1180, margin: '0 auto', borderRadius: 24, overflow: 'hidden', background: 'linear-gradient(120deg,#1F3AE8,#4B7BFF 45%,#00A676)', padding: '48px clamp(20px, 5vw, 48px)' }}>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 36, flexWrap: 'wrap' }}>
              <div>
                <h2 style={{ margin: 0, fontSize: 38, fontWeight: 900, letterSpacing: '-.04em', color: '#FFFFFF', maxWidth: 620 }}>
                  Bir sonraki başvurunda link atacağın bir yerin olsun.
                </h2>
                <p style={{ margin: '14px 0 0', fontSize: 16, color: 'rgba(255,255,255,.88)', maxWidth: 520 }}>
                  Ücretsiz. GitHub kullanıcı adını gir, saniyeler içinde yayında olsun.
                </p>
              </div>
              <Link
                href="/dashboard"
                style={{ fontFamily: 'var(--font-sans)', fontSize: 16, fontWeight: 700, color: '#1F3AE8', background: '#FFFFFF', border: 0, borderRadius: 14, padding: '17px 30px', textDecoration: 'none', whiteSpace: 'nowrap' }}
              >
                Hemen oluştur →
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid rgba(25,23,32,.08)', padding: '34px clamp(16px, 5vw, 40px) 60px' }}>
        <div style={{ maxWidth: 1180, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 20, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <KodfolyoLogo size={22} />
            <span style={{ fontSize: 14, color: '#6B6675' }}>© {new Date().getFullYear()} Kodfolyo</span>
          </div>
          <div style={{ display: 'flex', gap: 22, fontSize: 14, flexWrap: 'wrap' }}>
            <a href="#ozellikler" style={{ color: '#6B6675' }}>Özellikler</a>
            <a href="#onizleme" style={{ color: '#6B6675' }}>Örnekler</a>
            <Link href="/kesfet" style={{ color: '#6B6675' }}>Keşfet</Link>
            <Link href="/temalar" style={{ color: '#6B6675' }}>Temalar</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
