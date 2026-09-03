'use client';

import { useState, Suspense, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { useSearchParams, useRouter } from 'next/navigation';
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
import SettingsPanel from '@/components/dashboard/SettingsPanel';
import LivePortfolioPreview from '@/components/dashboard/LivePortfolioPreview';
import { KodfolyoLogo } from '@/components/icons/KodfolyoLogo';
import { UserProfile, Repository, ThemeType, CustomLink, ExperienceEntry, SectionVisibility } from '@/types';
import { sanitizeUsername } from '@/lib/github/fetcher';
import {
  Save, LayoutGrid, User, FolderGit2, Palette, Link2, Briefcase, Layers, BadgeCheck, Settings,
  BarChart3, Globe2, Star, ExternalLink, Check, Minus, RefreshCw,
} from 'lucide-react';

type TabId = 'genel' | 'profil' | 'repolar' | 'deneyim' | 'bolumler' | 'tema' | 'baglantilar' | 'rozet' | 'analytics' | 'alanadi';

const TABS: { id: TabId; label: string; title: string; description: string; icon: typeof LayoutGrid }[] = [
  { id: 'genel', label: 'Genel', title: 'Genel bakış', description: 'Portfolyonun mevcut durumu ve hızlı geçişler.', icon: LayoutGrid },
  { id: 'profil', label: 'Profil', title: 'Profil', description: 'Portfolyonun üstünde görünen temel bilgiler.', icon: User },
  { id: 'repolar', label: 'Repolar', title: 'Repolar', description: 'Yayınlanacak depolar ve vitrin projesi.', icon: FolderGit2 },
  { id: 'deneyim', label: 'Deneyim', title: 'Deneyim', description: 'İş ve eğitim geçmişi.', icon: Briefcase },
  { id: 'bolumler', label: 'Bölümler', title: 'Bölümler', description: 'Portfolyo sayfasındaki blokları aç veya kapat.', icon: Layers },
  { id: 'tema', label: 'Tema', title: 'Tema', description: 'Portfolyonun renk şeması.', icon: Palette },
  { id: 'baglantilar', label: 'Linkler', title: 'Bağlantılar', description: 'Profilinin altında görünecek bağlantılar.', icon: Link2 },
  { id: 'rozet', label: 'Rozet', title: 'Rozet', description: "README'ne gömülebilen canlı rozet.", icon: BadgeCheck },
  { id: 'analytics', label: 'Analiz', title: 'Analytics', description: 'Son 30 günün trafik ve etkileşim özeti.', icon: BarChart3 },
  { id: 'alanadi', label: 'Alan adı', title: 'Alan Adı', description: 'Portfolyonu kendi alan adında yayınla.', icon: Globe2 },
];

const NO_PREVIEW_TABS: TabId[] = ['analytics', 'alanadi'];

function DashboardContent() {
  const { data: session } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [activeTab, setActiveTab] = useState<TabId | 'ayarlar'>('genel');
  const [activeUsername, setActiveUsername] = useState<string>('');
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [repos, setRepos] = useState<Repository[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewport, setViewport] = useState({ w: 1440, h: 900 });

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
  const [saveStatus, setSaveStatus] = useState<'saved' | 'justSaved'>('saved');

  const [badgeSize, setBadgeSize] = useState<'sm' | 'md' | 'lg'>('md');
  const [badgeTheme, setBadgeTheme] = useState<ThemeType>('gece');

  const savedTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

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

  const status: 'saved' | 'dirty' | 'justSaved' = hasPendingChanges ? 'dirty' : saveStatus;

  useEffect(() => {
    const onResize = () => setViewport({ w: window.innerWidth, h: window.innerHeight });
    onResize();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

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
            if (data.profile) {
              setProfile(data.profile);
              setBadgeTheme(data.profile.theme);
            }
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
              if (fbData.profile) {
                setProfile(fbData.profile);
                setBadgeTheme(fbData.profile.theme);
              }
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
        setSaveStatus('justSaved');
        clearTimeout(savedTimer.current);
        savedTimer.current = setTimeout(() => setSaveStatus('saved'), 1800);
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

  const handleTogglePublish = async (nextPublished: boolean) => {
    try {
      await fetch('/api/profile/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: activeUsername, isPublished: nextPublished }),
      });
      setProfile((prev) => (prev ? { ...prev, is_published: nextPublished } : prev));
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      await fetch('/api/profile/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: activeUsername, deleteAccount: true }),
      });
      if (typeof window !== 'undefined') localStorage.removeItem('kodfolyo_active_username');
      router.push('/');
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
    ...(pendingRssUrl !== null && { rss_url: pendingRssUrl }),
    ...(pendingCustomLinks !== null && { custom_links: pendingCustomLinks }),
    ...(pendingExperience !== null && { experience: pendingExperience }),
    ...(pendingSectionVisibility !== null && { section_visibility: pendingSectionVisibility }),
  };

  const visibleRepos = repos.filter((r) => r.is_visible !== false);
  const starCount = repos.reduce((sum, r) => sum + (r.stargazers_count || 0), 0);
  const showcase = repos.find((r) => r.is_featured);
  const activeTabDef = activeTab === 'ayarlar'
    ? { title: 'Ayarlar', description: 'Hesap, veri ve yayın durumu.' }
    : TABS.find((t) => t.id === activeTab)!;

  // ─── Sağdaki canlı önizleme paneli için yerleşim matematiği ───────────────
  // Kaynak: Design'in "Kodfolyo Dashboard v2" dosyasındaki responsive kurallar.
  const desktop = viewport.w >= 1024;
  const wide = viewport.w >= 1180;
  const inline = !wide && viewport.w >= 640;
  const showPreview = activeTab !== 'ayarlar' && !NO_PREVIEW_TABS.includes(activeTab as TabId) && (wide || inline);
  const paneW = Math.round(Math.min(760, Math.max(430, (viewport.w - 74) * 0.46)));
  const colW = Math.min(660, viewport.w - (desktop ? 74 : 0) - 44);
  const frameW = wide ? paneW - 34 : colW;
  const headerH = 62;
  const frameH = wide ? Math.max(320, viewport.h - headerH - 60) : 520;

  const renderTabContent = () => {
    switch (activeTab) {
      case 'genel': {
        const setupItems = [
          { key: 'bio', label: 'Biyografi yazıldı', ok: !!displayProfile.custom_bio?.trim(), tab: 'profil' as TabId },
          { key: 'showcase', label: 'Vitrin projesi seçildi', ok: !!showcase, tab: 'repolar' as TabId },
          { key: 'links', label: 'En az bir bağlantı eklendi', ok: displayProfile.custom_links.length > 0, tab: 'baglantilar' as TabId },
          { key: 'exp', label: 'Deneyim kaydı girildi', ok: displayProfile.experience.length > 0, tab: 'deneyim' as TabId },
          { key: 'domain', label: 'Özel alan adı doğrulandı', ok: !!displayProfile.custom_domain && displayProfile.custom_domain_verified === true, tab: 'alanadi' as TabId },
        ];
        const doneCount = setupItems.filter((c) => c.ok).length;

        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ background: '#FFFFFF', border: '1px solid rgba(25,23,32,.09)', borderRadius: 12, padding: 16, display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ position: 'relative', width: 46, height: 46, borderRadius: '50%', overflow: 'hidden', flexShrink: 0, background: '#EBE7DD' }}>
                <Image src={displayProfile.avatar_url} alt={displayProfile.username} fill className="object-cover" />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 15, fontWeight: 600, letterSpacing: '-.015em' }}>{displayProfile.name || displayProfile.username}</div>
                <a href={`/${displayProfile.username}`} target="_blank" style={{ fontFamily: 'var(--font-mono)', fontSize: 11.5 }}>
                  kodfolyo.dev/{displayProfile.username}
                </a>
              </div>
              {displayProfile.is_published === false && (
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10.5, padding: '4px 9px', borderRadius: 6, background: 'rgba(198,49,78,.10)', color: '#C6314E' }}>yayında değil</span>
              )}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
              <div style={{ background: '#FFFFFF', border: '1px solid rgba(25,23,32,.09)', borderRadius: 12, padding: '13px 14px' }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9.5, letterSpacing: '.07em', textTransform: 'uppercase', color: '#8C8797' }}>Görünür repo</div>
                <div style={{ marginTop: 6, fontSize: 21, fontWeight: 600, letterSpacing: '-.03em' }}>{visibleRepos.length}</div>
              </div>
              <div style={{ background: '#FFFFFF', border: '1px solid rgba(25,23,32,.09)', borderRadius: 12, padding: '13px 14px' }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9.5, letterSpacing: '.07em', textTransform: 'uppercase', color: '#8C8797' }}>Toplam yıldız</div>
                <div style={{ marginTop: 6, fontSize: 21, fontWeight: 600, letterSpacing: '-.03em' }}>{starCount.toLocaleString('tr-TR')}</div>
              </div>
              <div style={{ background: '#FFFFFF', border: '1px solid rgba(25,23,32,.09)', borderRadius: 12, padding: '13px 14px' }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9.5, letterSpacing: '.07em', textTransform: 'uppercase', color: '#8C8797' }}>Aktif tema</div>
                <div style={{ marginTop: 6, fontSize: 21, fontWeight: 600, letterSpacing: '-.03em', textTransform: 'capitalize' }}>{displayProfile.theme}</div>
              </div>
            </div>

            <div style={{ background: '#FFFFFF', border: '1px solid rgba(25,23,32,.09)', borderRadius: 12, overflow: 'hidden' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, padding: '12px 16px', borderBottom: '1px solid rgba(25,23,32,.09)' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9.5, letterSpacing: '.07em', textTransform: 'uppercase', color: '#8C8797' }}>Kurulum</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: '#6B6675' }}>{doneCount}/{setupItems.length} tamam</span>
              </div>
              {setupItems.map((c) => (
                <div key={c.key} style={{ display: 'flex', alignItems: 'center', gap: 11, padding: '10px 16px', borderBottom: '1px solid rgba(25,23,32,.06)' }}>
                  <span style={{ display: 'grid', placeItems: 'center', width: 19, height: 19, borderRadius: '50%', flexShrink: 0, background: c.ok ? 'rgba(0,166,118,.14)' : 'rgba(25,23,32,.06)', color: c.ok ? '#00845E' : '#8C8797' }}>
                    {c.ok ? <Check className="w-3 h-3" /> : <Minus className="w-3 h-3" />}
                  </span>
                  <span style={{ flex: 1, minWidth: 0, fontSize: 12.5, color: c.ok ? '#56515F' : '#191720' }}>{c.label}</span>
                  <button
                    onClick={() => setActiveTab(c.tab)}
                    style={{ height: 26, padding: '0 10px', border: '1px solid rgba(25,23,32,.12)', borderRadius: 7, background: '#FBF9F4', fontSize: 11.5, fontWeight: 500, color: '#56515F', cursor: 'pointer', flexShrink: 0 }}
                  >
                    {TABS.find((t) => t.id === c.tab)!.label}
                  </button>
                </div>
              ))}
            </div>

            <div style={{ background: '#FFFFFF', border: '1px solid rgba(25,23,32,.09)', borderRadius: 12, padding: '15px 16px' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9.5, letterSpacing: '.07em', textTransform: 'uppercase', color: '#8C8797', marginBottom: 10 }}>Hızlı geçiş</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {TABS.filter((t) => t.id !== 'genel').concat([{ id: 'ayarlar' as TabId, label: 'Ayarlar', title: '', description: '', icon: Settings }]).map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setActiveTab(t.id)}
                    style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 11px', border: '1px solid rgba(25,23,32,.09)', borderRadius: 8, background: '#FBF9F4', color: '#56515F', fontSize: 12, fontWeight: 500, cursor: 'pointer' }}
                  >
                    <t.icon className="w-3.5 h-3.5" style={{ opacity: 0.7 }} /> {t.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        );
      }
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
        return <BadgeGenerator username={displayProfile.username} size={badgeSize} theme={badgeTheme} onSizeChange={setBadgeSize} onThemeChange={setBadgeTheme} />;
      case 'analytics':
        return <AnalyticsPanel username={activeUsername} />;
      case 'alanadi':
        return <CustomDomainManager profile={displayProfile} onSaveDomain={handleSaveDomain} onVerify={handleVerifyDomain} />;
      case 'ayarlar':
        return <SettingsPanel profile={displayProfile} onTogglePublish={handleTogglePublish} onDeleteAccount={handleDeleteAccount} />;
      default:
        return null;
    }
  };

  const statusMap = {
    saved: { text: 'Güncel', bg: 'rgba(25,23,32,.055)', fg: '#6B6675' },
    dirty: { text: 'Kaydedilmemiş', bg: 'rgba(180,83,31,.12)', fg: '#B4531F' },
    justSaved: { text: '✓ Kaydedildi', bg: 'rgba(0,166,118,.12)', fg: '#00845E' },
  } as const;
  const st = statusMap[status];

  return (
    <div className="dash-root" style={{ height: '100vh', display: 'flex', overflow: 'hidden', background: '#F4F1EA', color: '#191720', fontFamily: 'var(--font-sans)' }}>
      {/* İkon rayı — mobilde gizlenir, alt tab bar devreye girer */}
      <nav className="dash-sidebar" style={{ flex: '0 0 74px', width: 74, height: '100vh', background: '#EBE7DD', borderRight: '1px solid rgba(25,23,32,.09)', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '14px 0 12px', gap: 2 }}>
        <div style={{ marginBottom: 14 }}>
          <KodfolyoLogo size={32} />
        </div>
        {TABS.map((t) => {
          const isActive = activeTab === t.id;
          return (
            <button
              key={t.id}
              type="button"
              title={t.title}
              onClick={() => setActiveTab(t.id)}
              style={{
                width: 62, padding: '7px 2px 6px', border: 0, borderRadius: 10, cursor: 'pointer',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
                background: isActive ? '#FFFFFF' : 'transparent', color: isActive ? '#191720' : '#6B6675',
              }}
            >
              <t.icon className="w-[18px] h-[18px]" />
              <span style={{ fontSize: 9.5, fontWeight: 500, letterSpacing: '-.01em', lineHeight: 1.1, textAlign: 'center' }}>{t.label}</span>
            </button>
          );
        })}
        <div style={{ flex: 1 }} />
        <button
          onClick={() => loadData(activeUsername)}
          title="Senkronize et"
          style={{ width: 62, padding: '8px 2px', border: '1px solid rgba(25,23,32,.09)', borderRadius: 10, background: '#FBF9F4', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, color: '#56515F' }}
        >
          <RefreshCw className="w-4 h-4" />
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: '#8C8797' }}>
            {profile.updated_at ? new Date(profile.updated_at).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }) : '—'}
          </span>
        </button>
        <button
          type="button"
          title="Ayarlar"
          onClick={() => setActiveTab('ayarlar')}
          style={{
            width: 62, marginTop: 6, padding: '7px 2px 6px', border: 0, borderRadius: 10, cursor: 'pointer',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
            background: activeTab === 'ayarlar' ? '#FFFFFF' : 'transparent', color: activeTab === 'ayarlar' ? '#191720' : '#6B6675',
          }}
        >
          <Settings className="w-[18px] h-[18px]" />
          <span style={{ fontSize: 9.5, fontWeight: 500 }}>Ayarlar</span>
        </button>
      </nav>

      <section style={{ flex: 1, minWidth: 0, height: '100vh', display: 'flex', flexDirection: 'column' }}>
        <header style={{ flex: '0 0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, padding: '13px 22px', borderBottom: '1px solid rgba(25,23,32,.09)', background: '#F4F1EA' }}>
          <div style={{ minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
              <h1 style={{ margin: 0, fontSize: 17, fontWeight: 600, letterSpacing: '-.02em' }}>{activeTabDef.title}</h1>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10.5, padding: '3px 8px', borderRadius: 6, background: st.bg, color: st.fg }}>{st.text}</span>
            </div>
            <p style={{ margin: '3px 0 0', fontSize: 12, color: '#8C8797', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{activeTabDef.description}</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: '0 0 auto' }}>
            <a
              href={`/${displayProfile.username}`}
              target="_blank"
              rel="noreferrer"
              className="dash-open-btn"
              style={{ display: 'flex', alignItems: 'center', gap: 6, height: 34, padding: '0 12px', border: '1px solid rgba(25,23,32,.16)', borderRadius: 8, background: '#FFFFFF', color: '#191720', fontSize: 12.5, fontWeight: 500, textDecoration: 'none' }}
            >
              <ExternalLink className="w-3.5 h-3.5" /> Aç
            </a>
            <button
              type="button"
              onClick={handleSaveAll}
              disabled={isSavingAll || !hasPendingChanges}
              className="dash-save-btn"
              style={{ height: 34, padding: '0 16px', border: 0, borderRadius: 8, background: '#1F3AE8', color: '#FFFFFF', fontSize: 12.5, fontWeight: 500, cursor: 'pointer', opacity: isSavingAll || !hasPendingChanges ? 0.5 : 1 }}
            >
              Kaydet
            </button>
          </div>
        </header>

        <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: wide ? 'row' : 'column', overflowY: wide ? 'hidden' : 'auto' }}>
          <div style={{ flex: wide ? '1' : '0 0 auto', minWidth: 0, minHeight: 0, overflowY: wide ? 'auto' : 'visible', padding: '20px 22px 24px' }}>
            <div style={{ maxWidth: colW }}>{renderTabContent()}</div>
          </div>

          {showPreview && (
            <aside
              className="dash-preview"
              style={{
                flex: '0 0 auto', display: 'flex', flexDirection: 'column', background: '#EBE7DD',
                width: wide ? paneW : '100%', height: wide ? '100%' : 620,
                borderLeft: wide ? '1px solid rgba(25,23,32,.09)' : 0,
                borderTop: wide ? 0 : '1px solid rgba(25,23,32,.09)',
              }}
            >
              <LivePortfolioPreview
                profile={displayProfile}
                repos={repos}
                frameWidth={frameW}
                frameHeight={frameH}
                badgeMode={activeTab === 'rozet'}
                badgeTheme={badgeTheme}
                badgeSize={badgeSize}
              />
            </aside>
          )}
        </div>
      </section>

      {/* Mobil alt tab bar */}
      <nav className="dash-tabbar" style={{ display: 'none' }}>
        {hasPendingChanges && (
          <div className="dash-savebar" style={{ padding: '9px 12px', background: '#FBF9F4', borderBottom: '1px solid rgba(25,23,32,.09)' }}>
            <button
              onClick={handleSaveAll}
              disabled={isSavingAll}
              style={{ width: '100%', height: 40, border: 0, borderRadius: 9, background: '#1F3AE8', color: '#FFFFFF', fontSize: 13.5, fontWeight: 500, cursor: 'pointer', opacity: isSavingAll ? 0.6 : 1 }}
            >
              Kaydet
            </button>
          </div>
        )}
        <div style={{ display: 'flex', gap: 2, overflowX: 'auto', padding: '6px 8px' }}>
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setActiveTab(t.id)}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, padding: '6px 10px', border: 0, borderRadius: 8, background: 'transparent', cursor: 'pointer', flexShrink: 0, color: activeTab === t.id ? '#1F3AE8' : '#8C8797' }}
            >
              <t.icon className="w-[18px] h-[18px]" />
              <span style={{ fontSize: 10, fontWeight: 500, whiteSpace: 'nowrap' }}>{t.label}</span>
            </button>
          ))}
          <button
            type="button"
            onClick={() => setActiveTab('ayarlar')}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, padding: '6px 10px', border: 0, borderRadius: 8, background: 'transparent', cursor: 'pointer', flexShrink: 0, color: activeTab === 'ayarlar' ? '#1F3AE8' : '#8C8797' }}
          >
            <Settings className="w-[18px] h-[18px]" />
            <span style={{ fontSize: 10, fontWeight: 500 }}>Ayarlar</span>
          </button>
        </div>
      </nav>

      <style>{`
        @media (max-width: 1023px) {
          .dash-sidebar { display: none !important; }
          .dash-root { flex-direction: column !important; height: auto !important; min-height: 100vh; overflow: visible !important; }
          .dash-tabbar { display: block !important; position: sticky; bottom: 0; background: #EBE7DD; border-top: 1px solid rgba(25,23,32,.09); z-index: 50; }
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
