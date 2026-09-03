'use client';

import { useState } from 'react';
import { UserProfile } from '@/types';
import { Copy, Check, RefreshCw } from 'lucide-react';

interface CustomDomainManagerProps {
  profile: UserProfile;
  onSaveDomain: (domain: string | null) => Promise<void>;
  onVerify: () => Promise<{ verified: boolean; error?: string }>;
}

function CopyRow({ label, value }: { label: string; value: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '9px 11px', background: '#FBF9F4', border: '1px solid rgba(25,23,32,.09)', borderRadius: 8, marginBottom: 7 }}>
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9.5, letterSpacing: '.06em', textTransform: 'uppercase', color: '#8C8797', width: 46, flexShrink: 0 }}>{label}</span>
      <span style={{ flex: 1, minWidth: 0, fontFamily: 'var(--font-mono)', fontSize: 12, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{value}</span>
      <button
        type="button"
        onClick={() => { navigator.clipboard.writeText(value); setCopied(true); setTimeout(() => setCopied(false), 1400); }}
        style={{ display: 'grid', placeItems: 'center', width: 26, height: 26, border: '1px solid rgba(25,23,32,.09)', borderRadius: 6, background: '#FFFFFF', color: '#8C8797', cursor: 'pointer', flexShrink: 0 }}
      >
        {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
      </button>
    </div>
  );
}

export default function CustomDomainManager({ profile, onSaveDomain, onVerify }: CustomDomainManagerProps) {
  const [domainInput, setDomainInput] = useState(profile.custom_domain || '');
  const [isSaving, setIsSaving] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verifyError, setVerifyError] = useState<string | null>(null);

  const hasDomain = !!profile.custom_domain;
  const isVerified = profile.custom_domain_verified === true;
  const verificationHost = `_kodfolyo-verify.${profile.custom_domain || 'alanadin.com'}`;
  const verificationValue = `kodfolyo-verify=${profile.id}`;

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSaveDomain(domainInput.trim() || null);
    } finally {
      setIsSaving(false);
    }
  };

  const handleVerify = async () => {
    setIsVerifying(true);
    setVerifyError(null);
    try {
      const result = await onVerify();
      if (!result.verified) setVerifyError(result.error || 'Doğrulanamadı.');
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ background: '#FFFFFF', border: '1px solid rgba(25,23,32,.09)', borderRadius: 12, padding: '15px 16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
          <span style={{ fontSize: 13, fontWeight: 600 }}>Özel alan adı</span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10.5, padding: '3px 8px', borderRadius: 6, background: isVerified ? 'rgba(0,166,118,.12)' : 'rgba(25,23,32,.055)', color: isVerified ? '#00845E' : '#6B6675' }}>
            {isVerified ? 'Doğrulandı' : 'Doğrulanmadı'}
          </span>
        </div>
        <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
          <input
            value={domainInput}
            onChange={(e) => setDomainInput(e.target.value)}
            placeholder="portfolyo.site.com"
            style={{ flex: 1, minWidth: 0, padding: '8px 11px', border: '1px solid rgba(25,23,32,.12)', borderRadius: 7, background: '#FBF9F4', fontFamily: 'var(--font-mono)', fontSize: 12.5, outline: 'none', color: '#191720' }}
          />
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving || domainInput.trim() === (profile.custom_domain || '')}
            style={{ height: 34, padding: '0 15px', border: 0, borderRadius: 8, background: '#1F3AE8', color: '#FFFFFF', fontSize: 12.5, fontWeight: 500, cursor: 'pointer', opacity: isSaving || domainInput.trim() === (profile.custom_domain || '') ? 0.5 : 1 }}
          >
            Kaydet
          </button>
        </div>
      </div>

      {hasDomain && (
        <div style={{ background: '#FFFFFF', border: '1px solid rgba(25,23,32,.09)', borderRadius: 12, padding: '15px 16px' }}>
          <div style={{ fontSize: 13, fontWeight: 600 }}>DNS kaydı</div>
          <p style={{ margin: '5px 0 12px', fontSize: 12, color: '#6B6675', lineHeight: 1.55 }}>
            Hosting sağlayıcının DNS panelinde bu TXT kaydını oluştur, sahiplik doğrulaması için. Doğrulandıktan sonra alan
            adını gerçekten bu siteye yönlendirmek için sağlayıcının (Vercel, Netlify vb.) &quot;Domains&quot; ayarına ekle —
            oradan aldığın CNAME/A kaydını kendi DNS&apos;ine ekle. Yayılması birkaç dakikadan birkaç saate sürebilir.
          </p>
          <CopyRow label="Host" value={verificationHost} />
          <CopyRow label="Değer" value={verificationValue} />
          <button
            type="button"
            onClick={handleVerify}
            disabled={isVerifying}
            style={{ marginTop: 6, display: 'flex', alignItems: 'center', gap: 6, height: 32, padding: '0 14px', border: '1px solid rgba(25,23,32,.16)', borderRadius: 8, background: '#FFFFFF', fontSize: 12.5, fontWeight: 500, cursor: 'pointer', opacity: isVerifying ? 0.6 : 1 }}
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isVerifying ? 'animate-spin' : ''}`} />
            {isVerifying ? 'Kontrol ediliyor...' : 'DNS kaydını doğrula'}
          </button>
          {verifyError && <div style={{ fontSize: 12, color: '#B4531F', marginTop: 8 }}>{verifyError}</div>}
        </div>
      )}
    </div>
  );
}
