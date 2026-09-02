'use client';

import { useState } from 'react';
import { UserProfile } from '@/types';
import { Copy, Check, ShieldCheck, ShieldAlert, ShieldQuestion, RefreshCw } from 'lucide-react';

interface CustomDomainManagerProps {
  profile: UserProfile;
  onSaveDomain: (domain: string | null) => Promise<void>;
  onVerify: () => Promise<{ verified: boolean; error?: string }>;
}

function CopyableCell({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6, minWidth: 0 }}>
      <code style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: '#191720', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{value}</code>
      <button
        type="button"
        onClick={() => { navigator.clipboard.writeText(value); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
        style={{ flexShrink: 0, width: 26, height: 26, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'transparent', border: 0, cursor: 'pointer', color: '#8C8797' }}
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
    <div style={{ padding: 24, borderRadius: 16, background: '#FFFFFF', border: '1px solid rgba(25,23,32,.09)' }}>
      <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 3 }}>Özel Alan Adı</div>
      <div style={{ fontSize: 13.5, color: '#6B6675', marginBottom: 18 }}>Portfolyonu kendi alan adından yayınla. Alan adını sen satın alırsın, DNS kayıtlarını buradan alıp kendi sağlayıcına eklersin.</div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 18, flexWrap: 'wrap' }}>
        <input
          value={domainInput}
          onChange={(e) => setDomainInput(e.target.value)}
          placeholder="portfolyom.com"
          style={{ flex: 1, minWidth: 200, background: '#FBF9F4', border: '1px solid rgba(25,23,32,.12)', borderRadius: 10, padding: '10px 13px', fontSize: 13.5, fontFamily: 'var(--font-mono)', color: '#191720', outline: 'none' }}
        />
        <button
          type="button"
          onClick={handleSave}
          disabled={isSaving || domainInput.trim() === (profile.custom_domain || '')}
          style={{ fontFamily: 'var(--font-sans)', fontSize: 13.5, fontWeight: 700, color: '#F4F1EA', background: '#191720', border: 0, borderRadius: 10, padding: '10px 18px', cursor: 'pointer', opacity: isSaving || domainInput.trim() === (profile.custom_domain || '') ? 0.5 : 1, minHeight: 42 }}
        >
          Kaydet
        </button>
      </div>

      {hasDomain && (
        <>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14, padding: '9px 13px', borderRadius: 10, background: isVerified ? 'rgba(0,166,118,.08)' : 'rgba(180,83,31,.08)', border: `1px solid ${isVerified ? 'rgba(0,166,118,.25)' : 'rgba(180,83,31,.25)'}` }}>
            {isVerified ? <ShieldCheck className="w-4 h-4" style={{ color: '#00845E' }} /> : verifyError ? <ShieldAlert className="w-4 h-4" style={{ color: '#B4531F' }} /> : <ShieldQuestion className="w-4 h-4" style={{ color: '#B4531F' }} />}
            <span style={{ fontSize: 13, fontWeight: 600, color: isVerified ? '#00845E' : '#B4531F' }}>
              {isVerified ? 'Doğrulandı — yayında' : 'Doğrulanmadı — DNS kaydını ekleyip doğrula'}
            </span>
          </div>

          <div style={{ overflowX: 'auto', marginBottom: 14 }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12.5 }}>
              <thead>
                <tr style={{ textAlign: 'left', color: '#8C8797', fontFamily: 'var(--font-mono)', fontSize: 11 }}>
                  <th style={{ padding: '0 10px 8px 0', fontWeight: 500 }}>TİP</th>
                  <th style={{ padding: '0 10px 8px 0', fontWeight: 500 }}>HOST</th>
                  <th style={{ padding: '0 0 8px', fontWeight: 500 }}>DEĞER</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderTop: '1px solid rgba(25,23,32,.08)' }}>
                  <td style={{ padding: '10px 10px 10px 0', fontFamily: 'var(--font-mono)', color: '#3A3644' }}>TXT</td>
                  <td style={{ padding: '10px 10px 10px 0' }}><CopyableCell value={verificationHost} /></td>
                  <td style={{ padding: '10px 0' }}><CopyableCell value={verificationValue} /></td>
                </tr>
                <tr style={{ borderTop: '1px solid rgba(25,23,32,.08)' }}>
                  <td style={{ padding: '10px 10px 10px 0', fontFamily: 'var(--font-mono)', color: '#3A3644' }}>CNAME</td>
                  <td style={{ padding: '10px 10px 10px 0' }}><CopyableCell value={profile.custom_domain || ''} /></td>
                  <td style={{ padding: '10px 0' }}><CopyableCell value="cname.kodfolyo.dev" /></td>
                </tr>
              </tbody>
            </table>
          </div>

          <button
            type="button"
            onClick={handleVerify}
            disabled={isVerifying}
            style={{ display: 'flex', alignItems: 'center', gap: 7, fontFamily: 'var(--font-sans)', fontSize: 13, fontWeight: 600, color: '#3A3644', background: '#FBF9F4', border: '1px solid rgba(25,23,32,.14)', borderRadius: 10, padding: '9px 15px', cursor: 'pointer', minHeight: 42, opacity: isVerifying ? 0.6 : 1 }}
          >
            {isVerifying ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <ShieldCheck className="w-3.5 h-3.5" />}
            {isVerifying ? 'Kontrol ediliyor...' : 'DNS kaydını doğrula'}
          </button>
          {verifyError && <div style={{ fontSize: 12, color: '#B4531F', marginTop: 8 }}>{verifyError}</div>}
        </>
      )}
    </div>
  );
}
