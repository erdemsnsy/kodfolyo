'use client';

import { UserProfile, Repository, DEFAULT_SECTION_VISIBILITY } from '@/types';
import PortfolioHero from '@/components/portfolio/PortfolioHero';
import TechStack from '@/components/portfolio/TechStack';
import FeaturedProjectCard from '@/components/portfolio/FeaturedProjectCard';
import ProjectGrid from '@/components/portfolio/ProjectGrid';
import ExperienceTimeline from '@/components/portfolio/ExperienceTimeline';
import { ShieldCheck, Eye } from 'lucide-react';

interface LivePortfolioPreviewProps {
  profile: UserProfile;
  repos: Repository[];
}

// Kaydetmeden önce, seçili sekmedeki değişikliklerin (tema, bio, deneyim,
// bölüm görünürlüğü...) portfolyoda nasıl görüneceğini gösterir. Aynı
// gerçek bileşenler kullanılır — bu bir maket değil, gerçek render.
export default function LivePortfolioPreview({ profile, repos }: LivePortfolioPreviewProps) {
  const visibleRepos = repos.filter((r) => r.is_visible !== false);
  const starCount = visibleRepos.reduce((sum, r) => sum + (r.stargazers_count || 0), 0);
  const featuredRepo = visibleRepos.find((r) => r.is_featured === true) || null;
  const gridRepos = featuredRepo ? repos.filter((r) => r.github_repo_id !== featuredRepo.github_repo_id) : repos;
  const visibility = profile.section_visibility || DEFAULT_SECTION_VISIBILITY;

  return (
    <div style={{ position: 'sticky', top: 20 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 10 }}>
        <Eye className="w-3.5 h-3.5" style={{ color: '#8C8797' }} />
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: '#8C8797' }}>CANLI ÖNİZLEME · kaydetmeden görürsün</span>
      </div>
      <div style={{ borderRadius: 16, border: '1px solid rgba(25,23,32,.12)', background: '#FFFFFF', overflow: 'hidden', boxShadow: '0 20px 50px rgba(25,23,32,.08)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '9px 12px', background: '#E7E2D6', borderBottom: '1px solid rgba(25,23,32,.08)' }}>
          <div style={{ display: 'flex', gap: 5 }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#FF5F57' }} />
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#FEBC2E' }} />
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#28C840' }} />
          </div>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 6, background: '#F4F1EA', borderRadius: 6, padding: '4px 9px', fontFamily: 'var(--font-mono)', fontSize: 10.5, color: '#6B6675', overflow: 'hidden' }}>
            <ShieldCheck className="w-3 h-3 shrink-0" style={{ color: '#28C840' }} />
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>kodfolyo.dev/{profile.username}</span>
          </div>
        </div>
        <div style={{ height: 520, overflow: 'hidden', position: 'relative', background: '#F4F1EA' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, width: '285%', transform: 'scale(0.35)', transformOrigin: 'top left' }}>
            <PortfolioHero profile={profile} repoCount={visibleRepos.length} starCount={starCount} isDemo />
            {visibility.techStack !== false && <TechStack repos={repos} themeType={profile.theme} />}
            {visibility.featuredProject !== false && featuredRepo && <FeaturedProjectCard repo={featuredRepo} themeType={profile.theme} />}
            {visibility.projects !== false && <ProjectGrid repos={gridRepos} themeType={profile.theme} />}
            {visibility.experience !== false && <ExperienceTimeline entries={profile.experience} themeType={profile.theme} />}
          </div>
        </div>
      </div>
    </div>
  );
}
