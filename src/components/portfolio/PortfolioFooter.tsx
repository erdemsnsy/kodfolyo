'use client';

import Link from 'next/link';
import { ThemeType } from '@/types';
import { getTheme } from '@/lib/theme';
import { Code2 } from 'lucide-react';

interface PortfolioFooterProps {
  themeType?: ThemeType;
  username: string;
  customAccent?: string | null;
}

export default function PortfolioFooter({ themeType, username, customAccent }: PortfolioFooterProps) {
  const theme = getTheme(themeType, customAccent);

  return (
    <footer
      className={`mt-12 border-t ${theme.border} py-8 px-4 text-xs ${theme.textMuted}`}
      style={{ borderColor: theme.borderHex, color: theme.textMutedHex }}
    >
      <div className="mx-auto max-w-4xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className={`flex h-5 w-5 items-center justify-center rounded ${theme.isLight ? 'bg-slate-900 text-white' : 'bg-white text-slate-950'} font-bold`}>
            <Code2 className="h-3 w-3" />
          </div>
          <span className={`font-semibold ${theme.textPrimary}`}>Kodfolyo</span>
          <span>•</span>
          <span>@{username}</span>
        </div>

        <p className="text-[11px] opacity-70">
          Powered by GitHub REST API & Supabase
        </p>

        <Link
          href="/"
          className={`px-3 py-1.5 rounded-md text-xs font-semibold ${theme.buttonPrimary} transition`}
          style={theme.buttonPrimaryStyle}
        >
          Kendi Siteni Oluştur
        </Link>
      </div>
    </footer>
  );
}
