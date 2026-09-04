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
import ManualProjectsManager from '@/components/dashboard/ManualProjectsManager';
import CertificatesManager from '@/components/dashboard/CertificatesManager';
import SectionVisibilityManager from '@/components/dashboard/SectionVisibilityManager';
import BadgeGenerator from '@/components/dashboard/BadgeGenerator';
import AnalyticsPanel from '@/components/dashboard/AnalyticsPanel';
import CustomDomainManager from '@/components/dashboard/CustomDomainManager';
import SettingsPanel from '@/components/dashboard/SettingsPanel';
import LivePortfolioPreview from '@/components/dashboard/LivePortfolioPreview';
import { KodfolyoLogo } from '@/components/icons/KodfolyoLogo';
import { UserProfile, Repository, ThemeType, CustomLink, ExperienceEntry, ManualProject, Certificate, SectionVisibility } from '@/types';
import { sanitizeUsername } from '@/lib/github/fetcher';
import { themes } from '@/lib/theme';
import {
  Save, Star, ExternalLink, Check, Minus, FolderGit2, Award,
} from 'lucide-react';

type TabId = 'genel' | 'profil' | 'repolar' | 'deneyim' | 'projeler' | 'sertifikalar' | 'bolumler' | 'tema' | 'baglantilar' | 'rozet' | 'analytics' | 'alanadi';

// Elle çizilmiş pixel-art ikonlar (public/icons) — dashboard'un tamamında
// lucide yerine bunlar kullanılıyor.
const TABS: { id: TabId; label: string; title: string; description: string; iconSrc?: string; icon?: typeof FolderGit2 }[] = [
  { id: 'genel', label: 'Genel', title: 'Genel bakış', description: 'Portfolyonun mevcut durumu ve hızlı geçişler.', iconSrc: '/icons/genel.png' },
  { id: 'profil', label: 'Profil', title: 'Profil', description: 'Portfolyonun üstünde görünen temel bilgiler.', iconSrc: '/icons/profil.png' },
  { id: 'repolar', label: 'Repolar', title: 'Repolar', description: 'Yayınlanacak depolar ve vitrin projesi.', iconSrc: '/icons/repolar.png' },
  { id: 'deneyim', label: 'Deneyim', title: 'Deneyim', description: 'İş ve eğitim geçmişi.', iconSrc: '/icons/deneyim.png' },
  // Not: bu ikisinin piksel-art ikonu henüz yok (public/icons setinde karşılığı yok),
  // geçici olarak lucide ikonu kullanılıyor — set tamamlanınca iconSrc'ye geçirilebilir.
  { id: 'projeler', label: 'Projeler', title: 'Diğer Projeler', description: 'GitHub dışı, elle eklediğin projeler.', icon: FolderGit2 },
  { id: 'sertifikalar', label: 'Sertifika', title: 'Sertifikalar', description: 'Eklediğin sertifikaların listesi.', icon: Award },
  { id: 'bolumler', label: 'Bölümler', title: 'Bölümler', description: 'Portfolyo sayfasındaki blokları aç veya kapat.', iconSrc: '/icons/bolumler.png' },
  { id: 'tema', label: 'Tema', title: 'Tema', description: 'Portfolyonun renk şeması.', iconSrc: '/icons/tema.png' },
  { id: 'baglantilar', label: 'Linkler', title: 'Bağlantılar', description: 'Profilinin altında görünecek bağlantılar.', iconSrc: '/icons/linkler.png' },
  { id: 'rozet', label: 'Rozet', title: 'Rozet', description: "README'ne gömülebilen canlı rozet.", iconSrc: '/icons/rozet.png' },
  { id: 'analytics', label: 'Analiz', title: 'Analytics', description: 'Son 30 günün trafik ve etkileşim özeti.', iconSrc: '/icons/analiz.png' },
  { id: 'alanadi', label: 'Alan adı', title: 'Alan Adı', description: 'Portfolyonu kendi alan adında yayınla.', iconSrc: '/icons/alanadi.png' },
];

const AYARLAR_ICON = '/icons/ayarlar.png';
const SENKRON_ICON = '/icons/senkron.png';
const SIDEBAR_W = 86; // ikon rayı genişliği — küçük/sıkışık durmasın diye 74'ten büyütüldü

