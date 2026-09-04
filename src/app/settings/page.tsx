'use client';

import { useState, Suspense, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { KodfolyoLogo } from '@/components/icons/KodfolyoLogo';
import { UserProfile } from '@/types';
import { sanitizeUsername } from '@/lib/github/fetcher';
import SettingsPanel from '@/components/dashboard/SettingsPanel';
import { ArrowLeft } from 'lucide-react';

function SettingsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeUsername, setActiveUsername] = useState('');
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

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

  const handleTogglePublish = async (nextPublished: boolean) => {
    try {
      await fetch('/api/profile/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: activeUsername, isPublished: nextPublished }),
      });
      setProfile((prev) => (prev ? { ...prev, is_published: nextPublished } : prev));
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteAccount = async () => {
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
    }
  };

  if (isLoading || !profile) {
    return (
      <div style={{ minHeight: '100vh', background: '#F9FAFB', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: 22, height: 22, border: '2px solid #18181B', borderTopColor: 'transparent', borderRadius: '50%' }} className="animate-spin" />
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#F9FAFB', fontFamily: 'var(--font-sans)' }}>
      <div style={{ maxWidth: 660, margin: '0 auto', padding: '26px 20px 90px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
          <KodfolyoLogo size={24} />
          <span style={{ fontSize: 16, fontWeight: 800, letterSpacing: '-.03em', color: '#18181B' }}>Kodfolyo</span>
        </div>
        <Link
          href={`/dashboard?username=${encodeURIComponent(activeUsername)}`}
          style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#71717A', textDecoration: 'none', marginBottom: 22 }}
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Panele dön
        </Link>

        <h1 className="text-zinc-900 font-semibold" style={{ margin: '0 0 18px', fontSize: 24, letterSpacing: '-.03em' }}>Ayarlar</h1>

        <SettingsPanel profile={profile} onTogglePublish={handleTogglePublish} onDeleteAccount={handleDeleteAccount} />
      </div>
    </div>
  );
}

export default function SettingsPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', background: '#F9FAFB' }} />}>
      <SettingsContent />
    </Suspense>
  );
}
