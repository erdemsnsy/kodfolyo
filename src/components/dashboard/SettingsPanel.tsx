'use client';

import { useState } from 'react';
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
      <div style={{ background: '#FFFFFF', border: '1px solid rgba(25,23,32,.09)', borderRadius: 12, padding: '15px 16px', display: 'flex', alignItems: 'center', gap: 13, flexWrap: 'wrap' }}>
        <div style={{ width: 42, height: 42, borderRadius: '50%', background: '#EBE7DD', display: 'grid', placeItems: 'center', fontFamily: 'var(--font-mono)', fontSize: 14, color: '#56515F', overflow: 'hidden' }}>
          {profile.avatar_url ? <img src={profile.avatar_url} alt={profile.username} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : initials}
        </div>
        <div style={{ flex: 1, minWidth: 140 }}>
          <div style={{ fontSize: 14, fontWeight: 600 }}>{profile.name || profile.username}</div>
          <a href={`https://github.com/${profile.username}`} target="_blank" rel="noreferrer" style={{ fontFamily: 'var(--font-mono)', fontSize: 11.5, color: '#1F3AE8' }}>
            github.com/{profile.username}
          </a>
        </div>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11.5, color: '#8C8797' }}>{profile.email || 'e-posta paylaşılmamış'}</span>
      </div>

      <div style={{ background: '#FFFFFF', border: '1px solid rgba(25,23,32,.09)', borderRadius: 12, padding: '14px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 14, flexWrap: 'wrap' }}>
        <div>
          <div style={{ fontSize: 13, fontWeight: 600 }}>Verini indir</div>
          <div style={{ fontSize: 11.5, color: '#8C8797', marginTop: 2 }}>Profil ve repo verisi, JSON olarak.</div>
        </div>
        <a
          href={`/api/profile/export/${encodeURIComponent(profile.username)}`}
          style={{ display: 'flex', alignItems: 'center', gap: 6, height: 32, padding: '0 13px', border: '1px solid rgba(25,23,32,.16)', borderRadius: 8, background: '#FFFFFF', fontSize: 12.5, fontWeight: 500, textDecoration: 'none', color: '#191720' }}
        >
          <Download className="w-3.5 h-3.5" /> JSON indir
        </a>
      </div>

      <div style={{ background: '#FFFFFF', border: '1px solid rgba(198,49,78,.28)', borderRadius: 12, overflow: 'hidden' }}>
        <div style={{ padding: '10px 16px', background: 'rgba(198,49,78,.06)', borderBottom: '1px solid rgba(198,49,78,.18)', fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '.07em', textTransform: 'uppercase', color: '#C6314E' }}>
          Tehlikeli bölge
        </div>

        <div style={{ padding: '13px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 14, borderBottom: '1px solid rgba(25,23,32,.06)' }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600 }}>Portfolyo yayında</div>
            <div style={{ fontSize: 11.5, color: '#8C8797', marginTop: 2 }}>Kapatırsan link 404 döner, verin silinmez.</div>
          </div>
          <button
            type="button"
            onClick={handleTogglePublish}
            disabled={isToggling}
            style={{ position: 'relative', width: 36, height: 21, border: 0, borderRadius: 999, cursor: 'pointer', padding: 0, flexShrink: 0, background: isPublished ? '#00A676' : 'rgba(25,23,32,.16)', opacity: isToggling ? 0.6 : 1 }}
          >
            <span style={{ position: 'absolute', top: 3, left: isPublished ? 18 : 3, width: 15, height: 15, borderRadius: '50%', background: '#FFFFFF', boxShadow: '0 1px 2px rgba(25,23,32,.25)', transition: 'left .15s ease' }} />
          </button>
        </div>

        <div style={{ padding: '13px 16px' }}>
          <div style={{ fontSize: 13, fontWeight: 600 }}>Hesabı sil</div>
          <div style={{ fontSize: 11.5, color: '#8C8797', marginTop: 2 }}>
            Onaylamak için <span style={{ fontFamily: 'var(--font-mono)', color: '#56515F' }}>{profile.username}</span> yaz.
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 11 }}>
            <input
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder={profile.username}
              style={{ flex: 1, minWidth: 0, maxWidth: 220, padding: '8px 10px', border: '1px solid rgba(198,49,78,.28)', borderRadius: 7, background: '#FBF9F4', fontFamily: 'var(--font-mono)', fontSize: 12.5, outline: 'none', color: '#191720' }}
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
