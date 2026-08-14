'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { LayoutDashboard, User, LogOut, Code2, ExternalLink, ArrowRight, AlertCircle, RefreshCw } from 'lucide-react';
import { GithubIcon } from '@/components/icons/GithubIcon';
import { useState, useEffect } from 'react';

import { ThemeType } from '@/types';
import { getTheme } from '@/lib/theme';

interface NavbarProps {
  headerStyle?: React.CSSProperties;
  themeType?: ThemeType;
  currentUsername?: string;
}

export default function Navbar({ headerStyle, themeType, currentUsername }: NavbarProps = {}) {
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

  const theme = getTheme(themeType);

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
      className={`sticky top-0 z-50 w-full border-b ${theme.navBorder} transition-all duration-300`}
      style={headerStyle || { backgroundColor: 'rgba(12, 13, 14, 0.9)', backdropFilter: 'blur(12px)' }}
    >
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 sm:px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 text-sm font-bold tracking-tight transition hover:opacity-80">
          <div className={`flex h-7 w-7 items-center justify-center rounded-lg ${theme.isLight ? 'bg-slate-950 text-white' : 'bg-white text-slate-950'} font-black shadow-sm`}>
            <Code2 className="h-4 w-4" />
          </div>
          <span className={theme.navText}>Kodfolyo<span className={theme.isLight ? 'text-slate-500' : 'text-slate-400'}>.dev</span></span>
        </Link>

        {/* Navigation & Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {status === 'authenticated' && session?.user ? (
            <>
              <Link
                href={`/${username}`}
                className={`hidden sm:flex items-center gap-1.5 rounded-lg border ${theme.navBorder} ${theme.badge} px-3 py-1.5 text-xs font-medium ${theme.navMuted} transition`}
                style={theme.badgeStyle}
              >
                <User className="h-3.5 w-3.5" />
                <span>/{username}</span>
                <ExternalLink className="h-3 w-3 opacity-60" />
              </Link>

              <Link
                href={editDashboardUrl}
                className={`flex items-center gap-1.5 rounded-lg ${theme.buttonPrimary} px-3.5 py-1.5 text-xs font-bold shadow-sm transition`}
                style={theme.buttonPrimaryStyle}
              >
                <LayoutDashboard className="h-3.5 w-3.5" />
                <span>Düzenle</span>
              </Link>

              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                className={`flex items-center gap-1.5 rounded-lg border ${theme.navBorder} ${theme.badge} px-2.5 py-1.5 text-xs ${theme.textMuted} hover:text-red-500 transition`}
                style={theme.badgeStyle}
                title="Çıkış Yap"
              >
                <LogOut className="h-3.5 w-3.5" />
              </button>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/ornek-ogrenci"
                className={`text-xs font-semibold ${theme.navMuted} px-2 py-1 transition`}
                title="Canlı Örnek Portfolyoyu İncele"
              >
                Örnek Portfolyo
              </Link>

              {activeTargetUser && activeTargetUser !== 'ornek-ogrenci' && activeTargetUser !== 'demo' ? (
                <Link
                  href={editDashboardUrl}
                  className={`flex items-center gap-1.5 rounded-lg ${theme.buttonPrimary} px-3 sm:px-4 py-2 text-xs font-bold shadow-sm transition active:scale-95`}
                  style={theme.buttonPrimaryStyle}
                >
                  <LayoutDashboard className="h-4 w-4" />
                  <span className="hidden sm:inline">Düzenle (@{activeTargetUser})</span>
                  <span className="sm:hidden">Düzenle</span>
                </Link>
              ) : (
                <button
                  onClick={() => setShowPrompt(true)}
                  className={`flex items-center gap-1.5 sm:gap-2 rounded-lg ${theme.buttonPrimary} px-3 sm:px-4 py-2 text-xs font-bold shadow-sm transition active:scale-95`}
                  style={theme.buttonPrimaryStyle}
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
          <div className="w-full max-w-md rounded-2xl border border-[#23272e] bg-[#141619] p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-bold text-white">
                <GithubIcon className="w-4 h-4" />
                <span>GitHub Kullanıcı Adını Gir</span>
              </div>
              <button
                onClick={() => {
                  setShowPrompt(false);
                  setErrorMsg(null);
                }}
                className="text-xs text-[#64748b] hover:text-white"
              >
                Kapat
              </button>
            </div>

            <p className="text-xs text-[#94a3b8]">
              Kendi GitHub kullanıcı adını yaz, profilini ve projelerini anında çekip portfolyonu hazırlayalım:
            </p>

            <form onSubmit={handleQuickLogin} className="space-y-3 text-xs">
              <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl border border-[#23272e] bg-[#0c0d0e] text-[#f8fafc]">
                <span className="text-slate-400 font-bold">@</span>
                <input
                  type="text"
                  value={usernameInput}
                  onChange={(e) => {
                    setUsernameInput(e.target.value);
                    if (errorMsg) setErrorMsg(null);
                  }}
                  placeholder="github_kullanici_adi"
                  className="w-full bg-transparent border-none outline-none placeholder-[#64748b] text-xs sm:text-sm"
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
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-white hover:bg-slate-200 px-4 py-3 font-bold text-slate-950 shadow transition disabled:opacity-50"
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
