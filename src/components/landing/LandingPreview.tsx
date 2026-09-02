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
  const starCount = mockRepos.reduce((sum, r) => sum + (r.stargazers_count || 0), 0);

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
    theme: 'gece',
    custom_links: [],
  };

  return (
    <div id="onizleme" style={{ padding: '88px clamp(16px, 5vw, 40px)', position: 'relative' }}>
      <div style={{ maxWidth: 1180, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 24, marginBottom: 30, flexWrap: 'wrap' }}>
          <div>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: '#1F3AE8' }}>01 — ÇIKTI</span>
            <h2 style={{ margin: '10px 0 0', fontSize: 40, fontWeight: 800, letterSpacing: '-.035em', color: '#191720' }}>Böyle görünüyor.</h2>
          </div>
          <p style={{ margin: 0, maxWidth: 420, fontSize: 15.5, lineHeight: 1.55, color: '#56515F' }}>
            Her portfolyo kendi adresinde yayınlanır ve GitHub verisi değiştikçe kendini günceller.
          </p>
        </div>

        <div style={{ position: 'relative', borderRadius: 18, border: '1px solid rgba(25,23,32,.13)', background: '#FFFFFF', overflow: 'hidden', boxShadow: '0 40px 90px rgba(25,23,32,.12)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 16px', background: '#E7E2D6', borderBottom: '1px solid rgba(25,23,32,.08)' }}>
            <div style={{ display: 'flex', gap: 7 }}>
              <span style={{ width: 11, height: 11, borderRadius: '50%', background: '#FF5F57' }} />
              <span style={{ width: 11, height: 11, borderRadius: '50%', background: '#FEBC2E' }} />
              <span style={{ width: 11, height: 11, borderRadius: '50%', background: '#28C840' }} />
            </div>
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 8, background: '#F4F1EA', borderRadius: 8, padding: '7px 12px', fontFamily: 'var(--font-mono)', fontSize: 12.5, color: '#6B6675' }}>
              <ShieldCheck className="w-3.5 h-3.5" style={{ color: '#28C840' }} /> kodfolyo.dev/{demoProfile.username}
            </div>
          </div>

          <div style={{ background: '#FFFFFF' }}>
            <PortfolioHero profile={demoProfile} repoCount={mockRepos.length} starCount={starCount} isDemo />
            <TechStack repos={mockRepos} themeType="gece" />
            <ProjectGrid repos={mockRepos.slice(0, 4)} themeType="gece" />
          </div>
        </div>
      </div>
    </div>
  );
}
