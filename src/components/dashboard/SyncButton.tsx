'use client';

import { useState } from 'react';
import { RefreshCw, CheckCircle2, AlertCircle } from 'lucide-react';

interface SyncButtonProps {
  onSync: () => Promise<void>;
  lastSyncedAt?: string;
}

export default function SyncButton({ onSync, lastSyncedAt }: SyncButtonProps) {
  const [isSyncing, setIsSyncing] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSync = async () => {
    setIsSyncing(true);
    setMessage(null);

    try {
      await onSync();
      setMessage({ type: 'success', text: 'GitHub verileri senkronize edildi!' });
      setTimeout(() => setMessage(null), 4000);
    } catch (err) {
      console.error(err);
      setMessage({ type: 'error', text: 'Veri yenilenirken hata oluştu.' });
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 rounded-3xl border border-[#3a2c22] bg-[#1f1a16] text-xs shadow-[5px_5px_0_0_#14110f]">
      <div className="flex items-center gap-3 text-center sm:text-left">
        <div className="p-2.5 rounded-xl bg-[#ff5a3c]/10 text-[#ff5a3c] border border-[#ff5a3c]/25">
          <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
        </div>
        <div>
          <h4 className="font-bold text-[#fdf6ec]">GitHub Verilerini Yenile</h4>
          <p className="text-xs text-[#cbb9a0]">
            {lastSyncedAt
              ? `Son senkronizasyon: ${new Date(lastSyncedAt).toLocaleString('tr-TR')}`
              : 'GitHub REST API üzerinden verileri yeniler.'}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {message && (
          <span
            className={`text-xs font-semibold flex items-center gap-1 ${
              message.type === 'success' ? 'text-emerald-400' : 'text-red-400'
            }`}
          >
            {message.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
            {message.text}
          </span>
        )}

        <button
          type="button"
          onClick={handleSync}
          disabled={isSyncing}
          className="flex items-center gap-2 rounded-full bg-[#ff5a3c] hover:bg-[#ff7159] px-4 py-2.5 font-bold text-[#14110f] shadow-[3px_3px_0_0_#14110f] transition active:scale-95 disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
          <span>{isSyncing ? 'Senkronize Ediliyor...' : 'Yenile'}</span>
        </button>
      </div>
    </div>
  );
}
