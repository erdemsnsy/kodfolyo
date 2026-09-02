'use client';

import { UserProfile } from '@/types';
import { getTheme } from '@/lib/theme';
import { MapPin, Building, Globe, Mail, ExternalLink, ShieldCheck, Settings, FileText, Printer, Share2 } from 'lucide-react';
import { GithubIcon } from '@/components/icons/GithubIcon';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import ShareModal from './ShareModal';

interface PortfolioHeroProps {
  profile: UserProfile;
  isDemo?: boolean;
}

function renderLinkIcon(iconName?: string) {
  if (iconName === 'cv') return <FileText className="w-3.5 h-3.5 opacity-70" />;
  if (iconName === 'globe') return <Globe className="w-3.5 h-3.5 opacity-70" />;
  if (iconName === 'email') return <Mail className="w-3.5 h-3.5 opacity-70" />;
  return <ExternalLink className="w-3.5 h-3.5 opacity-60" />;
}

export default function PortfolioHero({ profile, isDemo: isDemoProp }: PortfolioHeroProps) {
  const [showShareModal, setShowShareModal] = useState(false);
  const theme = getTheme(profile.theme, profile.custom_accent);
  const displayBio = profile.custom_bio || profile.bio || 'Yazılım geliştirme tutkunu geliştirici.';

  const isDemo = isDemoProp || profile.username === 'ornek-ogrenci' || profile.username === 'demo';

  return (
    <section className="mx-auto max-w-4xl px-4 sm:px-6 pt-8 pb-4">
      {/* Executive Profil Kartı */}
      <div
        className={`rounded-2xl ${theme.card} p-6 sm:p-8 shadow-xl transition-all duration-300 space-y-6 print-page`}
        style={theme.cardStyle}
      >
        <div className={`flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b ${theme.dividerBorder} pb-6`}>
          <div className="flex items-center gap-4 min-w-0 max-w-full">
            {/* Profil Resmi */}
            <div className={`relative h-20 w-20 sm:h-24 sm:w-24 overflow-hidden rounded-2xl border ${theme.iconBorder} ${theme.iconBg} shrink-0 shadow-md`}>
              <Image
                src={profile.avatar_url}
                alt={profile.name || profile.username}
                fill
                className="object-cover"
                priority
              />
            </div>

            {/* İsim ve Kullanıcı Adı */}
            <div className="space-y-1 min-w-0 max-w-full">
              <div className="flex flex-wrap items-center gap-2 min-w-0">
                <h1 className={`text-xl sm:text-3xl font-extrabold tracking-tight ${theme.textPrimary} break-words`}>
                  {profile.name || profile.username}
                </h1>
                <span
                  className={`text-xs font-semibold px-2.5 py-0.5 rounded-md ${theme.badgeAccent} shrink-0`}
                  style={theme.badgeAccentStyle}
                >
                  @{profile.username}
                </span>
              </div>
              <p className={`text-xs sm:text-sm ${theme.textMuted} flex items-center gap-1.5 opacity-90`}>
                <ShieldCheck className="w-4 h-4 opacity-70 shrink-0" />
                <span>Software Developer Portfolio</span>
              </p>
            </div>
          </div>

          {/* Bağlantı Butonları & Düzenle / Oluştur Butonu (Sağa Hizalı) */}
          <div className="flex flex-wrap items-center justify-start sm:justify-end gap-2 pt-2 sm:pt-0 shrink-0 no-print">
            {!isDemo && (
              <>
                <button
                  onClick={() => setShowShareModal(true)}
                  className={`inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg ${theme.buttonSecondary} transition`}
                  style={theme.buttonSecondaryStyle}
                  title="Paylaş & QR Kod"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Paylaş & QR</span>
                </button>

                <button
                  onClick={() => typeof window !== 'undefined' && window.print()}
                  className={`inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg ${theme.buttonSecondary} transition`}
                  style={theme.buttonSecondaryStyle}
                  title="Portfolyoyu PDF Olarak İndir"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>PDF İndir</span>
                </button>
              </>
            )}

            {isDemo ? (
              <Link
                href="/dashboard"
                className={`inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-lg ${theme.buttonPrimary} transition active:scale-95`}
                style={theme.buttonPrimaryStyle}
              >
                <span>Kendi Siteni Oluştur</span>
                <ExternalLink className="w-3.5 h-3.5 opacity-70" />
              </Link>
            ) : (
              <Link
                href={`/dashboard?username=${profile.username}`}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg transition opacity-80 hover:opacity-100"
                style={theme.buttonSecondaryStyle}
                title="Bu Profili Düzenle"
              >
                <Settings className="w-3.5 h-3.5" />
                <span>Düzenle</span>
              </Link>
            )}

            <a
              href={`https://github.com/${profile.username}`}
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg ${theme.buttonPrimary} transition active:scale-95`}
              style={theme.buttonPrimaryStyle}
            >
              <GithubIcon className="w-4 h-4" />
              <span>GitHub</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-70" />
            </a>

            {profile.custom_links && profile.custom_links.map((link) => (
              <a
                key={link.id || link.url}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex items-center gap-2 px-4 py-2 text-xs font-medium rounded-lg ${theme.buttonSecondary} transition`}
                style={theme.buttonSecondaryStyle}
              >
                <span>{link.label}</span>
                {renderLinkIcon(link.iconName)}
              </a>
            ))}
          </div>
        </div>

        {/* Biyografi */}
        <div className="space-y-3">
          <p className={`text-sm sm:text-base leading-relaxed ${theme.textSecondary}`}>
            {displayBio}
          </p>

          {/* Rozetler */}
          <div className="flex flex-wrap gap-2 text-xs pt-1">
            {profile.location && (
              <span
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg ${theme.badge} max-w-full truncate`}
                style={theme.badgeStyle}
              >
                <MapPin className="w-3.5 h-3.5 opacity-70 shrink-0" />
                <span className="truncate">{profile.location}</span>
              </span>
            )}
            {profile.company && (
              <span
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg ${theme.badge} max-w-full truncate`}
                style={theme.badgeStyle}
              >
                <Building className="w-3.5 h-3.5 opacity-70 shrink-0" />
                <span className="truncate">{profile.company}</span>
              </span>
            )}
            {profile.email && (
              <a
                href={`mailto:${profile.email}`}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg ${theme.badge} transition max-w-full truncate`}
                style={theme.badgeStyle}
              >
                <Mail className="w-3.5 h-3.5 opacity-70 shrink-0" />
                <span className="truncate">{profile.email}</span>
              </a>
            )}
            {profile.blog && (
              <a
                href={profile.blog.startsWith('http') ? profile.blog : `https://${profile.blog}`}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg ${theme.badge} transition max-w-full truncate`}
                style={theme.badgeStyle}
              >
                <Globe className="w-3.5 h-3.5 opacity-70 shrink-0" />
                <span className="truncate max-w-[180px] sm:max-w-xs">{profile.blog.replace(/^https?:\/\//, '')}</span>
              </a>
            )}
          </div>
        </div>
      </div>

      {showShareModal && (
        <ShareModal
          username={profile.username}
          themeType={profile.theme}
          customAccent={profile.custom_accent}
          onClose={() => setShowShareModal(false)}
        />
      )}
    </section>
  );
}
