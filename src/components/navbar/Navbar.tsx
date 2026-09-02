'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { LayoutDashboard, User, LogOut, Code2, ExternalLink, ArrowRight, AlertCircle, RefreshCw } from 'lucide-react';
import { GithubIcon } from '@/components/icons/GithubIcon';
import { useState, useEffect } from 'react';

import { ThemeType } from '@/types';
import { getTheme } from '@/lib/theme';
import Kodi from '@/components/mascot/Kodi';

interface NavbarProps {
  headerStyle?: React.CSSProperties;
  themeType?: ThemeType;
  currentUsername?: string;
  customAccent?: string | null;
}

export default function Navbar({ headerStyle, themeType, currentUsername, customAccent }: NavbarProps = {}) {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [showPrompt, setShowPrompt] = useState(false);
  const [usernameInput, setUsernameInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [storedUsername, setStoredUsername] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('kodfolyo_active_username');
      if (stored) setStoredUsername(stored);
    }
  }, []);

  const theme = getTheme(themeType, customAccent);
  const isAppShell = themeType === undefined;

  const handleQuickLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const u = usernameInput.trim().toLowerCase();
    if (!u) return;

    setIsLoading(true);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/github/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: u }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setErrorMsg(`"${u}" adında geçerli bir GitHub kullanıcısı bulunamadı.`);
        setIsLoading(false);
        return;
      }

      if (typeof window !== 'undefined') {
        localStorage.setItem('kodfolyo_active_username', u);
      }
      setShowPrompt(false);
      router.push(`/${u}`);
    } catch (err) {
      console.error(err);
      router.push(`/${u}`);
    } finally {
      setIsLoading(false);
    }
  };

  const activeTargetUser = currentUsername || storedUsername;
  const editDashboardUrl = activeTargetUser ? `/dashboard?username=${encodeURIComponent(activeTargetUser)}` : '/dashboard';
  const username = (session?.user as { username?: string })?.username || session?.user?.name || activeTargetUser || 'demo';

  return (
    <header
      className={`sticky top-0 z-50 w-full border-b ${isAppShell ? 'border-[#3a2c22]' : theme.navBorder} transition-all duration-300`}
      style={headerStyle || (isAppShell
        ? { backgroundColor: 'rgba(20, 17, 15, 0.9)', backdropFilter: 'blur(12px)' }
        : { backgroundColor: 'rgba(12, 13, 14, 0.9)', backdropFilter: 'blur(12px)' })}
    >
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 sm:px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 text-sm font-bold tracking-tight transition hover:opacity-80">
          {isAppShell ? (
            <div className="h-8 w-8 shrink-0">
              <Kodi pose="idle" size={32} />
            </div>
          ) : (
            <div className={`flex h-7 w-7 items-center justify-center rounded-lg ${theme.isLight ? 'bg-slate-950 text-white' : 'bg-white text-slate-950'} font-black shadow-sm`}>
              <Code2 className="h-4 w-4" />
            </div>
          )}
          <span className={isAppShell ? 'text-[#fdf6ec] font-bold' : theme.navText}>
            Kodfolyo<span className={isAppShell ? 'text-[#8a7864]' : (theme.isLight ? 'text-slate-500' : 'text-slate-400')}>.dev</span>
          </span>
        </Link>

        {/* Navigation & Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {status === 'authenticated' && session?.user ? (
            <>
              <Link
                href={`/${username}`}
                className={isAppShell
                  ? 'hidden sm:flex items-center gap-1.5 rounded-full border border-[#3a2c22] bg-[#1f1a16] px-3 py-1.5 text-xs font-medium text-[#cbb9a0] hover:text-[#fdf6ec] transition'
                  : `hidden sm:flex items-center gap-1.5 rounded-lg border ${theme.navBorder} ${theme.badge} px-3 py-1.5 text-xs font-medium ${theme.navMuted} transition`}
                style={isAppShell ? undefined : theme.badgeStyle}
              >
                <User className="h-3.5 w-3.5" />
                <span>/{username}</span>
                <ExternalLink className="h-3 w-3 opacity-60" />
              </Link>

              <Link
                href={editDashboardUrl}
                className={isAppShell
                  ? 'flex items-center gap-1.5 rounded-full bg-[#ff5a3c] px-3.5 py-1.5 text-xs font-bold text-[#14110f] shadow-[3px_3px_0_0_#14110f] transition'
                  : `flex items-center gap-1.5 rounded-lg ${theme.buttonPrimary} px-3.5 py-1.5 text-xs font-bold shadow-sm transition`}
                style={isAppShell ? undefined : theme.buttonPrimaryStyle}
              >
                <LayoutDashboard className="h-3.5 w-3.5" />
                <span>Düzenle</span>
              </Link>

              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                className={isAppShell
                  ? 'flex items-center gap-1.5 rounded-full border border-[#3a2c22] bg-[#1f1a16] px-2.5 py-1.5 text-xs text-[#8a7864] hover:text-red-400 transition'
                  : `flex items-center gap-1.5 rounded-lg border ${theme.navBorder} ${theme.badge} px-2.5 py-1.5 text-xs ${theme.textMuted} hover:text-red-500 transition`}
                style={isAppShell ? undefined : theme.badgeStyle}
                title="Çıkış Yap"
              >
                <LogOut className="h-3.5 w-3.5" />
              </button>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/ornek-ogrenci"
                className={isAppShell ? 'text-xs font-semibold text-[#cbb9a0] hover:text-[#fdf6ec] px-2 py-1 transition' : `text-xs font-semibold ${theme.navMuted} px-2 py-1 transition`}
                title="Canlı Örnek Portfolyoyu İncele"
              >
                Örnek Portfolyo
              </Link>

              {activeTargetUser && activeTargetUser !== 'ornek-ogrenci' && activeTargetUser !== 'demo' ? (
                <Link
                  href={editDashboardUrl}
                  className={isAppShell
                    ? 'flex items-center gap-1.5 rounded-full bg-[#ff5a3c] px-3 sm:px-4 py-2 text-xs font-bold text-[#14110f] shadow-[3px_3px_0_0_#14110f] transition active:scale-95'
                    : `flex items-center gap-1.5 rounded-lg ${theme.buttonPrimary} px-3 sm:px-4 py-2 text-xs font-bold shadow-sm transition active:scale-95`}
                  style={isAppShell ? undefined : theme.buttonPrimaryStyle}
                >
                  <LayoutDashboard className="h-4 w-4" />
                  <span className="hidden sm:inline">Düzenle (@{activeTargetUser})</span>
                  <span className="sm:hidden">Düzenle</span>
                </Link>
              ) : (
                <button
                  onClick={() => setShowPrompt(true)}
                  className={isAppShell
                    ? 'flex items-center gap-1.5 sm:gap-2 rounded-full bg-[#ff5a3c] px-3 sm:px-4 py-2 text-xs font-bold text-[#14110f] shadow-[3px_3px_0_0_#14110f] transition active:scale-95'
                    : `flex items-center gap-1.5 sm:gap-2 rounded-lg ${theme.buttonPrimary} px-3 sm:px-4 py-2 text-xs font-bold shadow-sm transition active:scale-95`}
                  style={isAppShell ? undefined : theme.buttonPrimaryStyle}
                >
                  <GithubIcon className="h-4 w-4" />
                  <span className="hidden sm:inline">Portfolyomu Çek</span>
                  <span className="sm:hidden">Portfolyo</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Hızlı Kullanıcı Adı Prompt Modalı */}
      {showPrompt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-3xl border border-[#3a2c22] bg-[#1f1a16] p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-bold text-[#fdf6ec]">
                <GithubIcon className="w-4 h-4" />
                <span>GitHub Kullanıcı Adını Gir</span>
              </div>
              <button
                onClick={() => {
                  setShowPrompt(false);
                  setErrorMsg(null);
                }}
                className="text-xs text-[#8a7864] hover:text-[#fdf6ec]"
              >
                Kapat
              </button>
            </div>

            <p className="text-xs text-[#cbb9a0]">
              Kendi GitHub kullanıcı adını yaz, profilini ve projelerini anında çekip portfolyonu hazırlayalım:
            </p>

            <form onSubmit={handleQuickLogin} className="space-y-3 text-xs">
              <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl border border-[#3a2c22] bg-[#14110f] text-[#fdf6ec]">
                <span className="text-[#8a7864] font-bold">@</span>
                <input
                  type="text"
                  value={usernameInput}
                  onChange={(e) => {
                    setUsernameInput(e.target.value);
                    if (errorMsg) setErrorMsg(null);
                  }}
                  placeholder="github_kullanici_adi"
                  className="w-full bg-transparent border-none outline-none placeholder-[#8a7864] text-xs sm:text-sm"
                  autoFocus
                />
              </div>

              {errorMsg && (
                <div className="flex items-center gap-1.5 text-xs text-red-400 font-medium">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading || !usernameInput.trim()}
                className="w-full flex items-center justify-center gap-2 rounded-full bg-[#ff5a3c] hover:bg-[#ff7159] px-4 py-3 font-bold text-[#14110f] shadow-[3px_3px_0_0_#14110f] transition disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Kontrol Ediliyor...</span>
                  </>
                ) : (
                  <>
                    <span>Portfolyomu Çek</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </header>
  );
}
