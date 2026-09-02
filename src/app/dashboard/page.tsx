'use client';

import { useState, Suspense, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';
import ProfileEditor from '@/components/dashboard/ProfileEditor';
import RepoSelector from '@/components/dashboard/RepoSelector';
import CustomLinksManager from '@/components/dashboard/CustomLinksManager';
import ThemeSelector from '@/components/dashboard/ThemeSelector';
import SyncButton from '@/components/dashboard/SyncButton';
import ExperienceManager from '@/components/dashboard/ExperienceManager';
import SectionVisibilityManager from '@/components/dashboard/SectionVisibilityManager';
import BadgeGenerator from '@/components/dashboard/BadgeGenerator';
import { KodfolyoLogo } from '@/components/icons/KodfolyoLogo';
import { UserProfile, Repository, ThemeType, CustomLink, ExperienceEntry, SectionVisibility } from '@/types';
import { sanitizeUsername } from '@/lib/github/fetcher';
import { Save, CheckCircle2, LayoutGrid, User, FolderGit2, Palette, Link2, Briefcase, Rows3, BadgeCheck } from 'lucide-react';

const NAV_ITEMS = [
  { label: 'Genel bakış', href: '#genel', icon: LayoutGrid },
  { label: 'Profil', href: '#profil', icon: User },
  { label: 'Repolar', href: '#repolar', icon: FolderGit2 },
  { label: 'Deneyim', href: '#deneyim', icon: Briefcase },
  { label: 'Bölümler', href: '#bolumler', icon: Rows3 },
  { label: 'Tema', href: '#tema', icon: Palette },
  { label: 'Bağlantılar', href: '#baglantilar', icon: Link2 },
  { label: 'Rozet', href: '#rozet', icon: BadgeCheck },
];

function DashboardContent() {
  const { data: session } = useSession();
  const searchParams = useSearchParams();

  const [activeUsername, setActiveUsername] = useState<string>('');
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [repos, setRepos] = useState<Repository[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Pending (kaydedilmemiş) değişiklikler
  const [pendingTheme, setPendingTheme] = useState<ThemeType | null>(null);
  const [pendingBio, setPendingBio] = useState<string | null>(null);
  const [pendingName, setPendingName] = useState<string | null>(null);
  const [pendingLocation, setPendingLocation] = useState<string | null>(null);
  const [pendingCompany, setPendingCompany] = useState<string | null>(null);
  const [pendingBlog, setPendingBlog] = useState<string | null>(null);
  const [pendingCustomLinks, setPendingCustomLinks] = useState<CustomLink[] | null>(null);
  const [pendingExperience, setPendingExperience] = useState<ExperienceEntry[] | null>(null);
  const [pendingSectionVisibility, setPendingSectionVisibility] = useState<SectionVisibility | null>(null);

  const [isSavingAll, setIsSavingAll] = useState(false);
  const [saveAllSuccess, setSaveAllSuccess] = useState(false);

  const hasPendingChanges =
    pendingTheme !== null ||
    pendingBio !== null ||
    pendingName !== null ||
    pendingLocation !== null ||
    pendingCompany !== null ||
    pendingBlog !== null ||
    pendingCustomLinks !== null ||
    pendingExperience !== null ||
    pendingSectionVisibility !== null;

  // Profili GitHub'dan çek - temayı ASLA sıfırlama
  const loadData = async (userToFetch: string) => {
    if (!userToFetch) return;
    setIsLoading(true);
    try {
      const syncRes = await fetch('/api/github/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: userToFetch }),
      });

      if (syncRes.ok) {
        const data = await syncRes.json();
        if (data.profile) setProfile(data.profile);
        if (data.repos) setRepos(data.repos);
        return;
      }
    } catch (err) {
      console.error('Dashboard data load error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;
    const queryUser = searchParams.get('username');
    const storedUser = typeof window !== 'undefined' ? localStorage.getItem('kodfolyo_active_username') : null;
    const sessionUser = (session?.user as { username?: string })?.username || session?.user?.name;
    const targetUser = sanitizeUsername(queryUser || storedUser || sessionUser || 'erdemsnsy');

    const initData = async () => {
      setIsLoading(true);
      try {
        const syncRes = await fetch('/api/github/sync', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username: targetUser }),
        });

        if (syncRes.ok) {
          const data = await syncRes.json();
          if (isMounted) {
            setActiveUsername(targetUser);
            if (typeof window !== 'undefined') {
              localStorage.setItem('kodfolyo_active_username', targetUser);
            }
            if (data.profile) setProfile(data.profile);
            if (data.repos) setRepos(data.repos);
          }
          return;
        } else {
          // Eğer bulunamayan veya hata veren bir kullanıcı ise erdemsnsy profilini aç
          const fbRes = await fetch('/api/github/sync', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: 'erdemsnsy' }),
          });
          if (fbRes.ok) {
            const fbData = await fbRes.json();
            if (isMounted) {
              setActiveUsername('erdemsnsy');
              if (typeof window !== 'undefined') {
                localStorage.setItem('kodfolyo_active_username', 'erdemsnsy');
              }
              if (fbData.profile) setProfile(fbData.profile);
              if (fbData.repos) setRepos(fbData.repos);
            }
          }
        }
      } catch (err) {
        console.error('Dashboard data load error:', err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    initData();

    return () => {
      isMounted = false;
    };
  }, [searchParams, session]);

  // Tüm değişiklikleri tek seferde kaydet
  const handleSaveAll = async () => {
    if (!profile || !hasPendingChanges) return;
    setIsSavingAll(true);
    setSaveAllSuccess(false);

    const payload: Record<string, unknown> = { username: activeUsername };
    if (pendingTheme !== null) payload.theme = pendingTheme;
    if (pendingBio !== null) payload.custom_bio = pendingBio;
    if (pendingName !== null) payload.name = pendingName;
    if (pendingLocation !== null) payload.location = pendingLocation;
    if (pendingCompany !== null) payload.company = pendingCompany;
    if (pendingBlog !== null) payload.blog = pendingBlog;
    if (pendingCustomLinks !== null) payload.custom_links = pendingCustomLinks;
    if (pendingExperience !== null) payload.experience = pendingExperience;
    if (pendingSectionVisibility !== null) payload.section_visibility = pendingSectionVisibility;

    try {
      const res = await fetch('/api/profile/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.profile) {
          setProfile(data.profile);
        } else {
          setProfile((prev) => ({
            ...prev!,
            ...(pendingTheme !== null && { theme: pendingTheme }),
            ...(pendingBio !== null && { custom_bio: pendingBio }),
            ...(pendingName !== null && { name: pendingName }),
            ...(pendingLocation !== null && { location: pendingLocation }),
            ...(pendingCompany !== null && { company: pendingCompany }),
            ...(pendingBlog !== null && { blog: pendingBlog }),
            ...(pendingCustomLinks !== null && { custom_links: pendingCustomLinks }),
            ...(pendingExperience !== null && { experience: pendingExperience }),
            ...(pendingSectionVisibility !== null && { section_visibility: pendingSectionVisibility }),
          }));
        }

        setPendingTheme(null);
        setPendingBio(null);
        setPendingName(null);
        setPendingLocation(null);
        setPendingCompany(null);
        setPendingBlog(null);
        setPendingCustomLinks(null);
        setPendingExperience(null);
        setPendingSectionVisibility(null);
        setSaveAllSuccess(true);
        setTimeout(() => setSaveAllSuccess(false), 5000);
      }
    } catch (err) {
      console.error('Save all error:', err);
    } finally {
      setIsSavingAll(false);
    }
  };

  const handleToggleRepoVisibility = async (repoId: number, isVisible: boolean) => {
    setRepos((prev) =>
      prev.map((r) => (r.github_repo_id === repoId ? { ...r, is_visible: isVisible } : r))
    );
    try {
      await fetch('/api/profile/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: activeUsername, githubRepoId: repoId, isVisible }),
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleSetFeaturedRepo = async (repoId: number) => {
    setRepos((prev) => prev.map((r) => ({ ...r, is_featured: r.github_repo_id === repoId })));
    try {
      await fetch('/api/profile/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: activeUsername, setFeaturedRepoId: repoId }),
      });
    } catch (err) {
      console.error(err);
    }
  };

  if (isLoading || !profile) {
    return (
      <div style={{ minHeight: '100vh', background: '#F4F1EA', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 22, height: 22, border: '2px solid #1F3AE8', borderTopColor: 'transparent', borderRadius: '50%' }} className="animate-spin" />
          <p style={{ fontSize: 13, color: '#6B6675' }}>@{activeUsername || 'erdemsnsy'} profil verileri yükleniyor...</p>
        </div>
      </div>
    );
  }

  const displayProfile: UserProfile = {
    ...profile,
    ...(pendingTheme !== null && { theme: pendingTheme }),
    ...(pendingBio !== null && { custom_bio: pendingBio }),
    ...(pendingName !== null && { name: pendingName }),
    ...(pendingLocation !== null && { location: pendingLocation }),
    ...(pendingCompany !== null && { company: pendingCompany }),
    ...(pendingBlog !== null && { blog: pendingBlog }),
    ...(pendingCustomLinks !== null && { custom_links: pendingCustomLinks }),
    ...(pendingExperience !== null && { experience: pendingExperience }),
    ...(pendingSectionVisibility !== null && { section_visibility: pendingSectionVisibility }),
  };

  return (
    <div className="dash-root" style={{ display: 'grid', gridTemplateColumns: '236px minmax(0,1fr)', minHeight: '100vh', background: '#F4F1EA', fontFamily: 'var(--font-sans)' }}>
      {/* Yan menü — mobilde gizlenir, alt tab bar devreye girer */}
      <div className="dash-sidebar" style={{ borderRight: '1px solid rgba(25,23,32,.08)', background: '#EBE7DD', padding: '22px 18px', display: 'flex', flexDirection: 'column', gap: 26 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <KodfolyoLogo size={26} />
          <span style={{ fontSize: 17, fontWeight: 800, letterSpacing: '-.03em', color: '#191720' }}>Kodfolyo</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {NAV_ITEMS.map((n) => (
            <a key={n.label} href={n.href} style={{ fontSize: 14, fontWeight: 500, padding: '9px 12px', borderRadius: 9, color: '#6B6675', textDecoration: 'none', minHeight: 44, display: 'flex', alignItems: 'center' }}>
              {n.label}
            </a>
          ))}
        </div>
        <div style={{ marginTop: 'auto', padding: 14, borderRadius: 13, background: '#FFFFFF', border: '1px solid rgba(25,23,32,.09)' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: '#8C8797', marginBottom: 6 }}>SON SENKRON</div>
          <div style={{ fontSize: 13, color: '#3A3644', marginBottom: 11 }}>
            {profile.updated_at ? new Date(profile.updated_at).toLocaleString('tr-TR') : '—'}
          </div>
          <SyncButton onSync={() => loadData(activeUsername)} />
        </div>
      </div>

      {/* Mobil alt tab bar */}
      <nav className="dash-tabbar" style={{ display: 'none' }}>
        {NAV_ITEMS.map((n) => {
          const Icon = n.icon;
          return (
            <a key={n.label} href={n.href} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 3, minWidth: 60, minHeight: 48, color: '#6B6675', textDecoration: 'none', fontSize: 10, flexShrink: 0, padding: '4px 6px' }}>
              <Icon className="w-5 h-5" />
              {n.label}
            </a>
          );
        })}
      </nav>

      {/* Mobil sabit kaydet çubuğu */}
      {hasPendingChanges && (
        <div className="dash-savebar" style={{ display: 'none', alignItems: 'center', justifyContent: 'space-between', gap: 10, padding: '10px 16px' }}>
          <span style={{ fontSize: 12.5, color: '#3A3644', fontWeight: 600 }}>Kaydedilmemiş değişiklikler</span>
          <button
            type="button"
            onClick={handleSaveAll}
            disabled={isSavingAll}
            style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 700, color: '#F4F1EA', background: '#1F3AE8', border: 0, borderRadius: 10, padding: '10px 16px', minHeight: 44, cursor: 'pointer', opacity: isSavingAll ? 0.6 : 1 }}
          >
            {isSavingAll ? <CheckCircle2 className="w-4 h-4 animate-pulse" /> : <Save className="w-4 h-4" />}
            Kaydet
          </button>
        </div>
      )}

      {/* İçerik */}
      <div className="dash-content" style={{ padding: '26px 34px 110px', background: 'radial-gradient(ellipse at 100% 0%, rgba(0,166,118,.09), transparent 50%)' }}>
        <div id="genel" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap', marginBottom: 26 }}>
          <div>
            <h1 style={{ margin: 0, fontSize: 27, fontWeight: 800, letterSpacing: '-.035em', color: '#191720' }}>Profilini düzenle</h1>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: '#6B6675', marginTop: 5 }}>kodfolyo.dev/{displayProfile.username}</div>
          </div>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: saveAllSuccess ? '#00845E' : '#6B6675' }}>
              {saveAllSuccess ? '✓ Kaydedildi' : hasPendingChanges ? 'Kaydedilmemiş değişiklikler' : 'Güncel'}
            </span>
            <a
              href={`/${displayProfile.username}`}
              target="_blank"
              style={{ fontFamily: 'var(--font-sans)', fontSize: 14, fontWeight: 600, color: '#3A3644', background: 'transparent', border: '1px solid rgba(25,23,32,.16)', borderRadius: 10, padding: '10px 16px', textDecoration: 'none', whiteSpace: 'nowrap' }}
            >
              Önizle
            </a>
            <button
              type="button"
              onClick={handleSaveAll}
              disabled={isSavingAll || !hasPendingChanges}
              className="dash-savebtn-desktop"
              style={{
                display: 'flex', alignItems: 'center', gap: 8, fontFamily: 'var(--font-sans)', fontSize: 14, fontWeight: 700,
                color: '#F4F1EA', background: '#1F3AE8', border: 0, borderRadius: 10, padding: '10px 20px', cursor: 'pointer',
                whiteSpace: 'nowrap', opacity: isSavingAll || !hasPendingChanges ? 0.5 : 1, minHeight: 44,
              }}
            >
              {isSavingAll ? <CheckCircle2 className="w-4 h-4 animate-pulse" /> : <Save className="w-4 h-4" />}
              Değişiklikleri kaydet
            </button>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 18, alignItems: 'start' }}>
          <div id="profil" style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <ProfileEditor
              profile={displayProfile}
              onSave={(fields) => {
                if (fields.custom_bio !== undefined) setPendingBio(fields.custom_bio ?? '');
                if (fields.name !== undefined) setPendingName(fields.name ?? '');
                if (fields.location !== undefined) setPendingLocation(fields.location ?? '');
                if (fields.company !== undefined) setPendingCompany(fields.company ?? '');
                if (fields.blog !== undefined) setPendingBlog(fields.blog ?? '');
                return Promise.resolve();
              }}
            />
            <div id="repolar">
              <RepoSelector repos={repos} onToggleVisibility={handleToggleRepoVisibility} onSetFeatured={handleSetFeaturedRepo} />
            </div>
            <div id="deneyim">
              <ExperienceManager
                entries={displayProfile.experience}
                onSaveEntries={(entries) => {
                  setPendingExperience(entries);
                  return Promise.resolve();
                }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div id="bolumler">
              <SectionVisibilityManager
                visibility={displayProfile.section_visibility}
                onChange={(visibility) => {
                  setPendingSectionVisibility(visibility);
                  return Promise.resolve();
                }}
              />
            </div>
            <div id="tema">
              <ThemeSelector
                currentTheme={displayProfile.theme}
                onSelectTheme={(theme) => {
                  setPendingTheme(theme);
                  return Promise.resolve();
                }}
              />
            </div>
            <div id="baglantilar">
              <CustomLinksManager
                customLinks={displayProfile.custom_links}
                onSaveLinks={(links) => {
                  setPendingCustomLinks(links);
                  return Promise.resolve();
                }}
              />
            </div>
            <div id="rozet">
              <BadgeGenerator username={displayProfile.username} defaultTheme={displayProfile.theme} />
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 860px) {
          .dash-root { grid-template-columns: 1fr !important; }
          .dash-sidebar { display: none !important; }
          .dash-content { padding: 20px 16px 90px !important; }
          .dash-tabbar {
            display: flex !important; position: fixed; bottom: 0; left: 0; right: 0; z-index: 50;
            background: #EBE7DD; border-top: 1px solid rgba(25,23,32,.1); overflow-x: auto;
          }
          .dash-savebar { display: flex !important; position: fixed; left: 0; right: 0; bottom: 64px; z-index: 51; background: rgba(244,241,234,.97); backdrop-filter: blur(10px); border-top: 1px solid rgba(25,23,32,.1); }
          .dash-savebtn-desktop { display: none !important; }
        }
      `}</style>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', background: '#F4F1EA' }} />}>
      <DashboardContent />
    </Suspense>
  );
}
