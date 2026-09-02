'use client';

import { useState, Suspense } from 'react';
import { useSession } from 'next-auth/react';
import { useSearchParams, useRouter } from 'next/navigation';
import Navbar from '@/components/navbar/Navbar';
import ProfileEditor from '@/components/dashboard/ProfileEditor';
import RepoSelector from '@/components/dashboard/RepoSelector';
import CustomLinksManager from '@/components/dashboard/CustomLinksManager';
import ThemeSelector from '@/components/dashboard/ThemeSelector';
import SyncButton from '@/components/dashboard/SyncButton';
import { UserProfile, Repository, ThemeType, CustomLink } from '@/types';
import { sanitizeUsername } from '@/lib/github/fetcher';
import { ExternalLink, ShieldCheck, Save, CheckCircle2, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useEffect } from 'react';

function DashboardContent() {
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const router = useRouter();

  const [activeUsername, setActiveUsername] = useState<string>('');
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [repos, setRepos] = useState<Repository[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [switchInput, setSwitchInput] = useState('');

  // Pending (kaydedilmemiş) değişiklikler
  const [pendingTheme, setPendingTheme] = useState<ThemeType | null>(null);
  const [pendingAccent, setPendingAccent] = useState<string | null | undefined>(undefined);
  const [pendingBio, setPendingBio] = useState<string | null>(null);
  const [pendingName, setPendingName] = useState<string | null>(null);
  const [pendingLocation, setPendingLocation] = useState<string | null>(null);
  const [pendingCompany, setPendingCompany] = useState<string | null>(null);
  const [pendingBlog, setPendingBlog] = useState<string | null>(null);
  const [pendingCustomLinks, setPendingCustomLinks] = useState<CustomLink[] | null>(null);

  const [isSavingAll, setIsSavingAll] = useState(false);
  const [saveAllSuccess, setSaveAllSuccess] = useState(false);

  const hasPendingChanges =
    pendingTheme !== null ||
    pendingAccent !== undefined ||
    pendingBio !== null ||
    pendingName !== null ||
    pendingLocation !== null ||
    pendingCompany !== null ||
    pendingBlog !== null ||
    pendingCustomLinks !== null;

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
            setSwitchInput(targetUser);
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
              setSwitchInput('erdemsnsy');
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

  const handleSwitchUser = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = sanitizeUsername(switchInput);
    if (clean) {
      if (typeof window !== 'undefined') {
        localStorage.setItem('kodfolyo_active_username', clean);
      }
      setActiveUsername(clean);
      // Bekleyen değişiklikleri temizle
      setPendingTheme(null);
      setPendingAccent(undefined);
      setPendingBio(null);
      setPendingName(null);
      setPendingLocation(null);
      setPendingCompany(null);
      setPendingBlog(null);
      setPendingCustomLinks(null);
      loadData(clean);
      router.push(`/dashboard?username=${clean}`);
    }
  };

  // Tüm değişiklikleri tek seferde kaydet
  const handleSaveAll = async () => {
    if (!profile || !hasPendingChanges) return;
    setIsSavingAll(true);
    setSaveAllSuccess(false);

    const payload: Record<string, unknown> = { username: activeUsername };
    if (pendingTheme !== null) payload.theme = pendingTheme;
    if (pendingAccent !== undefined) payload.custom_accent = pendingAccent;
    if (pendingBio !== null) payload.custom_bio = pendingBio;
    if (pendingName !== null) payload.name = pendingName;
    if (pendingLocation !== null) payload.location = pendingLocation;
    if (pendingCompany !== null) payload.company = pendingCompany;
    if (pendingBlog !== null) payload.blog = pendingBlog;
    if (pendingCustomLinks !== null) payload.custom_links = pendingCustomLinks;

    try {
      const res = await fetch('/api/profile/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const data = await res.json();
        // Local profile state'i güncelle
        if (data.profile) {
          setProfile(data.profile);
        } else {
          setProfile((prev) => ({
            ...prev!,
            ...(pendingTheme !== null && { theme: pendingTheme }),
            ...(pendingAccent !== undefined && { custom_accent: pendingAccent }),
            ...(pendingBio !== null && { custom_bio: pendingBio }),
            ...(pendingName !== null && { name: pendingName }),
            ...(pendingLocation !== null && { location: pendingLocation }),
            ...(pendingCompany !== null && { company: pendingCompany }),
            ...(pendingBlog !== null && { blog: pendingBlog }),
            ...(pendingCustomLinks !== null && { custom_links: pendingCustomLinks }),
          }));
        }

        // Pending değişiklikleri temizle
        setPendingTheme(null);
        setPendingAccent(undefined);
        setPendingBio(null);
        setPendingName(null);
        setPendingLocation(null);
        setPendingCompany(null);
        setPendingBlog(null);
        setPendingCustomLinks(null);
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

  if (isLoading || !profile) {
    return (
      <div className="min-h-screen bg-[#14110f] text-[#fdf6ec] flex flex-col font-sans">
        <Navbar />
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 border-2 border-[#ff5a3c] border-t-transparent rounded-full animate-spin" />
            <p className="text-xs text-[#d6d0c7]">@{activeUsername || 'erdemsnsy'} profil verileri yükleniyor...</p>
          </div>
        </div>
      </div>
    );
  }

  // Anlık önizleme için kullanılan profil (pending değişikliklerle birlikte)
  const displayProfile: UserProfile = {
    ...profile,
    ...(pendingTheme !== null && { theme: pendingTheme }),
    ...(pendingAccent !== undefined && { custom_accent: pendingAccent }),
    ...(pendingBio !== null && { custom_bio: pendingBio }),
    ...(pendingName !== null && { name: pendingName }),
    ...(pendingLocation !== null && { location: pendingLocation }),
    ...(pendingCompany !== null && { company: pendingCompany }),
    ...(pendingBlog !== null && { blog: pendingBlog }),
    ...(pendingCustomLinks !== null && { custom_links: pendingCustomLinks }),
  };

  return (
    <div className="min-h-screen bg-[#14110f] text-[#fdf6ec]">
      <Navbar />

      <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-12 space-y-8">
        {/* Üst Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-3xl border border-[#3a3530] bg-[#1f1a16] shadow-[5px_5px_0_0_#14110f]">
          <div className="space-y-1 min-w-0 max-w-full">
            <div className="text-xs text-[#d6d0c7] font-semibold flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#ff5a3c]" />
              <span>Kontrol Paneli</span>
            </div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-[#fdf6ec] truncate">
              Düzenlenen Profil: <span className="text-[#38bdf8]">@{displayProfile.username}</span>
            </h1>
            <p className="text-xs text-[#d6d0c7]">
              `/{displayProfile.username}` adresindeki portfolyonu buradan kişiselleştirebilirsin.
            </p>
          </div>

          <div className="shrink-0 pt-2 sm:pt-0">
            <Link
              href={`/${displayProfile.username}`}
              target="_blank"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#ff5a3c] hover:bg-[#ff7159] px-4 py-2.5 text-xs font-bold text-[#14110f] shadow-[3px_3px_0_0_#14110f] transition active:scale-95 whitespace-nowrap"
            >
              <span>Canlı Portfolyo</span>
              <ExternalLink className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* ========= DEĞİŞİKLİKLERİ KAYDET BUTONU (Sayfa akışında sabit durur, scroll ile kaybolur) ========= */}
        {(hasPendingChanges || saveAllSuccess) && (
          <div>
            <div className={`flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-3xl border shadow-[5px_5px_0_0_#14110f] transition-all duration-300 ${
              saveAllSuccess
                ? 'border-emerald-500/50 bg-emerald-950/80 backdrop-blur-md'
                : 'border-[#38bdf8]/50 bg-[#1f1a16]/90 backdrop-blur-md'
            }`}>
              <div className="flex items-center gap-3 text-sm">
                {saveAllSuccess ? (
                  <>
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                    <span className="text-emerald-300 font-semibold">
                      Tüm değişiklikler başarıyla kaydedildi! Canlı portfolyoyu yenileyerek görebilirsiniz.
                    </span>
                  </>
                ) : (
                  <>
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse shrink-0" />
                    <span className="text-amber-200 font-semibold">
                      Kaydedilmemiş değişiklikleriniz var. Aşağıdaki butona basarak kaydedin.
                    </span>
                  </>
                )}
              </div>

              {!saveAllSuccess && (
                <button
                  type="button"
                  onClick={handleSaveAll}
                  disabled={isSavingAll}
                  className="w-full sm:w-auto shrink-0 inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full bg-[#ff5a3c] hover:bg-[#ff7159] text-[#14110f] text-sm font-extrabold shadow-[3px_3px_0_0_#14110f] transition active:scale-95 disabled:opacity-60"
                >
                  {isSavingAll ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Kaydediliyor...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>Değişiklikleri Kaydet</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        )}

        <SyncButton onSync={() => loadData(activeUsername)} lastSyncedAt={profile.updated_at} />

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

        <ThemeSelector
          currentTheme={displayProfile.theme}
          currentAccent={displayProfile.custom_accent}
          onSelectTheme={(theme) => {
            setPendingTheme(theme);
            return Promise.resolve();
          }}
          onSelectAccent={(accent) => {
            setPendingAccent(accent);
            return Promise.resolve();
          }}
        />

        <CustomLinksManager
          customLinks={displayProfile.custom_links}
          onSaveLinks={(links) => {
            setPendingCustomLinks(links);
            return Promise.resolve();
          }}
        />

        <RepoSelector repos={repos} onToggleVisibility={handleToggleRepoVisibility} />

        {/* Alt Kaydet Butonu */}
        {hasPendingChanges && (
          <div className="flex justify-end pb-8">
            <button
              type="button"
              onClick={handleSaveAll}
              disabled={isSavingAll}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3 rounded-full bg-[#ff5a3c] hover:bg-[#ff7159] text-[#14110f] text-sm font-extrabold shadow-[4px_4px_0_0_#14110f] transition active:scale-95 disabled:opacity-60"
            >
              {isSavingAll ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Kaydediliyor...</span>
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  <span>Tüm Değişiklikleri Kaydet</span>
                </>
              )}
            </button>
          </div>
        )}
      </main>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#14110f] text-[#fdf6ec] p-8">Yükleniyor...</div>}>
      <DashboardContent />
    </Suspense>
  );
}
