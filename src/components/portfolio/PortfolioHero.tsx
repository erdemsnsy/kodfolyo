'use client';

import { UserProfile } from '@/types';
import { getTheme } from '@/lib/theme';
import { MapPin, Building, Globe, Mail, ExternalLink, FileText, Printer, Share2, X } from 'lucide-react';
import { GithubIcon } from '@/components/icons/GithubIcon';
import { LinkedinIcon } from '@/components/icons/LinkedinIcon';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import ShareModal from './ShareModal';

interface PortfolioHeroProps {
  profile: UserProfile;
  repoCount?: number;
  starCount?: number;
  isDemo?: boolean;
}

function renderLinkIcon(iconName?: string) {
  if (iconName === 'cv') return <FileText className="w-3.5 h-3.5" />;
  if (iconName === 'globe') return <Globe className="w-3.5 h-3.5" />;
  if (iconName === 'email') return <Mail className="w-3.5 h-3.5" />;
  if (iconName === 'linkedin') return <LinkedinIcon className="w-3.5 h-3.5" />;
  if (iconName === 'twitter') return <X className="w-3.5 h-3.5" />;
  return <ExternalLink className="w-3.5 h-3.5" />;
}

export default function PortfolioHero({ profile, repoCount = 0, starCount = 0, isDemo: isDemoProp }: PortfolioHeroProps) {
  const [showShareModal, setShowShareModal] = useState(false);
  const theme = getTheme(profile.theme);
  const displayBio = profile.custom_bio || profile.bio || 'Yazılım geliştirme tutkunu geliştirici.';
  const isDemo = isDemoProp || profile.username === 'ornek-ogrenci' || profile.username === 'demo';

  const secondaryBtn: React.CSSProperties = {
    display: 'inline-flex', alignItems: 'center', gap: 8, fontFamily: 'var(--font-sans)', fontSize: 14, fontWeight: 600,
    color: theme.ink, background: 'rgba(25,23,32,.06)', border: `1px solid ${theme.border}`, borderRadius: 11,
    padding: '11px 18px', cursor: 'pointer', textDecoration: 'none',
  };

  return (
    <section className="print-page" style={{ position: 'relative', padding: '52px clamp(16px, 5vw, 40px) 40px', overflow: 'hidden', background: theme.bg }}>
      <div style={{ position: 'absolute', top: -220, left: '50%', transform: 'translateX(-50%)', width: 820, height: 460, borderRadius: '50%', background: `radial-gradient(ellipse, ${theme.b}2E, transparent 68%)`, filter: 'blur(20px)' }} />
      <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(25,23,32,.04) 1px,transparent 1px),linear-gradient(90deg,rgba(25,23,32,.04) 1px,transparent 1px)', backgroundSize: '54px 54px', maskImage: 'radial-gradient(ellipse 80% 60% at 50% 0%, #000 10%, transparent 75%)' }} />

      <div style={{ position: 'relative', maxWidth: 1020, margin: '0 auto' }}>
        <div style={{ display: 'flex', gap: 28, alignItems: 'flex-start', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', width: 112, height: 112, borderRadius: 28, overflow: 'hidden', flexShrink: 0, background: theme.gradient }}>
            <Image src={profile.avatar_url} alt={profile.name || profile.username} fill className="object-cover" priority />
          </div>

          <div style={{ flex: 1, minWidth: 280 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 11, flexWrap: 'wrap' }}>
              <h1 style={{ margin: 0, fontSize: 42, fontWeight: 900, letterSpacing: '-.04em', color: theme.ink }}>{profile.name || profile.username}</h1>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, padding: '5px 11px', borderRadius: 999, background: `${theme.a}1F`, border: `1px solid ${theme.a}4D`, color: theme.a }}>
                @{profile.username}
              </span>
            </div>
            <p style={{ margin: '12px 0 16px', fontSize: 17, lineHeight: 1.55, color: theme.body, maxWidth: 600 }}>{displayBio}</p>

            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20 }}>
              {profile.location && (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7, fontSize: 13, color: theme.dim, background: 'rgba(25,23,32,.05)', border: `1px solid ${theme.border}`, borderRadius: 999, padding: '6px 13px' }}>
                  <MapPin className="w-3.5 h-3.5" /> {profile.location}
                </span>
              )}
              {profile.company && (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7, fontSize: 13, color: theme.dim, background: 'rgba(25,23,32,.05)', border: `1px solid ${theme.border}`, borderRadius: 999, padding: '6px 13px' }}>
                  <Building className="w-3.5 h-3.5" /> {profile.company}
                </span>
              )}
              {profile.email && (
                <a href={`mailto:${profile.email}`} style={{ display: 'inline-flex', alignItems: 'center', gap: 7, fontSize: 13, color: theme.dim, background: 'rgba(25,23,32,.05)', border: `1px solid ${theme.border}`, borderRadius: 999, padding: '6px 13px', textDecoration: 'none' }}>
                  <Mail className="w-3.5 h-3.5" /> {profile.email}
                </a>
              )}
              {profile.blog && (
                <a
                  href={profile.blog.startsWith('http') ? profile.blog : `https://${profile.blog}`}
                  target="_blank" rel="noopener noreferrer"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 7, fontSize: 13, color: theme.dim, background: 'rgba(25,23,32,.05)', border: `1px solid ${theme.border}`, borderRadius: 999, padding: '6px 13px', textDecoration: 'none' }}
                >
                  <Globe className="w-3.5 h-3.5" /> {profile.blog.replace(/^https?:\/\//, '')}
                </a>
              )}
            </div>

            <div className="no-print" style={{ display: 'flex', gap: 9, flexWrap: 'wrap' }}>
              <a
                href={`https://github.com/${profile.username}`} target="_blank" rel="noopener noreferrer"
                style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontFamily: 'var(--font-sans)', fontSize: 14, fontWeight: 700, color: '#F4F1EA', background: theme.a, border: 0, borderRadius: 11, padding: '11px 18px', textDecoration: 'none' }}
              >
                <GithubIcon className="w-4 h-4" />
                GitHub&apos;da gör
              </a>

              {!isDemo && (
                <>
                  <button onClick={() => setShowShareModal(true)} style={secondaryBtn}><Share2 className="w-3.5 h-3.5" />Paylaş</button>
                  <button
                    onClick={() => {
                      if (typeof window === 'undefined') return;
                      const body = JSON.stringify({ username: profile.username, type: 'pdf_download' });
                      if (navigator.sendBeacon) navigator.sendBeacon('/api/analytics/track', new Blob([body], { type: 'application/json' }));
                      window.print();
                    }}
                    style={secondaryBtn}
                  >
                    <Printer className="w-3.5 h-3.5" />PDF indir
                  </button>
                </>
              )}

              {isDemo ? (
                <Link href="/dashboard" style={secondaryBtn}>Kendi Siteni Oluştur</Link>
              ) : (
                <Link href={`/dashboard?username=${profile.username}`} style={secondaryBtn}>Düzenle</Link>
              )}

              {profile.custom_links && profile.custom_links.map((link) => (
                <a key={link.id || link.url} href={link.url} target="_blank" rel="noopener noreferrer" style={secondaryBtn}>
                  {renderLinkIcon(link.iconName)}
                  {link.label}
                </a>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', gap: 10 }}>
            {[{ value: String(starCount), label: 'YILDIZ' }, { value: String(repoCount), label: 'REPO' }].map((s) => (
              <div key={s.label} style={{ minWidth: 96, padding: 15, borderRadius: 14, background: 'rgba(25,23,32,.04)', border: `1px solid ${theme.border}`, textAlign: 'center' }}>
                <div style={{ fontSize: 24, fontWeight: 800, letterSpacing: '-.03em', color: theme.ink }}>{s.value}</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10.5, color: theme.mutedLight, marginTop: 3 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {showShareModal && (
        <ShareModal
          username={profile.username}
          themeType={profile.theme}
          onClose={() => setShowShareModal(false)}
        />
      )}
    </section>
  );
}
