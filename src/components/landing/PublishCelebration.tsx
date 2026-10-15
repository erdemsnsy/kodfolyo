'use client';

import { ArrowRight, Pencil } from 'lucide-react';
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
    <div style={{ position: 'fixed', inset: 0, zIndex: 200, background: '#F9FAFB', overflowY: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px clamp(16px, 5vw, 40px) 24px' }}>
      <ConfettiBurst />
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        backgroundImage: 'linear-gradient(rgba(228,228,231,.045) 1px,transparent 1px),linear-gradient(90deg,rgba(228,228,231,.045) 1px,transparent 1px)',
        backgroundSize: '60px 60px',
        maskImage: 'radial-gradient(ellipse 90% 60% at 50% 0%, #000 20%, transparent 78%)',
      }} />

      <div style={{ position: 'relative', width: '100%', maxWidth: 480, textAlign: 'center' }}>
        <h1 style={{ margin: '0 0 10px', fontSize: 'clamp(26px, 5vw, 34px)', fontWeight: 900, letterSpacing: '-.04em', color: '#18181B' }}>
          Portfolyon yayında!
        </h1>
        <p style={{ margin: '0 0 16px', fontSize: 14.5, lineHeight: 1.55, color: '#52525B' }}>
          @{username} artık kendi adresinde canlı. Aşağıdan paylaş veya düzenlemeye devam et.
        </p>

        <div style={{ textAlign: 'left', padding: 16, borderRadius: 18, background: '#FFFFFF', border: '1px solid rgba(228,228,231,.1)', boxShadow: '0 30px 70px rgba(228,228,231,.1)', marginBottom: 14 }}>
          <ShareCore username={username} />
        </div>

        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <button
            onClick={onEdit}
            style={{ flex: 1, minWidth: 130, whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontFamily: 'var(--font-sans)', fontSize: 14.5, fontWeight: 600, color: '#3F3F46', background: 'transparent', border: '1px solid rgba(228,228,231,.16)', borderRadius: 13, padding: '13px 18px', cursor: 'pointer', minHeight: 44 }}
          >
            <Pencil className="w-4 h-4" /> Düzenle
          </button>
          <button
            onClick={onGoToPortfolio}
            style={{ flex: 1, minWidth: 130, whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontFamily: 'var(--font-sans)', fontSize: 14.5, fontWeight: 700, color: '#F9FAFB', background: '#18181B', border: 0, borderRadius: 13, padding: '13px 18px', cursor: 'pointer', minHeight: 44, boxShadow: '0 10px 28px rgba(24,24,27,.32)' }}
          >
            Portfolyoma git <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
