import Link from 'next/link';
import Navbar from '@/components/navbar/Navbar';
import Kodi from '@/components/mascot/Kodi';
import { ArrowLeft } from 'lucide-react';

export default function PortfolioNotFound() {
  return (
    <div style={{ minHeight: '100vh', background: '#F4F1EA', color: '#191720', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 40 }}>
        <div style={{ textAlign: 'center', maxWidth: 460 }}>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Kodi size={140} grayscale />
          </div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: '#C6314E', marginTop: 8 }}>404 — KULLANICI BULUNAMADI</div>
          <h1 style={{ margin: '10px 0 12px', fontSize: 32, fontWeight: 800, letterSpacing: '-.035em' }}>Kodi bu profili bulamadı</h1>
          <p style={{ margin: '0 0 22px', fontSize: 15, lineHeight: 1.55, color: '#6B6675' }}>
            Bu kullanıcı adıyla GitHub üzerinde kayıtlı bir profil bulunamadı.
          </p>
          <Link
            href="/"
            style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontFamily: 'var(--font-sans)', fontSize: 14, fontWeight: 700, color: '#F4F1EA', background: '#1F3AE8', border: 0, borderRadius: 11, padding: '12px 20px', textDecoration: 'none' }}
          >
            <ArrowLeft className="w-4 h-4" />
            Ana sayfaya dön
          </Link>
        </div>
      </main>
    </div>
  );
}
