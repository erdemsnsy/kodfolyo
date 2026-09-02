import { Metadata } from 'next';
import Link from 'next/link';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
import { getProfileByUsername, getCachedReposByUsername } from '@/lib/supabase/server';
import PortfolioHero from '@/components/portfolio/PortfolioHero';
import TechStack from '@/components/portfolio/TechStack';
import ProjectGrid from '@/components/portfolio/ProjectGrid';
import FeaturedProjectCard from '@/components/portfolio/FeaturedProjectCard';
import ExperienceTimeline from '@/components/portfolio/ExperienceTimeline';
import PortfolioFooter from '@/components/portfolio/PortfolioFooter';
import Navbar from '@/components/navbar/Navbar';
import Kodi from '@/components/mascot/Kodi';
import { DEFAULT_SECTION_VISIBILITY } from '@/types';
import { ArrowLeft, Lock } from 'lucide-react';

interface PortfolioPageProps {
  params: Promise<{ username: string }>;
}

export async function generateMetadata({ params }: PortfolioPageProps): Promise<Metadata> {
  const { username } = await params;
  const decodedUsername = decodeURIComponent(username);
  const profile = await getProfileByUsername(decodedUsername);

  if (!profile) {
    return {
      title: 'Kullanıcı Bulunamadı - Kodfolyo',
      description: 'Aradığınız GitHub kullanıcısı bulunamadı.',
    };
  }

  const title = profile.name
    ? `${profile.name} (@${profile.username}) - Kodfolyo`
    : `@${profile.username} Portfolyosu - Kodfolyo`;

  const description = profile.custom_bio || profile.bio || `${profile.username} GitHub portfolyosu ve projeleri.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [profile.avatar_url],
    },
  };
}

export default async function PublicPortfolioPage({ params }: PortfolioPageProps) {
  const { username } = await params;
  const decodedUsername = decodeURIComponent(username);

  const profile = await getProfileByUsername(decodedUsername);

  // Eğer GitHub'da böyle bir kullanıcı yoksa temiz 404 hatası göster
  if (!profile) {
    return (
      <div style={{ minHeight: '100vh', background: '#F4F1EA', color: '#191720', display: 'flex', flexDirection: 'column' }}>
        <Navbar />
        <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 40 }}>
          <div style={{ textAlign: 'center', maxWidth: 460 }}>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <Kodi size={140} grayscale />
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: '#C6314E', marginTop: 8 }}>404 — KULLANICI BULUNAMADI</div>
            <h1 style={{ margin: '10px 0 12px', fontSize: 32, fontWeight: 800, letterSpacing: '-.035em' }}>Kodi bu profili bulamadı</h1>
            <p style={{ margin: '0 0 22px', fontSize: 15, lineHeight: 1.55, color: '#6B6675' }}>
              <code style={{ background: '#FFFFFF', padding: '2px 6px', borderRadius: 6, fontFamily: 'var(--font-mono)' }}>@{decodedUsername}</code> kullanıcı adıyla GitHub üzerinde kayıtlı bir profil bulunamadı ya da profil gizli.
            </p>
            <Link
              href="/"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontFamily: 'var(--font-sans)', fontSize: 14, fontWeight: 700, color: '#F4F1EA', background: '#1F3AE8', border: 0, borderRadius: 11, padding: '12px 20px', textDecoration: 'none' }}
            >
              <ArrowLeft className="w-4 h-4" />
              Ana sayfaya dön
            </Link>
          </div>
        </main>
      </div>
    );
  }

  // Sahibi "yayından kaldır" demişse herkese kapalı — dashboard üzerinden geri açılabilir
  if (profile.is_published === false) {
    return (
      <div style={{ minHeight: '100vh', background: '#F4F1EA', color: '#191720', display: 'flex', flexDirection: 'column' }}>
        <Navbar />
        <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 40 }}>
          <div style={{ textAlign: 'center', maxWidth: 460 }}>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <Kodi size={140} grayscale />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, fontFamily: 'var(--font-mono)', fontSize: 12, color: '#6B6675', marginTop: 8 }}>
              <Lock className="w-3.5 h-3.5" /> YAYINDAN KALDIRILDI
            </div>
            <h1 style={{ margin: '10px 0 12px', fontSize: 32, fontWeight: 800, letterSpacing: '-.035em' }}>Bu portfolyo şu anda gizli</h1>
            <p style={{ margin: '0 0 22px', fontSize: 15, lineHeight: 1.55, color: '#6B6675' }}>
              <code style={{ background: '#FFFFFF', padding: '2px 6px', borderRadius: 6, fontFamily: 'var(--font-mono)' }}>@{decodedUsername}</code> portfolyosunu sahibi yayından kaldırdı.
            </p>
            <Link
              href="/"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontFamily: 'var(--font-sans)', fontSize: 14, fontWeight: 700, color: '#F4F1EA', background: '#1F3AE8', border: 0, borderRadius: 11, padding: '12px 20px', textDecoration: 'none' }}
            >
              <ArrowLeft className="w-4 h-4" />
              Ana sayfaya dön
            </Link>
          </div>
        </main>
      </div>
    );
  }

  const repos = await getCachedReposByUsername(decodedUsername);
  const visibleRepos = repos.filter((r) => r.is_visible !== false);
  const starCount = visibleRepos.reduce((sum, r) => sum + (r.stargazers_count || 0), 0);
  const featuredRepo = visibleRepos.find((r) => r.is_featured === true) || null;
  const gridRepos = featuredRepo ? repos.filter((r) => r.github_repo_id !== featuredRepo.github_repo_id) : repos;
  const visibility = profile.section_visibility || DEFAULT_SECTION_VISIBILITY;

  return (
    <div style={{ minHeight: '100vh', background: '#F4F1EA', display: 'flex', flexDirection: 'column' }}>
      <Navbar themeType={profile.theme} currentUsername={profile.username} />

      <main style={{ flex: 1 }}>
        <PortfolioHero profile={profile} repoCount={visibleRepos.length} starCount={starCount} />
        {visibility.techStack !== false && <TechStack repos={repos} themeType={profile.theme} />}
        {visibility.featuredProject !== false && featuredRepo && <FeaturedProjectCard repo={featuredRepo} themeType={profile.theme} />}
        {visibility.projects !== false && <ProjectGrid repos={gridRepos} themeType={profile.theme} />}
        {visibility.experience !== false && <ExperienceTimeline entries={profile.experience} themeType={profile.theme} />}
      </main>

      <PortfolioFooter username={profile.username} themeType={profile.theme} />
    </div>
  );
}
