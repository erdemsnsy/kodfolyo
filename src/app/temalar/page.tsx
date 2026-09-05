'use client';

import { useState, Suspense, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/navbar/Navbar';
import PortfolioHero from '@/components/portfolio/PortfolioHero';
import TechStack from '@/components/portfolio/TechStack';
import ProjectGrid from '@/components/portfolio/ProjectGrid';
import { themes } from '@/lib/theme';
import { getMockGitHubUserData, getMockRepositories, sanitizeUsername } from '@/lib/github/fetcher';
import { UserProfile, DEFAULT_SECTION_VISIBILITY, ThemeType } from '@/types';
import { Check } from 'lucide-react';

function TemalarContent() {
  const router = useRouter();
  const [activeUsername, setActiveUsername] = useState<string | null>(null);
  const [applyingTheme, setApplyingTheme] = useState<ThemeType | null>(null);
  const [appliedTheme, setAppliedTheme] = useState<ThemeType | null>(null);

  useEffect(() => {
    // localStorage bilerek effect'te okunuyor (bkz. Navbar.tsx) — hydration mismatch
    // yaşamamak için sunucu/ilk boyama her zaman boş, gerçek değer mount sonrası gelir.
    const stored = typeof window !== 'undefined' ? localStorage.getItem('kodfolyo_active_username') : null;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (stored) setActiveUsername(sanitizeUsername(stored));
  }, []);

  const mockUser = getMockGitHubUserData('ornek-ogrenci');
  const mockRepos = getMockRepositories('ornek-ogrenci');
  const starCount = mockRepos.reduce((sum, r) => sum + (r.stargazers_count || 0), 0);

  const handleUseTheme = async (themeId: ThemeType) => {
    if (!activeUsername) {
      router.push('/dashboard');
      return;
    }
    setApplyingTheme(themeId);
    try {
      await fetch('/api/profile/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: activeUsername, theme: themeId }),
      });
      setAppliedTheme(themeId);
      setTimeout(() => router.push(`/dashboard?username=${encodeURIComponent(activeUsername)}`), 700);
    } catch (err) {
      console.error(err);
      setApplyingTheme(null);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#F4F1EA' }}>
      <Navbar currentUsername={activeUsername || undefined} />

      <div style={{ maxWidth: 1180, margin: '0 auto', padding: '40px clamp(16px, 5vw, 40px) 90px' }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: '#1F3AE8' }}>TEMALAR</span>
        <h1 style={{ margin: '10px 0 10px', fontSize: 'clamp(28px, 5vw, 38px)', fontWeight: 900, letterSpacing: '-.035em', color: '#191720' }}>
          Portfolyona uygun temayı seç.
        </h1>
        <p style={{ margin: '0 0 34px', fontSize: 15.5, color: '#56515F', maxWidth: 560 }}>
          {Object.keys(themes).length} tema, aynı bileşen dili üzerinde farklı renk paletleri. Gerçek portfolyo önizlemesi üstünde nasıl göründüğünü gör.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: 24 }}>
          {Object.values(themes).map((t) => {
            const demoProfile: UserProfile = {
              id: `demo-${t.id}`,
              github_id: '12345678',
              username: mockUser.login,
              name: mockUser.name,
              avatar_url: mockUser.avatar_url,
              bio: mockUser.bio,
              custom_bio: 'Bilgisayar Mühendisliği Öğrencisi.',
              company: mockUser.company,
              location: mockUser.location,
              email: mockUser.email,
              blog: mockUser.blog,
              theme: t.id,
              custom_links: [],
              experience: [],
              manual_projects: [],
              certificates: [],
              section_visibility: DEFAULT_SECTION_VISIBILITY,
            };
            const isApplying = applyingTheme === t.id;
            const isApplied = appliedTheme === t.id;

            return (
              <div key={t.id} style={{ borderRadius: 18, border: '1px solid rgba(25,23,32,.12)', background: '#FFFFFF', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                <div style={{ height: 340, overflow: 'hidden', position: 'relative', background: t.bg }}>
                  <div style={{ position: 'absolute', top: 0, left: 0, width: '250%', transform: 'scale(0.4)', transformOrigin: 'top left', pointerEvents: 'none' }}>
                    <PortfolioHero profile={demoProfile} repoCount={mockRepos.length} starCount={starCount} isDemo />
                    <TechStack repos={mockRepos} themeType={t.id} />
                    <ProjectGrid repos={mockRepos.slice(0, 3)} themeType={t.id} />
                  </div>
                </div>

                <div style={{ padding: 18, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, borderTop: '1px solid rgba(25,23,32,.08)' }}>
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 800, color: '#191720', marginBottom: 6 }}>{t.name}</div>
                    <div style={{ display: 'flex', gap: 5 }}>
                      <span style={{ width: 16, height: 16, borderRadius: '50%', background: t.bg, border: '1px solid rgba(25,23,32,.15)' }} />
                      <span style={{ width: 16, height: 16, borderRadius: '50%', background: t.a }} />
                      <span style={{ width: 16, height: 16, borderRadius: '50%', background: t.b }} />
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleUseTheme(t.id)}
                    disabled={isApplying}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 7, fontFamily: 'var(--font-sans)', fontSize: 13.5, fontWeight: 700,
                      color: isApplied ? '#00845E' : '#F4F1EA', background: isApplied ? 'rgba(0,166,118,.12)' : '#191720',
                      border: isApplied ? '1px solid rgba(0,166,118,.3)' : 0, borderRadius: 10, padding: '10px 16px', cursor: 'pointer',
                      minHeight: 44, opacity: isApplying ? 0.6 : 1, whiteSpace: 'nowrap',
                    }}
                  >
                    {isApplied ? (<><Check className="w-3.5 h-3.5" /> Uygulandı</>) : isApplying ? 'Uygulanıyor...' : 'Bu temayı kullan'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default function TemalarPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', background: '#F4F1EA' }} />}>
      <TemalarContent />
    </Suspense>
  );
}
