'use client';

import { useState } from 'react';
import Image from 'next/image';
import { UserProfile } from '@/types';
import { Download } from 'lucide-react';

interface SettingsPanelProps {
  profile: UserProfile;
  onTogglePublish: (nextPublished: boolean) => Promise<void>;
  onDeleteAccount: () => Promise<void>;
}

export default function SettingsPanel({ profile, onTogglePublish, onDeleteAccount }: SettingsPanelProps) {
  const [confirmText, setConfirmText] = useState('');
  const [isToggling, setIsToggling] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const isPublished = profile.is_published !== false;
  const initials = (profile.name || profile.username).split(' ').map((p) => p[0]).slice(0, 2).join('').toUpperCase();
  const canDelete = confirmText.trim() === profile.username;

  const handleTogglePublish = async () => {
    setIsToggling(true);
    try {
      await onTogglePublish(!isPublished);
    } finally {
      setIsToggling(false);
    }
  };

  const handleDelete = async () => {
    if (!canDelete) return;
    setIsDeleting(true);
    try {
      await onDeleteAccount();
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ background: '#FFFFFF', border: '1px solid rgba(228,228,231,.8)', borderRadius: 16, boxShadow: '0 1px 2px 0 rgba(0,0,0,0.04)', padding: '15px 16px', display: 'flex', alignItems: 'center', gap: 13, flexWrap: 'wrap' }}>
        <div style={{ width: 42, height: 42, borderRadius: '50%', background: '#F4F4F5', display: 'grid', placeItems: 'center', fontFamily: 'var(--font-mono)', fontSize: 14, color: '#52525B', overflow: 'hidden' }}>
          {profile.avatar_url ? <img src={profile.avatar_url} alt={profile.username} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : initials}
        </div>
        <div style={{ flex: 1, minWidth: 140 }}>
          <div style={{ fontSize: 14, fontWeight: 600 }}>{profile.name || profile.username}</div>
          <a href={`https://github.com/${profile.username}`} target="_blank" rel="noreferrer" style={{ fontFamily: 'var(--font-mono)', fontSize: 11.5, color: '#18181B' }}>
            github.com/{profile.username}
          </a>
        </div>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11.5, color: '#A1A1AA' }}>{profile.email || 'e-posta paylaşılmamış'}</span>
      </div>

      <div style={{ background: '#FFFFFF', border: '1px solid rgba(228,228,231,.8)', borderRadius: 16, boxShadow: '0 1px 2px 0 rgba(0,0,0,0.04)', padding: '14px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 14, flexWrap: 'wrap' }}>
        <div>
          <div style={{ fontSize: 13, fontWeight: 600 }}>Verini indir</div>
          <div style={{ fontSize: 11.5, color: '#A1A1AA', marginTop: 2 }}>Profil ve repo verisi, JSON olarak.</div>
        </div>
        <a
          href={`/api/profile/export/${encodeURIComponent(profile.username)}`}
          className="hover:bg-zinc-50 transition-colors"
          style={{ display: 'flex', alignItems: 'center', gap: 6, height: 32, padding: '0 13px', border: '1px solid rgba(228,228,231,.16)', borderRadius: 8, background: '#FFFFFF', fontSize: 12.5, fontWeight: 500, textDecoration: 'none', color: '#18181B' }}
        >
          <Download className="w-3.5 h-3.5" /> JSON indir
        </a>
      </div>

      <div style={{ background: '#FFFFFF', border: '1px solid rgba(198,49,78,.28)', borderRadius: 16, overflow: 'hidden' }}>
        <div style={{ padding: '10px 16px', background: 'rgba(198,49,78,.06)', borderBottom: '1px solid rgba(198,49,78,.18)', fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '.07em', textTransform: 'uppercase', color: '#C6314E' }}>
          Tehlikeli bölge
        </div>

        <div style={{ padding: '13px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 14, borderBottom: '1px solid rgba(228,228,231,.06)' }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600 }}>Portfolyo yayında</div>
            <div style={{ fontSize: 11.5, color: '#A1A1AA', marginTop: 2 }}>Kapatırsan link 404 döner, verin silinmez.</div>
          </div>
          <button
            type="button"
            onClick={handleTogglePublish}
            disabled={isToggling}
            style={{ position: 'relative', width: 36, height: 21, border: 0, borderRadius: 999, cursor: 'pointer', padding: 0, flexShrink: 0, background: isPublished ? '#00A676' : 'rgba(228,228,231,.16)', opacity: isToggling ? 0.6 : 1 }}
          >
            <span style={{ position: 'absolute', top: 3, left: isPublished ? 18 : 3, width: 15, height: 15, borderRadius: '50%', background: '#FFFFFF', boxShadow: '0 1px 2px rgba(228,228,231,.25)', transition: 'left .15s ease' }} />
          </button>
        </div>

        <div style={{ padding: '13px 16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
            <span style={{ position: 'relative', width: 18, height: 18, flexShrink: 0 }}>
              <Image src="/icons/hesapsil.png" alt="" fill sizes="18px" style={{ objectFit: 'contain' }} />
            </span>
            <span style={{ fontSize: 13, fontWeight: 600 }}>Hesabı sil</span>
          </div>
          <div style={{ fontSize: 11.5, color: '#A1A1AA', marginTop: 2 }}>
            Onaylamak için <span style={{ fontFamily: 'var(--font-mono)', color: '#52525B' }}>{profile.username}</span> yaz.
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 11 }}>
            <input
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder={profile.username}
              className="focus:ring-1 focus:ring-red-600"
              style={{ flex: 1, minWidth: 0, maxWidth: 220, padding: '8px 10px', border: '1px solid rgba(198,49,78,.28)', borderRadius: 7, background: '#FAFAFA', fontFamily: 'var(--font-mono)', fontSize: 12.5, outline: 'none', color: '#18181B' }}
            />
            <button
              type="button"
              onClick={handleDelete}
              disabled={!canDelete || isDeleting}
              style={{ height: 34, padding: '0 15px', border: 0, borderRadius: 8, fontSize: 12.5, fontWeight: 500, cursor: canDelete ? 'pointer' : 'not-allowed', background: canDelete ? '#C6314E' : 'rgba(198,49,78,.12)', color: canDelete ? '#FFFFFF' : 'rgba(198,49,78,.55)' }}
            >
              Hesabı sil
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
