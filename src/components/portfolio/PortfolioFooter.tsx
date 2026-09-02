'use client';

import { ThemeType } from '@/types';
import { getTheme } from '@/lib/theme';
import { KodfolyoLogo } from '@/components/icons/KodfolyoLogo';

interface PortfolioFooterProps {
  themeType?: ThemeType;
  username: string;
}

export default function PortfolioFooter({ themeType, username }: PortfolioFooterProps) {
  const theme = getTheme(themeType);

  return (
    <footer className="no-print" style={{ borderTop: `1px solid ${theme.border}`, padding: '26px clamp(16px, 5vw, 40px) 60px' }}>
      <div style={{ maxWidth: 1020, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
        <span style={{ fontSize: 13.5, color: theme.mutedLight }}>@{username} · Kodfolyo ile oluşturuldu</span>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 13.5, color: theme.muted }}>
          <KodfolyoLogo size={18} />
          <span>Kendi portfolyonu oluştur</span>
        </span>
      </div>
    </footer>
  );
}
