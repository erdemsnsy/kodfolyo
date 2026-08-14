import { Metadata } from 'next';
import Link from 'next/link';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
import { getProfileByUsername, getCachedReposByUsername } from '@/lib/supabase/server';
import PortfolioHero from '@/components/portfolio/PortfolioHero';
import TechStack from '@/components/portfolio/TechStack';
import ProjectGrid from '@/components/portfolio/ProjectGrid';
import PortfolioFooter from '@/components/portfolio/PortfolioFooter';
import Navbar from '@/components/navbar/Navbar';
import { getTheme } from '@/lib/theme';
import { AlertCircle, ArrowLeft } from 'lucide-react';

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
      <div className="min-h-screen bg-[#0c0d0e] text-[#f8fafc] flex flex-col font-sans">
        <Navbar />

        <main className="flex-1 flex items-center justify-center p-6 my-12">
          <div className="mx-auto max-w-md w-full rounded-2xl border border-[#23272e] bg-[#141619] p-8 text-center space-y-6 shadow-2xl">
            <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 flex items-center justify-center mx-auto">
              <AlertCircle className="w-6 h-6" />
            </div>

            <div className="space-y-2">
              <h1 className="text-xl font-bold text-white">GitHub Kullanıcısı Bulunamadı</h1>
              <p className="text-xs text-[#94a3b8] leading-relaxed">
                <code className="text-white font-mono bg-[#0c0d0e] px-1.5 py-0.5 rounded">@{decodedUsername}</code> kullanıcı adıyla GitHub üzerinde kayıtlı bir profil bulunamadı.
              </p>
            </div>

            <div className="pt-2 flex flex-col gap-3">
              <Link
                href="/"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-white hover:bg-slate-200 px-5 py-3 text-xs font-bold text-slate-950 shadow transition"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Tekrar Arama Yap</span>
              </Link>
            </div>
          </div>
        </main>
      </div>
    );
  }

  const repos = await getCachedReposByUsername(decodedUsername);
  const theme = getTheme(profile.theme);

  return (
    <div
      className={`min-h-screen ${theme.bg} transition-all duration-300 flex flex-col`}
      style={theme.backgroundStyle}
    >
      <Navbar headerStyle={theme.headerStyle} themeType={profile.theme} currentUsername={profile.username} />

      <main className="flex-1">
        <PortfolioHero profile={profile} />
        <TechStack repos={repos} themeType={profile.theme} />
        <ProjectGrid repos={repos} themeType={profile.theme} />
      </main>

      <PortfolioFooter username={profile.username} themeType={profile.theme} />
    </div>
  );
}
