'use client';

import { getMockGitHubUserData, getMockRepositories } from '@/lib/github/fetcher';
import PortfolioHero from '@/components/portfolio/PortfolioHero';
import TechStack from '@/components/portfolio/TechStack';
import ProjectGrid from '@/components/portfolio/ProjectGrid';
import { UserProfile } from '@/types';
import { ShieldCheck } from 'lucide-react';

export default function LandingPreview() {
  const mockUser = getMockGitHubUserData('ornek-ogrenci');
  const mockRepos = getMockRepositories('ornek-ogrenci');

  const demoProfile: UserProfile = {
    id: 'demo-123',
    github_id: '12345678',
    username: mockUser.login,
    name: mockUser.name,
    avatar_url: mockUser.avatar_url,
    bio: mockUser.bio,
    custom_bio: 'Bilgisayar Mühendisliği Öğrencisi. Web teknolojileri ve açık kaynak sistemlere odaklanıyorum.',
    company: mockUser.company,
    location: mockUser.location,
    email: mockUser.email,
    blog: mockUser.blog,
    theme: 'corporate-dark',
    custom_links: [],
  };

  return (
    <section className="mx-auto max-w-4xl px-4 sm:px-6 py-8">
      <div className="text-center space-y-2 mb-6">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1f1a16] border border-[#3a2c22] text-xs font-semibold text-[#fdf6ec] shadow-[3px_3px_0_0_#14110f]">
          <ShieldCheck className="w-3.5 h-3.5 text-[#ff5a3c]" /> Canlı Executive Portfolyo Simülasyonu
        </div>
      </div>

      <div className="rounded-3xl border border-[#3a2c22] bg-[#14110f] p-2 sm:p-4 shadow-[6px_6px_0_0_#1f1a16] overflow-hidden">
        {/* Mock Browser Bar */}
        <div className="flex items-center justify-between px-4 py-2 bg-[#1f1a16] rounded-2xl border border-[#3a2c22] mb-4 text-xs text-[#cbb9a0]">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#ff5a3c]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#f5b83d]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#4fd8ff]" />
          </div>
          <div className="px-3 py-0.5 rounded-full bg-[#14110f] text-[11px] text-[#fdf6ec]">
            https://kodfolyo.dev/ornek-ogrenci
          </div>
          <div className="w-10" />
        </div>

        {/* Canlı Bileşen Önizleme */}
        <div className="rounded-2xl bg-[#0c0d0e]">
          <PortfolioHero profile={demoProfile} isDemo={true} />
          <TechStack repos={mockRepos} themeType="corporate-dark" />
          <ProjectGrid repos={mockRepos.slice(0, 4)} themeType="corporate-dark" />
        </div>
      </div>
    </section>
  );
}
