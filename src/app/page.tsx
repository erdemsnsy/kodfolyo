import Navbar from '@/components/navbar/Navbar';
import LandingHero from '@/components/landing/LandingHero';
import LandingFeatures from '@/components/landing/LandingFeatures';
import LandingPreview from '@/components/landing/LandingPreview';
import LandingFAQ from '@/components/landing/LandingFAQ';
import Link from 'next/link';
import { KodfolyoLogo } from '@/components/icons/KodfolyoLogo';

export default function LandingPage() {
  return (
    <div style={{ fontFamily: 'var(--font-sans)', background: '#F9FAFB', color: '#18181B', minHeight: '100vh', overflowX: 'hidden' }}>
      <Navbar />

      <main>
        <LandingHero />
        <LandingPreview />
        <LandingFeatures />
        <LandingFAQ />

        {/* Kapanış CTA */}
        <div style={{ padding: '0 clamp(16px, 5vw, 40px) 80px' }}>
          <div style={{ position: 'relative', maxWidth: 1180, margin: '0 auto', borderRadius: 24, overflow: 'hidden', background: '#18181B', padding: '48px clamp(20px, 5vw, 48px)' }}>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 36, flexWrap: 'wrap' }}>
              <div>
                <h2 style={{ margin: 0, fontSize: 38, fontWeight: 900, letterSpacing: '-.04em', color: '#FFFFFF', maxWidth: 620 }}>
                  Bir sonraki başvurunda link atacağın bir yerin olsun.
                </h2>
                <p style={{ margin: '14px 0 0', fontSize: 16, color: 'rgba(255,255,255,.88)', maxWidth: 520 }}>
                  Ücretsiz. GitHub kullanıcı adını gir, saniyeler içinde yayında olsun.
                </p>
              </div>
              <a
                href="#hero"
                style={{ fontFamily: 'var(--font-sans)', fontSize: 16, fontWeight: 700, color: '#18181B', background: '#FFFFFF', border: 0, borderRadius: 14, padding: '17px 30px', textDecoration: 'none', whiteSpace: 'nowrap' }}
              >
                Hemen oluştur →
              </a>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid rgba(228,228,231,.08)', padding: '34px clamp(16px, 5vw, 40px) 60px' }}>
        <div style={{ maxWidth: 1180, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 20, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <KodfolyoLogo size={22} />
            <span style={{ fontSize: 14, color: '#71717A' }}>© {new Date().getFullYear()} Kodfolyo</span>
          </div>
          <div style={{ display: 'flex', gap: 22, fontSize: 14, flexWrap: 'wrap' }}>
            <a href="#ozellikler" style={{ color: '#71717A' }}>Özellikler</a>
            <a href="#onizleme" style={{ color: '#71717A' }}>Örnekler</a>
            <a href="#sss" style={{ color: '#71717A' }}>SSS</a>
            <Link href="/kesfet" style={{ color: '#71717A' }}>Keşfet</Link>
            <Link href="/temalar" style={{ color: '#71717A' }}>Temalar</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
