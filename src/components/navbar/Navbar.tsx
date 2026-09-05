'use client';

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { LayoutDashboard, User, LogOut, ExternalLink, ArrowRight, AlertCircle, RefreshCw, Star } from 'lucide-react';
import { GithubIcon } from '@/components/icons/GithubIcon';
import Kodi from '@/components/mascot/Kodi';
import FetchingOverlay from '@/components/landing/FetchingOverlay';
import { useState, useEffect } from 'react';

import { ThemeType } from '@/types';
import { getTheme } from '@/lib/theme';

interface NavbarProps {
  themeType?: ThemeType;
  currentUsername?: string;
}

const LANDING_LINKS = [
  { label: 'Ana Sayfa', href: '#hero' },
  { label: 'Çıktı', href: '#onizleme' },
  { label: 'Özellikler', href: '#ozellikler' },
  { label: 'Sıkça Sorulanlar', href: '#sss' },
];

export default function Navbar({ themeType, currentUsername }: NavbarProps = {}) {
  const router = useRouter();
  const pathname = usePathname();
  const isLanding = pathname === '/';
  const { data: session, status } = useSession();
  const [showPrompt, setShowPrompt] = useState(false);
  const [usernameInput, setUsernameInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [storedUsername, setStoredUsername] = useState<string | null>(null);
  const [githubStars, setGithubStars] = useState<number | null>(null);

  useEffect(() => {
    // localStorage'ı bilerek effect içinde okuyoruz (lazy useState initializer değil):
    // bu değer "Düzenle (@kullanici)" gibi görünür metni değiştiriyor, sunucu her zaman
    // null render eder — client ilk boyamada da null ile eşleşsin ki hydration mismatch
    // olmasın, gerçek değer mount sonrası (bu effect'te) uygulanır.
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('kodfolyo_active_username');
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (stored) setStoredUsername(stored);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    fetch('https://api.github.com/repos/erdemsnsy/kodfolyo')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!cancelled && data && typeof data.stargazers_count === 'number') {
          setGithubStars(data.stargazers_count);
        }
      })
      .catch(() => {});
    return () => { cancelled = true; };
  }, []);

  // themeType sadece bir portfolyo görüntülenirken gelir (ziyaretçinin seçtiği
  // temayla uyumlu çerçeve için). Kodfolyo'nun kendi sayfalarında (landing,
  // panel girişleri...) her zaman nötr kurumsal kabuk kullanılır.
  const theme = getTheme(themeType);
  const isPortfolioContext = !!themeType;
  const chromeBg = isPortfolioContext ? theme.bg : '#F9FAFB';
  const chromeMuted = isPortfolioContext ? theme.muted : '#71717A';

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
    <header style={{ position: 'sticky', top: 0, zIndex: 60, padding: '14px clamp(12px, 3vw, 28px) 0' }}>
    <div
      style={{
        maxWidth: 1180, margin: '0 auto', display: 'grid', gridTemplateColumns: isLanding ? 'auto 1fr auto' : 'auto 1fr',
        alignItems: 'center', columnGap: 16, rowGap: 8,
        padding: '13px 20px', borderRadius: 18, border: '1px solid rgba(228,228,231,.7)',
        background: `${chromeBg}E6`, backdropFilter: 'blur(16px)', boxShadow: '0 12px 32px -16px rgba(20,18,30,.25)',
      }}
    >
      <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
        <Kodi size={46} float={false} grayscale />
        <span style={{ fontSize: 19, fontWeight: 800, letterSpacing: '-.03em', color: '#18181B' }}>Kodfolyo</span>
      </Link>

      {isLanding && (
        <nav className="nav-links-mid" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
          {LANDING_LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="hover:bg-zinc-100 hover:text-zinc-900 transition-colors"
              style={{ fontSize: 15, fontWeight: 600, color: chromeMuted, textDecoration: 'none', padding: '10px 16px', borderRadius: 8 }}
            >
              {l.label}
            </a>
          ))}
        </nav>
      )}

      <div style={{ display: 'flex', alignItems: 'center', gap: 18, flexWrap: 'wrap', justifySelf: 'end' }}>
        {status === 'authenticated' && session?.user ? (
          <>
            <Link
              href={`/${username}`}
              className="nav-hide-narrow hover:bg-zinc-100 hover:text-zinc-900 transition-colors"
              style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: chromeMuted, textDecoration: 'none', padding: '7px 10px', borderRadius: 8 }}
            >
              <User className="h-3.5 w-3.5" />
              <span>/{username}</span>
              <ExternalLink className="h-3 w-3 opacity-60" />
            </Link>

            <Link
              href={editDashboardUrl}
              className="hover:bg-zinc-800 transition-colors"
              style={{
                display: 'flex', alignItems: 'center', gap: 8, fontFamily: 'var(--font-sans)', fontSize: 14, fontWeight: 600,
                color: '#F9FAFB', background: '#18181B', border: 0, borderRadius: 9, padding: '9px 16px', textDecoration: 'none',
              }}
            >
              <LayoutDashboard className="h-3.5 w-3.5" />
              <span>Panelim</span>
            </Link>

            <button
              onClick={() => signOut({ callbackUrl: '/' })}
              className="hover:bg-zinc-100 hover:text-zinc-900 transition-colors"
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 40, height: 40, borderRadius: 9, color: chromeMuted, background: 'transparent', border: 0, cursor: 'pointer' }}
              title="Çıkış Yap"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </>
        ) : (
          <>
            {activeTargetUser && activeTargetUser !== 'ornek-ogrenci' && activeTargetUser !== 'demo' ? (
              <>
                {githubStars !== null && (
                  <a
                    href="https://github.com/erdemsnsy/kodfolyo"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="nav-hide-narrow hover:bg-zinc-100 hover:text-zinc-900 transition-colors"
                    style={{
                      display: 'flex', alignItems: 'center', gap: 5, fontSize: 13, fontWeight: 600, color: chromeMuted,
                      textDecoration: 'none', padding: '7px 12px', borderRadius: 8,
                      border: '1px solid rgba(228,228,231,.7)',
                    }}
                  >
                    <Star className="h-3.5 w-3.5" />
                    <span>{githubStars}</span>
                  </a>
                )}
                <Link
                  href={editDashboardUrl}
                  className="hover:bg-zinc-800 transition-colors"
                  style={{
                    fontFamily: 'var(--font-sans)', fontSize: 14, fontWeight: 600, color: '#F9FAFB', background: '#18181B',
                    border: 0, borderRadius: 9, padding: '9px 16px', textDecoration: 'none',
                  }}
                >
                  Düzenle (@{activeTargetUser})
                </Link>
              </>
            ) : (
              <button
                onClick={() => setShowPrompt(true)}
                className="hover:bg-zinc-800 transition-colors"
                style={{
                  fontFamily: 'var(--font-sans)', fontSize: 14, fontWeight: 600, color: '#F9FAFB', background: '#18181B',
                  border: 0, borderRadius: 9, padding: '9px 16px', cursor: 'pointer',
                }}
              >
                Portfolyo Oluştur
              </button>
            )}
          </>
        )}
      </div>
    </div>

      {/* Hızlı Kullanıcı Adı Prompt Modalı */}
      {showPrompt && isLoading && <FetchingOverlay />}
      {showPrompt && !isLoading && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 120, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 32, background: 'rgba(228,228,231,.55)', backdropFilter: 'blur(6px)' }}>
          <div style={{ width: '100%', maxWidth: 420, padding: 24, borderRadius: 22, background: '#F9FAFB', border: '1px solid rgba(228,228,231,.12)', boxShadow: '0 40px 90px rgba(228,228,231,.35)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 15, fontWeight: 800, color: '#18181B' }}>
                <GithubIcon className="w-4 h-4" />
                <span>GitHub Kullanıcı Adını Gir</span>
              </div>
              <button
                onClick={() => { setShowPrompt(false); setErrorMsg(null); }}
                style={{ fontSize: 18, lineHeight: 1, color: '#71717A', background: 'transparent', border: 0, cursor: 'pointer' }}
              >
                ×
              </button>
            </div>

            <p style={{ fontSize: 13, color: '#52525B', margin: '0 0 16px' }}>
              Kendi GitHub kullanıcı adını yaz, profilini ve projelerini anında çekip portfolyonu hazırlayalım:
            </p>

            <form onSubmit={handleQuickLogin} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 2, background: '#FFFFFF', border: '1px solid rgba(228,228,231,.14)', borderRadius: 13, padding: '5px 5px 5px 16px' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 15, color: '#A1A1AA' }}>github.com/</span>
                <input
                  type="text"
                  value={usernameInput}
                  onChange={(e) => { setUsernameInput(e.target.value); if (errorMsg) setErrorMsg(null); }}
                  placeholder="kullaniciadi"
                  autoFocus
                  className="focus:ring-1 focus:ring-zinc-900 rounded-md"
                  style={{ flex: 1, minWidth: 0, background: 'transparent', border: 0, outline: 'none', color: '#18181B', fontFamily: 'var(--font-mono)', fontSize: 15, padding: '11px 4px' }}
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
                  fontSize: 15, fontWeight: 700, color: '#F9FAFB', background: '#18181B', border: 0, borderRadius: 13,
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
