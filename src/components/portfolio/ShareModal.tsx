'use client';

import { X, Share2 } from 'lucide-react';
import ShareCore from './ShareCore';
import { ThemeType } from '@/types';
import { getTheme } from '@/lib/theme';

interface ShareModalProps {
  username: string;
  themeType?: ThemeType;
  onClose: () => void;
}

export default function ShareModal({ username, themeType, onClose }: ShareModalProps) {
  const theme = getTheme(themeType);

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

        <ShareCore username={username} themeType={themeType} />
      </div>
    </div>
  );
}
