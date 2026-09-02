'use client';

import { useState } from 'react';
import { QrCode, Copy, Check, X, Share2 } from 'lucide-react';
import { generateQRCodeSVG } from '@/lib/qr';
import { ThemeType } from '@/types';
import { getTheme } from '@/lib/theme';

interface ShareModalProps {
  username: string;
  themeType?: ThemeType;
  onClose: () => void;
}

export default function ShareModal({ username, themeType, onClose }: ShareModalProps) {
  const [copied, setCopied] = useState(false);
  const theme = getTheme(themeType);

  const portfolioUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/${username}`
    : `https://kodfolyo.dev/${username}`;

  const qrSvg = generateQRCodeSVG(portfolioUrl, 160, '#191720', '#ffffff');

  const handleCopy = () => {
    navigator.clipboard.writeText(portfolioUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    });
  };

  const shareText = encodeURIComponent(`@${username} Kodfolyo Yazılımcı Portfolyosu ve Projeleri`);
  const encodedUrl = encodeURIComponent(portfolioUrl);

  const twitterUrl = `https://twitter.com/intent/tweet?text=${shareText}&url=${encodedUrl}`;
  const whatsappUrl = `https://api.whatsapp.com/send?text=${shareText}%20${encodedUrl}`;
  const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;

  const socialBtn: React.CSSProperties = {
    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '10px', borderRadius: 11,
    border: `1px solid ${theme.border}`, background: 'rgba(25,23,32,.04)', color: theme.dim, fontWeight: 600,
    fontSize: 13, textDecoration: 'none',
  };

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 120, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, background: 'rgba(25,23,32,.55)', backdropFilter: 'blur(6px)' }}>
      <div style={{ width: '100%', maxWidth: 420, padding: 24, borderRadius: 22, background: '#F4F1EA', border: '1px solid rgba(25,23,32,.12)', boxShadow: '0 40px 90px rgba(25,23,32,.35)', display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ padding: 8, borderRadius: 12, background: 'rgba(25,23,32,.06)', border: `1px solid ${theme.border}`, color: theme.ink }}>
              <Share2 className="w-4 h-4" />
            </div>
            <div>
              <div style={{ fontSize: 16, fontWeight: 800, color: theme.ink }}>Portfolyonu Paylaş</div>
              <div style={{ fontSize: 12.5, color: theme.muted }}>@{username} adresine özel QR kod ve bağlantı</div>
            </div>
          </div>
          <button onClick={onClose} style={{ width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 9, border: `1px solid ${theme.border}`, background: '#FFFFFF', color: theme.muted, cursor: 'pointer' }}>
            <X className="w-4 h-4" />
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, padding: 20, borderRadius: 16, border: `1px solid ${theme.border}`, background: '#FFFFFF' }}>
          <div dangerouslySetInnerHTML={{ __html: qrSvg }} style={{ borderRadius: 12, overflow: 'hidden' }} />
          <p style={{ display: 'flex', alignItems: 'center', gap: 6, fontFamily: 'var(--font-mono)', fontSize: 11, color: theme.mutedLight, margin: 0 }}>
            <QrCode className="w-3.5 h-3.5" /> Kamera veya QR okuyucu ile tara
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <label style={{ fontSize: 12, fontWeight: 600, color: theme.dim }}>Portfolyo Bağlantın</label>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: 6, borderRadius: 12, border: `1px solid ${theme.border}`, background: '#FFFFFF' }}>
            <input readOnly value={portfolioUrl} style={{ flex: 1, minWidth: 0, background: 'transparent', border: 0, outline: 'none', fontFamily: 'var(--font-mono)', fontSize: 12.5, color: theme.ink, padding: '0 8px' }} />
            <button
              onClick={handleCopy}
              style={{ flexShrink: 0, display: 'inline-flex', alignItems: 'center', gap: 6, padding: '9px 14px', borderRadius: 9, background: '#191720', color: '#F4F1EA', fontSize: 12.5, fontWeight: 700, border: 0, cursor: 'pointer' }}
            >
              {copied ? (<><Check className="w-3.5 h-3.5" /> Kopyalandı</>) : (<><Copy className="w-3.5 h-3.5" /> Kopyala</>)}
            </button>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
          <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" style={socialBtn}>WhatsApp</a>
          <a href={twitterUrl} target="_blank" rel="noopener noreferrer" style={socialBtn}>X</a>
          <a href={linkedinUrl} target="_blank" rel="noopener noreferrer" style={socialBtn}>LinkedIn</a>
        </div>
      </div>
    </div>
  );
}
