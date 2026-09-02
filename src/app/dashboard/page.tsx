'use client';

import { useState, Suspense, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import ProfileEditor from '@/components/dashboard/ProfileEditor';
import RepoSelector from '@/components/dashboard/RepoSelector';
import CustomLinksManager from '@/components/dashboard/CustomLinksManager';
import ThemeSelector from '@/components/dashboard/ThemeSelector';
import SyncButton from '@/components/dashboard/SyncButton';
import ExperienceManager from '@/components/dashboard/ExperienceManager';
import SectionVisibilityManager from '@/components/dashboard/SectionVisibilityManager';
import BadgeGenerator from '@/components/dashboard/BadgeGenerator';
import AnalyticsPanel from '@/components/dashboard/AnalyticsPanel';
import CustomDomainManager from '@/components/dashboard/CustomDomainManager';
import LivePortfolioPreview from '@/components/dashboard/LivePortfolioPreview';
import { KodfolyoLogo } from '@/components/icons/KodfolyoLogo';
import { UserProfile, Repository, ThemeType, CustomLink, ExperienceEntry, SectionVisibility } from '@/types';
import { sanitizeUsername } from '@/lib/github/fetcher';
import { Save, CheckCircle2, LayoutGrid, User, FolderGit2, Palette, Link2, Briefcase, Rows3, BadgeCheck, Settings, BarChart3, Globe2, Star, ExternalLink } from 'lucide-react';

type TabId = 'genel' | 'profil' | 'repolar' | 'deneyim' | 'bolumler' | 'tema' | 'baglantilar' | 'rozet' | 'analytics' | 'alanadi';

const NAV_ITEMS: { id: TabId; label: string; description: string; icon: typeof LayoutGrid }[] = [
  { id: 'genel', label: 'Genel bakış', description: 'Profiline hızlı bakış ve durum özeti.', icon: LayoutGrid },
  { id: 'profil', label: 'Profil', description: 'İsim, biyografi ve iletişim bilgilerin.', icon: User },
  { id: 'repolar', label: 'Repolar', description: 'Portfolyoda görünecek repoları ve vitrin projesini seç.', icon: FolderGit2 },
  { id: 'deneyim', label: 'Deneyim', description: 'İş ve eğitim geçmişini zaman çizelgesine ekle.', icon: Briefcase },
  { id: 'bolumler', label: 'Bölümler', description: 'Portfolyonda hangi bölümlerin görüneceğini seç.', icon: Rows3 },
  { id: 'tema', label: 'Tema', description: 'Portfolyonun renk paletini seç.', icon: Palette },
  { id: 'baglantilar', label: 'Bağlantılar', description: 'CV, sosyal medya ve diğer özel bağlantıların.', icon: Link2 },
  { id: 'rozet', label: 'Rozet', description: 'README\'ine ekleyebileceğin gömülebilir rozet.', icon: BadgeCheck },
  { id: 'analytics', label: 'Analytics', description: 'Görüntülenme, tıklama ve indirme istatistiklerin.', icon: BarChart3 },
  { id: 'alanadi', label: 'Alan Adı', description: 'Portfolyonu kendi alan adından yayınla.', icon: Globe2 },
];

function DashboardContent() {
  const { data: session } = useSession();
  const searchParams = useSearchParams();

  const [activeTab, setActiveTab] = useState<TabId>('genel');
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
  const [pendingRssUrl, setPendingRssUrl] = useState<string | null>(null);
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
    pendingRssUrl !== null ||
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
    if (pendingRssUrl !== null) payload.rss_url = pendingRssUrl;
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
            ...(pendingRssUrl !== null && { rss_url: pendingRssUrl }),
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
        setPendingRssUrl(null);
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

  const handleSaveDomain = async (domain: string | null) => {
    try {
      const res = await fetch('/api/profile/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: activeUsername, customDomain: domain }),
      });
      const data = await res.json();
      if (data.profile) setProfile(data.profile);
    } catch (err) {
      console.error(err);
    }
  };

  const handleVerifyDomain = async (): Promise<{ verified: boolean; error?: string }> => {
    try {
      const res = await fetch('/api/domain/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: activeUsername }),
      });
      const data = await res.json();
      if (data.verified) setProfile((prev) => (prev ? { ...prev, custom_domain_verified: true } : prev));
      return { verified: !!data.verified, error: data.error };
    } catch (err) {
      console.error(err);
      return { verified: false, error: 'Doğrulama isteği başarısız.' };
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
    ...(pendingRssUrl !== null && { rss_url: pendingRssUrl }),
    ...(pendingCustomLinks !== null && { custom_links: pendingCustomLinks }),
    ...(pendingExperience !== null && { experience: pendingExperience }),
    ...(pendingSectionVisibility !== null && { section_visibility: pendingSectionVisibility }),
  };

  const visibleRepoCount = repos.filter((r) => r.is_visible !== false).length;
  const starCount = repos.reduce((sum, r) => sum + (r.stargazers_count || 0), 0);
  const activeItem = NAV_ITEMS.find((n) => n.id === activeTab)!;
  // Rozet'in kendi önizlemesi var, Analytics ve Alan Adı görsel bir portfolyo
  // değişikliği yapmıyor — canlı önizleme sadece anlamlı olan sekmelerde gösterilir.
  const showLivePreview = !['rozet', 'analytics', 'alanadi'].includes(activeTab);

  const renderTabContent = () => {
    switch (activeTab) {
      case 'genel':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ padding: 20, borderRadius: 14, background: '#FFFFFF', border: '1px solid rgba(25,23,32,.09)', display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
              <div style={{ position: 'relative', width: 56, height: 56, borderRadius: '50%', overflow: 'hidden', flexShrink: 0, background: '#EBE7DD' }}>
                <Image src={displayProfile.avatar_url} alt={displayProfile.username} fill className="object-cover" />
              </div>
              <div style={{ flex: 1, minWidth: 180 }}>
                <div style={{ fontSize: 17, fontWeight: 800, color: '#191720' }}>{displayProfile.name || displayProfile.username}</div>
                <a href={`/${displayProfile.username}`} target="_blank" style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontFamily: 'var(--font-mono)', fontSize: 12.5, color: '#1F3AE8', textDecoration: 'none' }}>
                  kodfolyo.dev/{displayProfile.username} <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              {displayProfile.is_published === false && (
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11.5, padding: '5px 11px', borderRadius: 999, background: 'rgba(180,83,31,.1)', color: '#B4531F' }}>YAYINDA DEĞİL</span>
              )}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12 }}>
              <div style={{ padding: 18, borderRadius: 14, background: '#FFFFFF', border: '1px solid rgba(25,23,32,.09)' }}>
                <FolderGit2 className="w-4 h-4" style={{ color: '#1F3AE8', marginBottom: 10 }} />
                <div style={{ fontSize: 22, fontWeight: 800, color: '#191720' }}>{visibleRepoCount}</div>
                <div style={{ fontSize: 12, color: '#6B6675', marginTop: 2 }}>Görünür repo</div>
              </div>
              <div style={{ padding: 18, borderRadius: 14, background: '#FFFFFF', border: '1px solid rgba(25,23,32,.09)' }}>
                <Star className="w-4 h-4" style={{ color: '#F5B83D', marginBottom: 10 }} />
                <div style={{ fontSize: 22, fontWeight: 800, color: '#191720' }}>{starCount}</div>
                <div style={{ fontSize: 12, color: '#6B6675', marginTop: 2 }}>Toplam yıldız</div>
              </div>
              <div style={{ padding: 18, borderRadius: 14, background: '#FFFFFF', border: '1px solid rgba(25,23,32,.09)' }}>
                <Palette className="w-4 h-4" style={{ color: '#00845E', marginBottom: 10 }} />
                <div style={{ fontSize: 22, fontWeight: 800, color: '#191720', textTransform: 'capitalize' }}>{displayProfile.theme}</div>
                <div style={{ fontSize: 12, color: '#6B6675', marginTop: 2 }}>Aktif tema</div>
              </div>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {NAV_ITEMS.filter((n) => n.id !== 'genel').map((n) => (
                <button
                  key={n.id}
                  type="button"
                  onClick={() => setActiveTab(n.id)}
                  style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 12.5, fontWeight: 600, color: '#3A3644', background: '#FFFFFF', border: '1px solid rgba(25,23,32,.12)', borderRadius: 10, padding: '9px 13px', cursor: 'pointer' }}
                >
                  <n.icon className="w-3.5 h-3.5" style={{ color: '#8C8797' }} /> {n.label}
                </button>
              ))}
            </div>
          </div>
        );
      case 'profil':
        return (
          <ProfileEditor
            profile={displayProfile}
            onSave={(fields) => {
              if (fields.custom_bio !== undefined) setPendingBio(fields.custom_bio ?? '');
              if (fields.name !== undefined) setPendingName(fields.name ?? '');
              if (fields.location !== undefined) setPendingLocation(fields.location ?? '');
              if (fields.company !== undefined) setPendingCompany(fields.company ?? '');
              if (fields.blog !== undefined) setPendingBlog(fields.blog ?? '');
              if (fields.rss_url !== undefined) setPendingRssUrl(fields.rss_url ?? '');
              return Promise.resolve();
            }}
          />
        );
      case 'repolar':
        return <RepoSelector repos={repos} onToggleVisibility={handleToggleRepoVisibility} onSetFeatured={handleSetFeaturedRepo} />;
      case 'deneyim':
        return (
          <ExperienceManager
            entries={displayProfile.experience}
            onSaveEntries={(entries) => {
              setPendingExperience(entries);
              return Promise.resolve();
            }}
          />
        );
      case 'bolumler':
        return (
          <SectionVisibilityManager
            visibility={displayProfile.section_visibility}
            onChange={(visibility) => {
              setPendingSectionVisibility(visibility);
              return Promise.resolve();
            }}
          />
        );
      case 'tema':
        return (
          <ThemeSelector
            currentTheme={displayProfile.theme}
            onSelectTheme={(theme) => {
              setPendingTheme(theme);
              return Promise.resolve();
            }}
          />
        );
      case 'baglantilar':
        return (
          <CustomLinksManager
            customLinks={displayProfile.custom_links}
            onSaveLinks={(links) => {
              setPendingCustomLinks(links);
              return Promise.resolve();
            }}
          />
        );
      case 'rozet':
        return <BadgeGenerator username={displayProfile.username} defaultTheme={displayProfile.theme} />;
      case 'analytics':
        return <AnalyticsPanel username={activeUsername} />;
      case 'alanadi':
        return <CustomDomainManager profile={displayProfile} onSaveDomain={handleSaveDomain} onVerify={handleVerifyDomain} />;
      default:
        return null;
    }
  };

  return (
    <div className="dash-root" style={{ display: 'grid', gridTemplateColumns: '224px minmax(0,1fr)', minHeight: '100vh', background: '#F4F1EA', fontFamily: 'var(--font-sans)' }}>
      {/* Yan menü — mobilde gizlenir, alt tab bar devreye girer */}
      <div className="dash-sidebar" style={{ borderRight: '1px solid rgba(25,23,32,.08)', background: '#EBE7DD', padding: '20px 16px', display: 'flex', flexDirection: 'column', gap: 18, position: 'sticky', top: 0, height: '100vh', overflowY: 'auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <KodfolyoLogo size={24} />
          <span style={{ fontSize: 16, fontWeight: 800, letterSpacing: '-.03em', color: '#191720' }}>Kodfolyo</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {NAV_ITEMS.map((n) => {
            const isActive = activeTab === n.id;
            return (
              <button
                key={n.id}
                type="button"
                onClick={() => setActiveTab(n.id)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 9, fontSize: 13.5, fontWeight: isActive ? 700 : 500,
                  padding: '8px 11px', borderRadius: 9, minHeight: 38, cursor: 'pointer', border: 0, textAlign: 'left',
                  color: isActive ? '#1F3AE8' : '#6B6675', background: isActive ? 'rgba(31,58,232,.09)' : 'transparent',
                }}
              >
                <n.icon className="w-3.5 h-3.5" style={{ flexShrink: 0 }} />
                {n.label}
              </button>
            );
          })}
          <Link
            href={`/settings?username=${encodeURIComponent(activeUsername)}`}
            style={{ fontSize: 13.5, fontWeight: 500, padding: '8px 11px', borderRadius: 9, color: '#6B6675', textDecoration: 'none', minHeight: 38, display: 'flex', alignItems: 'center', gap: 9 }}
          >
            <Settings className="w-3.5 h-3.5" /> Ayarlar
          </Link>
        </div>
        <div style={{ marginTop: 'auto', padding: 13, borderRadius: 12, background: '#FFFFFF', border: '1px solid rgba(25,23,32,.09)' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10.5, color: '#8C8797', marginBottom: 6 }}>SON SENKRON</div>
          <div style={{ fontSize: 12.5, color: '#3A3644', marginBottom: 10 }}>
            {profile.updated_at ? new Date(profile.updated_at).toLocaleString('tr-TR') : '—'}
          </div>
          <SyncButton onSync={() => loadData(activeUsername)} />
        </div>
      </div>

      {/* Mobil alt tab bar */}
      <nav className="dash-tabbar" style={{ display: 'none' }}>
        {NAV_ITEMS.map((n) => (
          <button
            key={n.id}
            type="button"
            onClick={() => setActiveTab(n.id)}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 3, minWidth: 60, minHeight: 48, color: activeTab === n.id ? '#1F3AE8' : '#6B6675', background: 'transparent', border: 0, textDecoration: 'none', fontSize: 10, flexShrink: 0, padding: '4px 6px', cursor: 'pointer' }}
          >
            <n.icon className="w-5 h-5" />
            {n.label}
          </button>
        ))}
        <Link
          href={`/settings?username=${encodeURIComponent(activeUsername)}`}
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 3, minWidth: 60, minHeight: 48, color: '#6B6675', textDecoration: 'none', fontSize: 10, flexShrink: 0, padding: '4px 6px' }}
        >
          <Settings className="w-5 h-5" />
          Ayarlar
        </Link>
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

      {/* İçerik — her seferinde sadece seçili sekme gösterilir */}
      <div className="dash-content" style={{ padding: '24px 32px 100px', background: 'radial-gradient(ellipse at 100% 0%, rgba(0,166,118,.07), transparent 50%)' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap', marginBottom: 22 }}>
          <div>
            <h1 style={{ margin: 0, fontSize: 24, fontWeight: 800, letterSpacing: '-.03em', color: '#191720' }}>{activeItem.label}</h1>
            <div style={{ fontSize: 13, color: '#6B6675', marginTop: 4 }}>{activeItem.description}</div>
          </div>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: saveAllSuccess ? '#00845E' : '#6B6675' }}>
              {saveAllSuccess ? '✓ Kaydedildi' : hasPendingChanges ? 'Kaydedilmemiş değişiklikler' : 'Güncel'}
            </span>
            <a
              href={`/${displayProfile.username}`}
              target="_blank"
              style={{ fontFamily: 'var(--font-sans)', fontSize: 13.5, fontWeight: 600, color: '#3A3644', background: 'transparent', border: '1px solid rgba(25,23,32,.16)', borderRadius: 10, padding: '9px 15px', textDecoration: 'none', whiteSpace: 'nowrap' }}
            >
              Önizle
            </a>
            <button
              type="button"
              onClick={handleSaveAll}
              disabled={isSavingAll || !hasPendingChanges}
              className="dash-savebtn-desktop"
              style={{
                display: 'flex', alignItems: 'center', gap: 8, fontFamily: 'var(--font-sans)', fontSize: 13.5, fontWeight: 700,
                color: '#F4F1EA', background: '#1F3AE8', border: 0, borderRadius: 10, padding: '9px 18px', cursor: 'pointer',
                whiteSpace: 'nowrap', opacity: isSavingAll || !hasPendingChanges ? 0.5 : 1, minHeight: 40,
              }}
            >
              {isSavingAll ? <CheckCircle2 className="w-4 h-4 animate-pulse" /> : <Save className="w-4 h-4" />}
              Kaydet
            </button>
          </div>
        </div>

        <div className={showLivePreview ? 'dash-split' : undefined} style={{ display: 'grid', gridTemplateColumns: showLivePreview ? 'minmax(0,1fr) 440px' : 'minmax(0,1fr)', gap: 32, alignItems: 'start' }}>
          <div style={{ minWidth: 0 }}>
            {renderTabContent()}
          </div>
          {showLivePreview && (
            <div className="dash-preview">
              <LivePortfolioPreview profile={displayProfile} repos={repos} />
            </div>
          )}
        </div>
      </div>

      <style>{`
        @media (max-width: 1320px) {
          .dash-split { grid-template-columns: 1fr !important; }
          .dash-preview { display: none !important; }
        }
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
