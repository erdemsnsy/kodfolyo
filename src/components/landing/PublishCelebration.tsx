'use client';

import { ArrowRight, Pencil } from 'lucide-react';
import Kodi from '@/components/mascot/Kodi';
import ShareCore from '@/components/portfolio/ShareCore';
import ConfettiBurst from './ConfettiBurst';

interface PublishCelebrationProps {
  username: string;
  onGoToPortfolio: () => void;
  onEdit: () => void;
}

// Yayına alma sonrası kutlama ekranı. QR/URL/sosyal paylaşım mantığı
// ShareCore'dan geliyor — ShareModal ile aynı kod, tekrar yazılmadı.
export default function PublishCelebration({ username, onGoToPortfolio, onEdit }: PublishCelebrationProps) {
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 200, background: '#F9FAFB', overflowY: 'auto', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '40px clamp(16px, 5vw, 40px) 60px' }}>
      <ConfettiBurst />
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        backgroundImage: 'linear-gradient(rgba(228,228,231,.045) 1px,transparent 1px),linear-gradient(90deg,rgba(228,228,231,.045) 1px,transparent 1px)',
        backgroundSize: '60px 60px',
        maskImage: 'radial-gradient(ellipse 90% 60% at 50% 0%, #000 20%, transparent 78%)',
      }} />

      <div style={{ position: 'relative', width: '100%', maxWidth: 480, textAlign: 'center' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 6 }}>
          <Kodi size={140} grayscale />
        </div>

        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, fontFamily: 'var(--font-mono)', fontSize: 12, padding: '6px 12px', borderRadius: 999, background: 'rgba(0,166,118,.12)', border: '1px solid rgba(0,166,118,.3)', color: '#00845E', marginBottom: 14 }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#00845E' }} />
          Yayında
        </div>

        <h1 style={{ margin: '0 0 10px', fontSize: 'clamp(26px, 5vw, 34px)', fontWeight: 900, letterSpacing: '-.04em', color: '#18181B' }}>
          Portfolyon yayında!
        </h1>
        <p style={{ margin: '0 0 26px', fontSize: 15, lineHeight: 1.55, color: '#52525B' }}>
          @{username} artık kendi adresinde canlı. Aşağıdan paylaş veya düzenlemeye devam et.
        </p>

        <div style={{ textAlign: 'left', padding: 22, borderRadius: 18, background: '#FFFFFF', border: '1px solid rgba(228,228,231,.1)', boxShadow: '0 30px 70px rgba(228,228,231,.1)', marginBottom: 20 }}>
          <ShareCore username={username} />
        </div>

        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <button
            onClick={onEdit}
            style={{ flex: 1, minWidth: 160, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontFamily: 'var(--font-sans)', fontSize: 14.5, fontWeight: 600, color: '#3F3F46', background: 'transparent', border: '1px solid rgba(228,228,231,.16)', borderRadius: 13, padding: '13px 18px', cursor: 'pointer', minHeight: 44 }}
          >
            <Pencil className="w-4 h-4" /> Düzenle
          </button>
          <button
            onClick={onGoToPortfolio}
            style={{ flex: 1, minWidth: 160, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontFamily: 'var(--font-sans)', fontSize: 14.5, fontWeight: 700, color: '#F9FAFB', background: '#18181B', border: 0, borderRadius: 13, padding: '13px 18px', cursor: 'pointer', minHeight: 44, boxShadow: '0 10px 28px rgba(24,24,27,.32)' }}
          >
            Portfolyoma git <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
