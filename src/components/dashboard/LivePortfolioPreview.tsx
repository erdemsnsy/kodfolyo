'use client';

import { UserProfile, Repository, DEFAULT_SECTION_VISIBILITY, ThemeType } from '@/types';
import PortfolioHero from '@/components/portfolio/PortfolioHero';
import TechStack from '@/components/portfolio/TechStack';
import FeaturedProjectCard from '@/components/portfolio/FeaturedProjectCard';
import ProjectGrid from '@/components/portfolio/ProjectGrid';
import ManualProjectsGrid from '@/components/portfolio/ManualProjectsGrid';
import ExperienceTimeline from '@/components/portfolio/ExperienceTimeline';
import CertificatesList from '@/components/portfolio/CertificatesList';

interface LivePortfolioPreviewProps {
  profile: UserProfile;
  repos: Repository[];
  frameWidth: number;
  frameHeight: number;
  /** Rozet sekmesindeyken: tüm siteyi değil, tek rozeti göster. */
  badgeMode?: boolean;
  badgeTheme?: ThemeType;
  badgeSize?: 'sm' | 'md' | 'lg';
}

const DESIGN_WIDTH = 1060;

// Kaydetmeden önce, seçili sekmedeki değişikliklerin (tema, bio, deneyim,
// bölüm görünürlüğü...) portfolyoda nasıl görüneceğini gösterir. Aynı
// gerçek bileşenler kullanılır — bu bir maket değil, gerçek render.
export default function LivePortfolioPreview({ profile, repos, frameWidth, frameHeight, badgeMode, badgeTheme, badgeSize }: LivePortfolioPreviewProps) {
  const visibleRepos = repos.filter((r) => r.is_visible !== false);
  const starCount = visibleRepos.reduce((sum, r) => sum + (r.stargazers_count || 0), 0);
  const featuredRepo = visibleRepos.find((r) => r.is_featured === true) || null;
  const gridRepos = featuredRepo ? repos.filter((r) => r.github_repo_id !== featuredRepo.github_repo_id) : repos;
  const visibility = profile.section_visibility || DEFAULT_SECTION_VISIBILITY;
  const scale = frameWidth / DESIGN_WIDTH;
  const previewUrl = `kodfolyo.dev/${profile.username}`;
  const badgeUrl = `/api/badge/${profile.username}?theme=${badgeTheme || profile.theme}&size=${badgeSize || 'md'}`;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div className="text-zinc-400" style={{ flex: '0 0 auto', display: 'flex', alignItems: 'center', gap: 8, padding: '12px 24px', background: '#FAFAFA', borderBottom: '1px solid rgba(228,228,231,.7)' }}>
        <span style={{ display: 'flex', gap: 5, flex: '0 0 auto' }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#E4E4E7' }} />
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#E4E4E7' }} />
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#E4E4E7' }} />
        </span>
        <span className="text-xs" style={{ flex: 1, minWidth: 0, display: 'flex', alignItems: 'center', gap: 7, padding: '4px 11px', borderRadius: 999, background: '#FFFFFF', border: '1px solid rgba(228,228,231,.7)', fontFamily: 'var(--font-mono)', overflow: 'hidden' }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', flex: '0 0 auto', background: '#00A676' }} />
          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{previewUrl}</span>
        </span>
      </div>

      <div style={{ flex: 1, minHeight: 0, overflow: 'hidden', display: 'flex', justifyContent: 'center', padding: '28px 28px 0' }}>
        <div style={{ borderRadius: 16, overflow: 'hidden', background: '#FFFFFF', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25), 0 0 0 1px rgba(0,0,0,0.05)', width: frameWidth, height: frameHeight }}>
          {badgeMode ? (
            <div style={{ width: '100%', height: '100%', display: 'grid', placeItems: 'center', background: '#FAFAFA', padding: 24 }}>
              <img key={badgeUrl} src={badgeUrl} alt="Rozet önizleme" style={{ display: 'block', maxWidth: '100%' }} />
            </div>
          ) : (
            <div style={{ transformOrigin: 'top left', width: DESIGN_WIDTH, transform: `scale(${scale})` }}>
              <PortfolioHero profile={profile} repoCount={visibleRepos.length} starCount={starCount} isDemo />
              {visibility.techStack !== false && <TechStack repos={repos} themeType={profile.theme} />}
              {visibility.featuredProject !== false && featuredRepo && <FeaturedProjectCard repo={featuredRepo} themeType={profile.theme} />}
              {visibility.projects !== false && <ProjectGrid repos={gridRepos} themeType={profile.theme} />}
              {visibility.manualProjects !== false && <ManualProjectsGrid projects={profile.manual_projects} themeType={profile.theme} />}
              {visibility.experience !== false && <ExperienceTimeline entries={profile.experience} themeType={profile.theme} />}
              {visibility.certificates !== false && <CertificatesList certificates={profile.certificates} themeType={profile.theme} />}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