function TabIcon({ tab, size, opacity }: { tab: { iconSrc?: string; icon?: typeof FolderGit2 }; size: number; opacity?: number }) {
  if (!tab.iconSrc && tab.icon) {
    const Icon = tab.icon;
    return (
      <span style={{ display: 'inline-flex', width: size, height: size, flexShrink: 0, opacity }}>
        <Icon style={{ width: size * 0.72, height: size * 0.72, margin: 'auto' }} />
      </span>
    );
  }
  return (
    <span style={{ position: 'relative', display: 'inline-block', width: size, height: size, flexShrink: 0, opacity }}>
      <Image src={tab.iconSrc!} alt="" fill sizes={`${size}px`} style={{ objectFit: 'contain' }} />
    </span>
  );
}

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
  const [pendingSeoTitle, setPendingSeoTitle] = useState<string | null>(null);
  const [pendingSeoDescription, setPendingSeoDescription] = useState<string | null>(null);
  const [pendingCustomLinks, setPendingCustomLinks] = useState<CustomLink[] | null>(null);
  const [pendingExperience, setPendingExperience] = useState<ExperienceEntry[] | null>(null);
  const [pendingManualProjects, setPendingManualProjects] = useState<ManualProject[] | null>(null);
  const [pendingCertificates, setPendingCertificates] = useState<Certificate[] | null>(null);
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
    pendingSeoTitle !== null ||
    pendingSeoDescription !== null ||
    pendingCustomLinks !== null ||
    pendingExperience !== null ||
    pendingManualProjects !== null ||
    pendingCertificates !== null ||
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
    if (pendingSeoTitle !== null) payload.seo_title = pendingSeoTitle;
    if (pendingSeoDescription !== null) payload.seo_description = pendingSeoDescription;
    if (pendingCustomLinks !== null) payload.custom_links = pendingCustomLinks;
    if (pendingExperience !== null) payload.experience = pendingExperience;
    if (pendingManualProjects !== null) payload.manual_projects = pendingManualProjects;
    if (pendingCertificates !== null) payload.certificates = pendingCertificates;
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
            ...(pendingSeoTitle !== null && { seo_title: pendingSeoTitle }),
            ...(pendingSeoDescription !== null && { seo_description: pendingSeoDescription }),
            ...(pendingCustomLinks !== null && { custom_links: pendingCustomLinks }),
            ...(pendingExperience !== null && { experience: pendingExperience }),
            ...(pendingManualProjects !== null && { manual_projects: pendingManualProjects }),
            ...(pendingCertificates !== null && { certificates: pendingCertificates }),
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
        setPendingSeoTitle(null);
        setPendingSeoDescription(null);
        setPendingCustomLinks(null);
        setPendingExperience(null);
        setPendingManualProjects(null);
        setPendingCertificates(null);
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
      <div style={{ minHeight: '100vh', background: '#F9FAFB', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 22, height: 22, border: '2px solid #18181B', borderTopColor: 'transparent', borderRadius: '50%' }} className="animate-spin" />
          <p style={{ fontSize: 13, color: '#71717A' }}>@{activeUsername || 'erdemsnsy'} profil verileri yükleniyor...</p>
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
    ...(pendingSeoTitle !== null && { seo_title: pendingSeoTitle }),
    ...(pendingSeoDescription !== null && { seo_description: pendingSeoDescription }),
    ...(pendingCustomLinks !== null && { custom_links: pendingCustomLinks }),
    ...(pendingExperience !== null && { experience: pendingExperience }),
    ...(pendingManualProjects !== null && { manual_projects: pendingManualProjects }),
    ...(pendingCertificates !== null && { certificates: pendingCertificates }),
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
  // 38/62 split: sol düzenleme kolonu ~%38, sağ canlı önizleme ~%62.
  const paneW = Math.round(Math.min(900, Math.max(460, (viewport.w - SIDEBAR_W) * 0.62)));
  const colW = Math.min(576, viewport.w - (desktop ? SIDEBAR_W : 0) - 44);
  const frameW = wide ? paneW - 90 : colW; // 90 = önizleme mockup'ın yanal iç boşluğu (28px*2 + kenarlık payı)
  // Önizleme yoksa (Analiz, Alan adı, Ayarlar) içerik kolonu 576px'e sıkışmasın —
  // sağda dolduracak panel olmadığı için tüm genişliği kullansın.
  const contentMaxW = showPreview ? colW : Math.min(1040, viewport.w - (desktop ? SIDEBAR_W : 0) - 44);
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

        const portfolioUrl = `kodfolyo.dev/${displayProfile.username}`;
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ background: '#FFFFFF', border: '1px solid rgba(228,228,231,.8)', borderRadius: 18, boxShadow: '0 1px 2px 0 rgba(0,0,0,0.04)', padding: 20, display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{ position: 'relative', width: 58, height: 58, borderRadius: '50%', overflow: 'hidden', flexShrink: 0, background: '#F4F4F5' }}>
                <Image src={displayProfile.avatar_url} alt={displayProfile.username} fill className="object-cover" />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 17, fontWeight: 600, letterSpacing: '-.015em' }}>{displayProfile.name || displayProfile.username}</div>
                <a href={`/${displayProfile.username}`} target="_blank" style={{ fontFamily: 'var(--font-mono)', fontSize: 12.5 }}>
                  {portfolioUrl}
                </a>
              </div>
              {displayProfile.is_published === false && (
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10.5, padding: '4px 9px', borderRadius: 6, background: 'rgba(198,49,78,.10)', color: '#C6314E' }}>yayında değil</span>
              )}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
              <div style={{ background: '#FFFFFF', border: '1px solid rgba(228,228,231,.8)', borderRadius: 16, boxShadow: '0 1px 2px 0 rgba(0,0,0,0.04)', padding: '18px 18px' }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9.5, letterSpacing: '.07em', textTransform: 'uppercase', color: '#A1A1AA' }}>Görünür repo</div>
                <div style={{ marginTop: 8, fontSize: 28, fontWeight: 700, letterSpacing: '-.03em' }}>{visibleRepos.length}</div>
              </div>
              <div style={{ background: '#FFFFFF', border: '1px solid rgba(228,228,231,.8)', borderRadius: 16, boxShadow: '0 1px 2px 0 rgba(0,0,0,0.04)', padding: '18px 18px' }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9.5, letterSpacing: '.07em', textTransform: 'uppercase', color: '#A1A1AA' }}>Toplam yıldız</div>
                <div style={{ marginTop: 8, fontSize: 28, fontWeight: 700, letterSpacing: '-.03em' }}>{starCount.toLocaleString('tr-TR')}</div>
              </div>
              <div style={{ background: '#FFFFFF', border: '1px solid rgba(228,228,231,.8)', borderRadius: 16, boxShadow: '0 1px 2px 0 rgba(0,0,0,0.04)', padding: '18px 18px' }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9.5, letterSpacing: '.07em', textTransform: 'uppercase', color: '#A1A1AA' }}>Aktif tema</div>
                <div style={{ marginTop: 8, fontSize: 28, fontWeight: 700, letterSpacing: '-.03em', textTransform: 'capitalize' }}>{themes[displayProfile.theme]?.name || displayProfile.theme}</div>
              </div>
            </div>

            <div style={{ background: '#FFFFFF', border: '1px solid rgba(228,228,231,.8)', borderRadius: 18, boxShadow: '0 1px 2px 0 rgba(0,0,0,0.04)', overflow: 'hidden' }}>
              <div style={{ padding: '16px 20px 12px', borderBottom: '1px solid rgba(228,228,231,.09)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '.07em', textTransform: 'uppercase', color: '#A1A1AA' }}>Kurulum</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11.5, color: '#71717A' }}>{doneCount}/{setupItems.length} tamam</span>
                </div>
                <p style={{ margin: '6px 0 0', fontSize: 11.5, color: '#A1A1AA' }}>
                  Bir maddeyi tamamlayınca yanındaki daire <span style={{ color: '#00845E', fontWeight: 600 }}>yeşile</span> döner.
                </p>
              </div>
              {setupItems.map((c) => (
                <div key={c.key} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '13px 20px', borderBottom: '1px solid rgba(228,228,231,.06)' }}>
                  <span style={{ display: 'grid', placeItems: 'center', width: 22, height: 22, borderRadius: '50%', flexShrink: 0, background: c.ok ? 'rgba(0,166,118,.14)' : 'rgba(228,228,231,.5)', color: c.ok ? '#00845E' : '#A1A1AA' }}>
                    {c.ok ? <Check className="w-3.5 h-3.5" /> : <Minus className="w-3.5 h-3.5" />}
                  </span>
                  <span style={{ flex: 1, minWidth: 0, fontSize: 13.5, color: c.ok ? '#52525B' : '#18181B' }}>{c.label}</span>
                  <button
                    onClick={() => setActiveTab(c.tab)}
                    className="hover:bg-zinc-100 transition-colors"
                    style={{ height: 28, padding: '0 12px', border: '1px solid rgba(228,228,231,.12)', borderRadius: 7, background: '#FAFAFA', fontSize: 12, fontWeight: 500, color: '#52525B', cursor: 'pointer', flexShrink: 0 }}
                  >
                    {TABS.find((t) => t.id === c.tab)!.label}
                  </button>
                </div>
              ))}
            </div>

            <div style={{ background: '#FFFFFF', border: '1px solid rgba(228,228,231,.8)', borderRadius: 18, boxShadow: '0 1px 2px 0 rgba(0,0,0,0.04)', padding: '18px 20px' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '.07em', textTransform: 'uppercase', color: '#A1A1AA', marginBottom: 12 }}>Portfolyonu paylaş</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: 6, borderRadius: 10, border: '1px solid #E4E4E7', background: '#FAFAFA' }}>
                <span style={{ flex: 1, minWidth: 0, fontFamily: 'var(--font-mono)', fontSize: 13, color: '#18181B', padding: '0 8px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{portfolioUrl}</span>
                <button
                  onClick={() => { if (typeof navigator !== 'undefined') navigator.clipboard.writeText(`https://${portfolioUrl}`); }}
                  className="hover:bg-zinc-800 transition-colors"
                  style={{ flexShrink: 0, height: 32, padding: '0 14px', borderRadius: 8, background: '#18181B', color: '#FFFFFF', fontSize: 12.5, fontWeight: 500, border: 0, cursor: 'pointer' }}
                >
                  Kopyala
                </button>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginTop: 10 }}>
                <a href={`https://api.whatsapp.com/send?text=${encodeURIComponent(`https://${portfolioUrl}`)}`} target="_blank" rel="noopener noreferrer" className="hover:bg-zinc-50 transition-colors" style={{ textAlign: 'center', padding: '9px 0', borderRadius: 9, border: '1px solid #E4E4E7', fontSize: 12.5, fontWeight: 500, color: '#52525B', textDecoration: 'none' }}>WhatsApp</a>
                <a href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(`https://${portfolioUrl}`)}`} target="_blank" rel="noopener noreferrer" className="hover:bg-zinc-50 transition-colors" style={{ textAlign: 'center', padding: '9px 0', borderRadius: 9, border: '1px solid #E4E4E7', fontSize: 12.5, fontWeight: 500, color: '#52525B', textDecoration: 'none' }}>X</a>
                <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(`https://${portfolioUrl}`)}`} target="_blank" rel="noopener noreferrer" className="hover:bg-zinc-50 transition-colors" style={{ textAlign: 'center', padding: '9px 0', borderRadius: 9, border: '1px solid #E4E4E7', fontSize: 12.5, fontWeight: 500, color: '#52525B', textDecoration: 'none' }}>LinkedIn</a>
              </div>
            </div>

            <div style={{ background: '#FFFFFF', border: '1px solid rgba(228,228,231,.8)', borderRadius: 18, boxShadow: '0 1px 2px 0 rgba(0,0,0,0.04)', padding: '18px 20px' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '.07em', textTransform: 'uppercase', color: '#A1A1AA', marginBottom: 12 }}>Hızlı geçiş</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {TABS.filter((t) => t.id !== 'genel').concat([{ id: 'ayarlar' as TabId, label: 'Ayarlar', title: '', description: '', iconSrc: AYARLAR_ICON }]).map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setActiveTab(t.id)}
                    className="hover:bg-zinc-100 transition-colors"
                    style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '8px 13px', border: '1px solid rgba(228,228,231,.09)', borderRadius: 9, background: '#FAFAFA', color: '#52525B', fontSize: 12.5, fontWeight: 500, cursor: 'pointer' }}
                  >
                    <TabIcon tab={t} size={16} opacity={0.8} /> {t.label}
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
              if (fields.seo_title !== undefined) setPendingSeoTitle(fields.seo_title ?? '');
              if (fields.seo_description !== undefined) setPendingSeoDescription(fields.seo_description ?? '');
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
      case 'projeler':
        return (
          <ManualProjectsManager
            projects={displayProfile.manual_projects}
            onSaveProjects={(projects) => {
              setPendingManualProjects(projects);
              return Promise.resolve();
            }}
          />
        );
      case 'sertifikalar':
        return (
          <CertificatesManager
            certificates={displayProfile.certificates}
            onSaveCertificates={(certificates) => {
              setPendingCertificates(certificates);
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
    saved: { text: 'Güncel', bg: '#FAFAFA', fg: '#71717A', border: '#E4E4E7', dot: '#A1A1AA' },
    dirty: { text: 'Kaydedilmemiş', bg: '#FFFBEB', fg: '#D97706', border: '#FDE68A', dot: '#D97706' },
    justSaved: { text: 'Kaydedildi', bg: '#ECFDF5', fg: '#00845E', border: '#A7F3D0', dot: '#00845E' },
  } as const;
  const st = statusMap[status];

  return (
    <div className="dash-root" style={{ height: '100vh', display: 'flex', overflow: 'hidden', background: '#F9FAFB', color: '#18181B', fontFamily: 'var(--font-sans)' }}>
      {/* İkon rayı — mobilde gizlenir, alt tab bar devreye girer */}
      <nav className="dash-sidebar" style={{ flex: `0 0 ${SIDEBAR_W}px`, width: SIDEBAR_W, height: '100vh', background: '#FFFFFF', borderRight: '1px solid #E4E4E7', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '16px 0 12px', gap: 4 }}>
        <div style={{ marginBottom: 16 }}>
          <KodfolyoLogo size={34} />
        </div>
        {TABS.map((t) => {
          const isActive = activeTab === t.id;
          return (
            <button
              key={t.id}
              type="button"
              title={t.title}
              onClick={() => setActiveTab(t.id)}
              className={`flex flex-col items-center gap-1 rounded-xl cursor-pointer transition-colors ${isActive ? 'bg-zinc-900 text-white' : 'text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100/80'}`}
              style={{ width: 72, padding: '9px 2px 7px', border: 0 }}
            >
              <TabIcon tab={t} size={25} />
              <span className="font-medium" style={{ fontSize: 10.5, letterSpacing: '-.005em', lineHeight: 1.1, textAlign: 'center' }}>{t.label}</span>
            </button>
          );
        })}
        <div style={{ flex: 1 }} />
        <button
          onClick={() => loadData(activeUsername)}
          title="Senkronize et"
          className="rounded-xl cursor-pointer flex flex-col items-center text-zinc-600 hover:bg-zinc-100/80 transition-colors"
          style={{ width: 72, padding: '9px 2px', border: '1px solid #E4E4E7', background: '#FAFAFA', gap: 5 }}
        >
          <TabIcon tab={{ iconSrc: SENKRON_ICON }} size={20} />
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9.5, color: '#A1A1AA' }}>
            {profile.updated_at ? new Date(profile.updated_at).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }) : '—'}
          </span>
        </button>
        <button
          type="button"
          title="Ayarlar"
          onClick={() => setActiveTab('ayarlar')}
          className={`flex flex-col items-center gap-1 rounded-xl cursor-pointer transition-colors ${activeTab === 'ayarlar' ? 'bg-zinc-900 text-white' : 'text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100/80'}`}
          style={{ width: 72, marginTop: 6, padding: '9px 2px 7px', border: 0 }}
        >
          <TabIcon tab={{ iconSrc: AYARLAR_ICON }} size={25} />
          <span className="font-medium" style={{ fontSize: 10.5 }}>Ayarlar</span>
        </button>
      </nav>

      <section style={{ flex: 1, minWidth: 0, height: '100vh', display: 'flex', flexDirection: 'column' }}>
        <header style={{ flex: '0 0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, padding: '13px 22px', borderBottom: '1px solid #E4E4E7', background: '#FFFFFF' }}>
          <div style={{ minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
              <h1 className="text-zinc-900 font-semibold" style={{ margin: 0, fontSize: 17, letterSpacing: '-.02em' }}>{activeTabDef.title}</h1>
              <span className="inline-flex items-center gap-1.5 rounded-full text-xs" style={{ fontFamily: 'var(--font-mono)', fontSize: 10.5, padding: '3px 9px', background: st.bg, color: st.fg, border: `1px solid ${st.border}` }}>
                <span style={{ width: 5, height: 5, borderRadius: '50%', background: st.dot, flexShrink: 0 }} />
                {st.text}
              </span>
            </div>
            <p className="text-zinc-500" style={{ margin: '3px 0 0', fontSize: 12, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{activeTabDef.description}</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: '0 0 auto' }}>
            <a
              href={`/${displayProfile.username}`}
              target="_blank"
              rel="noreferrer"
              className="dash-open-btn hover:bg-zinc-50 transition-colors"
              style={{ display: 'flex', alignItems: 'center', gap: 6, height: 34, padding: '0 12px', border: '1px solid #E4E4E7', borderRadius: 8, background: '#FFFFFF', color: '#18181B', fontSize: 12.5, fontWeight: 500, textDecoration: 'none' }}
            >
              <ExternalLink className="w-3.5 h-3.5" /> Aç
            </a>
            <button
              type="button"
              onClick={handleSaveAll}
              disabled={isSavingAll || !hasPendingChanges}
              className="dash-save-btn hover:bg-zinc-800 transition-colors shadow-sm"
              style={{ height: 34, padding: '0 16px', border: 0, borderRadius: 8, background: '#18181B', color: '#FFFFFF', fontSize: 12.5, fontWeight: 500, cursor: 'pointer', opacity: isSavingAll || !hasPendingChanges ? 0.5 : 1 }}
            >
              Kaydet
            </button>
          </div>
        </header>

        <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: wide ? 'row' : 'column', overflowY: wide ? 'hidden' : 'auto' }}>
          <div style={{ flex: wide ? '1' : '0 0 auto', minWidth: 0, minHeight: 0, overflowY: wide ? 'auto' : 'visible', padding: '20px 22px 24px' }}>
            <div style={{ maxWidth: contentMaxW }}>{renderTabContent()}</div>
          </div>

          {showPreview && (
            <aside
              className="dash-preview"
              style={{
                flex: '0 0 auto', display: 'flex', flexDirection: 'column',
                background: '#F9FAFB', backgroundImage: 'radial-gradient(#E4E4E7 1px, transparent 1px)', backgroundSize: '16px 16px',
                width: wide ? paneW : '100%', height: wide ? '100%' : 620,
                borderLeft: wide ? '1px solid #E4E4E7' : 0,
                borderTop: wide ? 0 : '1px solid #E4E4E7',
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
          <div className="dash-savebar" style={{ padding: '9px 12px', background: '#FAFAFA', borderBottom: '1px solid rgba(228,228,231,.09)' }}>
            <button
              onClick={handleSaveAll}
              disabled={isSavingAll}
              style={{ width: '100%', height: 40, border: 0, borderRadius: 9, background: '#18181B', color: '#FFFFFF', fontSize: 13.5, fontWeight: 500, cursor: 'pointer', opacity: isSavingAll ? 0.6 : 1 }}
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
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, padding: '6px 10px', border: 0, borderRadius: 8, background: 'transparent', cursor: 'pointer', flexShrink: 0, color: activeTab === t.id ? '#18181B' : '#A1A1AA' }}
            >
              <TabIcon tab={t} size={18} />
              <span style={{ fontSize: 10, fontWeight: 500, whiteSpace: 'nowrap' }}>{t.label}</span>
            </button>
          ))}
          <button
            type="button"
            onClick={() => setActiveTab('ayarlar')}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, padding: '6px 10px', border: 0, borderRadius: 8, background: 'transparent', cursor: 'pointer', flexShrink: 0, color: activeTab === 'ayarlar' ? '#18181B' : '#A1A1AA' }}
          >
            <TabIcon tab={{ iconSrc: AYARLAR_ICON }} size={18} />
            <span style={{ fontSize: 10, fontWeight: 500 }}>Ayarlar</span>
          </button>
        </div>
      </nav>

      <style>{`
        @media (max-width: 1023px) {
          .dash-sidebar { display: none !important; }
          .dash-root { flex-direction: column !important; height: auto !important; min-height: 100vh; overflow: visible !important; }
          .dash-tabbar { display: block !important; position: sticky; bottom: 0; background: #FFFFFF; border-top: 1px solid #E4E4E7; z-index: 50; }
        }
      `}</style>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', background: '#F9FAFB' }} />}>
      <DashboardContent />
    </Suspense>
  );
}
