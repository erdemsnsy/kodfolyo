'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { LayoutDashboard, User, LogOut, ExternalLink, ArrowRight, AlertCircle, RefreshCw, Check, Link2 } from 'lucide-react';
import { GithubIcon } from '@/components/icons/GithubIcon';
import { KodfolyoLogo } from '@/components/icons/KodfolyoLogo';
import { useState, useEffect } from 'react';

import { ThemeType } from '@/types';
import { getTheme } from '@/lib/theme';

interface NavbarProps {
  themeType?: ThemeType;
  currentUsername?: string;
}

export default function Navbar({ themeType, currentUsername }: NavbarProps = {}) {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [showConsent, setShowConsent] = useState(false);
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
      style={{
        position: 'sticky', top: 0, zIndex: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        flexWrap: 'wrap', rowGap: 8,
        padding: '16px clamp(16px, 4vw, 40px)', background: `${theme.bg}CC`, backdropFilter: 'blur(16px)', borderBottom: '1px solid rgba(25,23,32,.07)',
      }}
    >
      <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 11, textDecoration: 'none' }}>
        <KodfolyoLogo size={30} />
        <span style={{ fontSize: 19, fontWeight: 800, letterSpacing: '-.03em', color: '#191720' }}>Kodfolyo</span>
      </Link>

      <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
        <Link href="/kesfet" className="nav-hide-narrow" style={{ fontSize: 14, color: theme.muted, textDecoration: 'none' }}>
          Keşfet
        </Link>
        <Link href="/temalar" className="nav-hide-narrow" style={{ fontSize: 14, color: theme.muted, textDecoration: 'none' }}>
          Temalar
        </Link>

        {status === 'authenticated' && session?.user ? (
          <>
            <Link
              href={`/${username}`}
              className="nav-hide-narrow"
              style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: theme.muted, textDecoration: 'none' }}
            >
              <User className="h-3.5 w-3.5" />
              <span>/{username}</span>
              <ExternalLink className="h-3 w-3 opacity-60" />
            </Link>

            <Link
              href={editDashboardUrl}
              style={{
                display: 'flex', alignItems: 'center', gap: 8, fontFamily: 'var(--font-sans)', fontSize: 14, fontWeight: 600,
                color: '#F4F1EA', background: '#191720', border: 0, borderRadius: 9, padding: '9px 16px', textDecoration: 'none',
              }}
            >
              <LayoutDashboard className="h-3.5 w-3.5" />
              <span>Panelim</span>
            </Link>

            <button
              onClick={() => signOut({ callbackUrl: '/' })}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 44, height: 44, color: theme.muted, background: 'transparent', border: 0, cursor: 'pointer' }}
              title="Çıkış Yap"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </>
        ) : (
          <>
            <Link href="/ornek-ogrenci" className="nav-hide-narrow" style={{ fontSize: 14, color: theme.muted, textDecoration: 'none' }}>
              Örnek Portfolyo
            </Link>

            {activeTargetUser && activeTargetUser !== 'ornek-ogrenci' && activeTargetUser !== 'demo' ? (
              <Link
                href={editDashboardUrl}
                style={{
                  fontFamily: 'var(--font-sans)', fontSize: 14, fontWeight: 600, color: '#F4F1EA', background: '#191720',
                  border: 0, borderRadius: 9, padding: '9px 16px', textDecoration: 'none',
                }}
              >
                Düzenle (@{activeTargetUser})
              </Link>
            ) : (
              <button
                onClick={() => setShowConsent(true)}
                style={{
                  fontFamily: 'var(--font-sans)', fontSize: 14, fontWeight: 600, color: '#F4F1EA', background: '#191720',
                  border: 0, borderRadius: 9, padding: '9px 16px', cursor: 'pointer',
                }}
              >
                GitHub ile Giriş
              </button>
            )}
          </>
        )}
      </div>

      {/* GitHub izin ekranı (kozmetik) */}
      {showConsent && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 120, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 32, background: 'rgba(25,23,32,.55)', backdropFilter: 'blur(6px)' }}>
          <div style={{ width: '100%', maxWidth: 420, padding: 28, borderRadius: 22, background: '#F4F1EA', border: '1px solid rgba(25,23,32,.12)', boxShadow: '0 40px 90px rgba(25,23,32,.35)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14, marginBottom: 20 }}>
              <div style={{ width: 52, height: 52, borderRadius: 14, background: '#FFFFFF', border: '1px solid rgba(25,23,32,.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <KodfolyoLogo size={26} />
              </div>
              <Link2 className="w-4 h-4" style={{ color: '#8C8797' }} />
              <div style={{ width: 52, height: 52, borderRadius: 14, background: '#191720', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <GithubIcon className="w-6 h-6" style={{ color: '#F4F1EA' }} />
              </div>
            </div>

            <h3 style={{ margin: '0 0 6px', fontSize: 17, fontWeight: 800, textAlign: 'center', color: '#191720' }}>Kodfolyo, GitHub hesabına erişmek istiyor</h3>
            <p style={{ margin: '0 0 18px', fontSize: 13, color: '#6B6675', textAlign: 'center' }}>
              Devam edersen aşağıdaki verilere salt-okunur erişim verilmiş olur:
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 9, marginBottom: 20 }}>
              {[
                'Herkese açık profil bilgileri (isim, avatar, biyografi)',
                'Herkese açık repo listesi',
                'Yıldız ve fork sayıları',
              ].map((item) => (
                <div key={item} style={{ display: 'flex', alignItems: 'flex-start', gap: 9, padding: '10px 12px', borderRadius: 11, background: '#FFFFFF', border: '1px solid rgba(25,23,32,.08)' }}>
                  <Check className="w-3.5 h-3.5" style={{ color: '#00845E', marginTop: 2, flexShrink: 0 }} />
                  <span style={{ fontSize: 13, color: '#3A3644', lineHeight: 1.4 }}>{item}</span>
                </div>
              ))}
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 9, padding: '10px 12px', borderRadius: 11, background: 'rgba(198,49,78,.06)', border: '1px solid rgba(198,49,78,.15)' }}>
                <AlertCircle className="w-3.5 h-3.5" style={{ color: '#C6314E', marginTop: 2, flexShrink: 0 }} />
                <span style={{ fontSize: 13, color: '#3A3644', lineHeight: 1.4 }}>Yazma izni yok — hiçbir repona veya ayarına dokunulmaz.</span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 10 }}>
              <button
                onClick={() => setShowConsent(false)}
                style={{ flex: 1, fontFamily: 'var(--font-sans)', fontSize: 14, fontWeight: 600, color: '#3A3644', background: 'transparent', border: '1px solid rgba(25,23,32,.16)', borderRadius: 13, padding: '12px 16px', cursor: 'pointer' }}
              >
                Vazgeç
              </button>
              <button
                onClick={() => { setShowConsent(false); setShowPrompt(true); }}
                style={{ flex: 1.4, fontFamily: 'var(--font-sans)', fontSize: 14, fontWeight: 700, color: '#F4F1EA', background: '#1F3AE8', border: 0, borderRadius: 13, padding: '12px 16px', cursor: 'pointer' }}
              >
                İzin ver
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Hızlı Kullanıcı Adı Prompt Modalı */}
      {showPrompt && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 120, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 32, background: 'rgba(25,23,32,.55)', backdropFilter: 'blur(6px)' }}>
          <div style={{ width: '100%', maxWidth: 420, padding: 24, borderRadius: 22, background: '#F4F1EA', border: '1px solid rgba(25,23,32,.12)', boxShadow: '0 40px 90px rgba(25,23,32,.35)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 15, fontWeight: 800, color: '#191720' }}>
                <GithubIcon className="w-4 h-4" />
                <span>GitHub Kullanıcı Adını Gir</span>
              </div>
              <button
                onClick={() => { setShowPrompt(false); setErrorMsg(null); }}
                style={{ fontSize: 18, lineHeight: 1, color: '#6B6675', background: 'transparent', border: 0, cursor: 'pointer' }}
              >
                ×
              </button>
            </div>

            <p style={{ fontSize: 13, color: '#56515F', margin: '0 0 16px' }}>
              Kendi GitHub kullanıcı adını yaz, profilini ve projelerini anında çekip portfolyonu hazırlayalım:
            </p>

            <form onSubmit={handleQuickLogin} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 2, background: '#FFFFFF', border: '1px solid rgba(25,23,32,.14)', borderRadius: 13, padding: '5px 5px 5px 16px' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 15, color: '#8C8797' }}>github.com/</span>
                <input
                  type="text"
                  value={usernameInput}
                  onChange={(e) => { setUsernameInput(e.target.value); if (errorMsg) setErrorMsg(null); }}
                  placeholder="kullaniciadi"
                  autoFocus
                  style={{ flex: 1, minWidth: 0, background: 'transparent', border: 0, outline: 'none', color: '#191720', fontFamily: 'var(--font-mono)', fontSize: 15, padding: '11px 4px' }}
                />
              </div>

              {errorMsg && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12.5, color: '#C6314E', fontWeight: 500 }}>
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading || !usernameInput.trim()}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 9, fontFamily: 'var(--font-sans)',
                  fontSize: 15, fontWeight: 700, color: '#F4F1EA', background: '#1F3AE8', border: 0, borderRadius: 13,
                  padding: '13px 24px', cursor: 'pointer', opacity: isLoading || !usernameInput.trim() ? 0.5 : 1,
                }}
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
