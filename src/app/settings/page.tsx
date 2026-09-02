'use client';

import { useState, Suspense, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { KodfolyoLogo } from '@/components/icons/KodfolyoLogo';
import { GithubIcon } from '@/components/icons/GithubIcon';
import { UserProfile } from '@/types';
import { sanitizeUsername } from '@/lib/github/fetcher';
import { ArrowLeft, Download, EyeOff, Eye, Trash2, AlertTriangle, ExternalLink } from 'lucide-react';

const cardStyle: React.CSSProperties = { padding: 24, borderRadius: 16, background: '#FFFFFF', border: '1px solid rgba(25,23,32,.09)' };

function SettingsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeUsername, setActiveUsername] = useState('');
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isTogglingPublish, setIsTogglingPublish] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  useEffect(() => {
    const queryUser = searchParams.get('username');
    const storedUser = typeof window !== 'undefined' ? localStorage.getItem('kodfolyo_active_username') : null;
    const targetUser = sanitizeUsername(queryUser || storedUser || 'erdemsnsy');

    fetch('/api/github/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: targetUser }),
    })
      .then((res) => res.json())
      .then((data) => {
        setActiveUsername(targetUser);
        if (data.profile) setProfile(data.profile);
      })
      .catch((err) => console.error(err))
      .finally(() => setIsLoading(false));
  }, [searchParams]);

  const handleTogglePublish = async () => {
    if (!profile) return;
    const nextPublished = profile.is_published === false;
    setIsTogglingPublish(true);
    try {
      await fetch('/api/profile/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: activeUsername, isPublished: nextPublished }),
      });
      setProfile((prev) => (prev ? { ...prev, is_published: nextPublished } : prev));
      setStatusMsg(nextPublished ? 'Portfolyo tekrar yayında.' : 'Portfolyo yayından kaldırıldı.');
      setTimeout(() => setStatusMsg(null), 4000);
    } catch (err) {
      console.error(err);
    } finally {
      setIsTogglingPublish(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!profile || deleteConfirmText !== profile.username) return;
    setIsDeleting(true);
    try {
      await fetch('/api/profile/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: activeUsername, deleteAccount: true }),
      });
      if (typeof window !== 'undefined') localStorage.removeItem('kodfolyo_active_username');
      router.push('/');
    } catch (err) {
      console.error(err);
      setIsDeleting(false);
    }
  };

  if (isLoading || !profile) {
    return (
      <div style={{ minHeight: '100vh', background: '#F4F1EA', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: 22, height: 22, border: '2px solid #1F3AE8', borderTopColor: 'transparent', borderRadius: '50%' }} className="animate-spin" />
      </div>
    );
  }

  const isPublished = profile.is_published !== false;

  return (
    <div style={{ minHeight: '100vh', background: '#F4F1EA', fontFamily: 'var(--font-sans)' }}>
      <div style={{ maxWidth: 720, margin: '0 auto', padding: '26px 20px 90px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
          <KodfolyoLogo size={24} />
          <span style={{ fontSize: 16, fontWeight: 800, letterSpacing: '-.03em', color: '#191720' }}>Kodfolyo</span>
        </div>
        <Link
          href={`/dashboard?username=${encodeURIComponent(activeUsername)}`}
          style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#6B6675', textDecoration: 'none', marginBottom: 22 }}
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Panele dön
        </Link>

        <h1 style={{ margin: '0 0 22px', fontSize: 27, fontWeight: 800, letterSpacing: '-.035em', color: '#191720' }}>Ayarlar</h1>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          {/* Hesap */}
          <div style={cardStyle}>
            <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Hesap</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
              <img src={profile.avatar_url} alt={profile.username} style={{ width: 44, height: 44, borderRadius: '50%' }} />
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 700 }}>{profile.name || profile.username}</div>
                <a href={`https://github.com/${profile.username}`} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 12.5, color: '#6B6675', textDecoration: 'none' }}>
                  <GithubIcon className="w-3.5 h-3.5" /> github.com/{profile.username} <ExternalLink className="w-3 h-3 opacity-60" />
                </a>
              </div>
            </div>
            <div style={{ padding: '11px 13px', borderRadius: 11, background: '#FBF9F4', border: '1px solid rgba(25,23,32,.08)' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: '#8C8797', marginBottom: 3 }}>E-POSTA</div>
              <div style={{ fontSize: 13.5, color: '#3A3644' }}>{profile.email || 'GitHub profilinde herkese açık değil'}</div>
            </div>
          </div>

          {/* Veri indirme */}
          <div style={cardStyle}>
            <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 3 }}>Veri İndirme</div>
            <div style={{ fontSize: 13.5, color: '#6B6675', marginBottom: 16 }}>Profil ve repo verilerini JSON olarak indir.</div>
            <a
              href={`/api/profile/export/${encodeURIComponent(profile.username)}`}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontFamily: 'var(--font-sans)', fontSize: 14, fontWeight: 600, color: '#3A3644', background: '#FBF9F4', border: '1px solid rgba(25,23,32,.12)', borderRadius: 10, padding: '10px 16px', textDecoration: 'none', minHeight: 44 }}
            >
              <Download className="w-4 h-4" /> JSON olarak indir
            </a>
          </div>

          {/* Tehlikeli bölge */}
          <div style={{ ...cardStyle, border: '1px solid rgba(198,49,78,.3)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 16, fontWeight: 700, marginBottom: 3, color: '#C6314E' }}>
              <AlertTriangle className="w-4 h-4" /> Tehlikeli Bölge
            </div>
            <div style={{ fontSize: 13.5, color: '#6B6675', marginBottom: 18 }}>Bu işlemler portfolyonu doğrudan etkiler.</div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, padding: '13px 15px', borderRadius: 11, background: '#FBF9F4', border: '1px solid rgba(25,23,32,.08)', marginBottom: 12, flexWrap: 'wrap' }}>
              <div>
                <div style={{ fontSize: 13.5, fontWeight: 600 }}>{isPublished ? 'Portfolyoyu yayından kaldır' : 'Portfolyo yayından kaldırıldı'}</div>
                <div style={{ fontSize: 12, color: '#8C8797' }}>/{profile.username} adresi {isPublished ? 'herkese açık' : 'gizli'}</div>
              </div>
              <button
                type="button"
                onClick={handleTogglePublish}
                disabled={isTogglingPublish}
                style={{ display: 'flex', alignItems: 'center', gap: 7, fontFamily: 'var(--font-sans)', fontSize: 13, fontWeight: 600, color: '#3A3644', background: '#FFFFFF', border: '1px solid rgba(25,23,32,.16)', borderRadius: 9, padding: '9px 14px', cursor: 'pointer', minHeight: 40, opacity: isTogglingPublish ? 0.6 : 1 }}
              >
                {isPublished ? <><EyeOff className="w-3.5 h-3.5" /> Yayından kaldır</> : <><Eye className="w-3.5 h-3.5" /> Tekrar yayınla</>}
              </button>
            </div>

            <div style={{ padding: '13px 15px', borderRadius: 11, background: 'rgba(198,49,78,.05)', border: '1px solid rgba(198,49,78,.18)' }}>
              <div style={{ fontSize: 13.5, fontWeight: 600, marginBottom: 3 }}>Hesabı sil</div>
              <div style={{ fontSize: 12, color: '#8C8797', marginBottom: 12 }}>Profil ve tüm repo verilerin kalıcı olarak silinir. Geri alınamaz.</div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                <input
                  value={deleteConfirmText}
                  onChange={(e) => setDeleteConfirmText(e.target.value)}
                  placeholder={`Onaylamak için "${profile.username}" yaz`}
                  style={{ flex: 1, minWidth: 180, background: '#FFFFFF', border: '1px solid rgba(198,49,78,.3)', borderRadius: 9, padding: '9px 12px', fontSize: 13, outline: 'none', color: '#191720' }}
                />
                <button
                  type="button"
                  onClick={handleDeleteAccount}
                  disabled={deleteConfirmText !== profile.username || isDeleting}
                  style={{ display: 'flex', alignItems: 'center', gap: 7, fontFamily: 'var(--font-sans)', fontSize: 13, fontWeight: 700, color: '#FFFFFF', background: '#C6314E', border: 0, borderRadius: 9, padding: '9px 16px', cursor: 'pointer', minHeight: 40, opacity: deleteConfirmText !== profile.username || isDeleting ? 0.5 : 1 }}
                >
                  <Trash2 className="w-3.5 h-3.5" /> Hesabı sil
                </button>
              </div>
            </div>
          </div>

          {statusMsg && (
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: '#00845E', textAlign: 'center' }}>{statusMsg}</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function SettingsPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', background: '#F4F1EA' }} />}>
      <SettingsContent />
    </Suspense>
  );
}
