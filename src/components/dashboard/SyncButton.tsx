'use client';

import { useState } from 'react';

interface SyncButtonProps {
  onSync: () => Promise<void>;
}

export default function SyncButton({ onSync }: SyncButtonProps) {
  const [isSyncing, setIsSyncing] = useState(false);

  const handleSync = async () => {
    setIsSyncing(true);
    try {
      await onSync();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleSync}
      disabled={isSyncing}
      style={{
        width: '100%', fontFamily: 'var(--font-sans)', fontSize: 13, fontWeight: 600, color: '#191720',
        background: 'rgba(0,166,118,.16)', border: '1px solid rgba(0,166,118,.34)', borderRadius: 9,
        padding: 9, cursor: 'pointer', opacity: isSyncing ? 0.6 : 1,
      }}
    >
      {isSyncing ? 'Yenileniyor…' : 'GitHub verisini yenile'}
    </button>
  );
}
