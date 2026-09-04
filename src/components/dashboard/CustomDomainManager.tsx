'use client';

import { useState } from 'react';
import { UserProfile } from '@/types';
import { Copy, Check, RefreshCw, Globe } from 'lucide-react';

interface CustomDomainManagerProps {
  profile: UserProfile;
  onSaveDomain: (domain: string | null) => Promise<void>;
  onVerify: () => Promise<{ verified: boolean; error?: string }>;
}

function CopyRow({ label, value }: { label: string; value: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '9px 11px', background: '#FAFAFA', border: '1px solid rgba(228,228,231,.09)', borderRadius: 8, marginBottom: 7 }}>
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9.5, letterSpacing: '.06em', textTransform: 'uppercase', color: '#A1A1AA', width: 46, flexShrink: 0 }}>{label}</span>
      <span style={{ flex: 1, minWidth: 0, fontFamily: 'var(--font-mono)', fontSize: 12, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{value}</span>
      <button
        type="button"
        onClick={() => { navigator.clipboard.writeText(value); setCopied(true); setTimeout(() => setCopied(false), 1400); }}
        style={{ display: 'grid', placeItems: 'center', width: 26, height: 26, border: '1px solid rgba(228,228,231,.09)', borderRadius: 6, background: '#FFFFFF', color: '#A1A1AA', cursor: 'pointer', flexShrink: 0 }}
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
      <div style={{ background: '#FFFFFF', border: '1px solid rgba(228,228,231,.8)', borderRadius: 16, boxShadow: '0 1px 2px 0 rgba(0,0,0,0.04)', padding: '15px 16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
          <span style={{ fontSize: 13, fontWeight: 600 }}>Özel alan adı</span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10.5, padding: '3px 8px', borderRadius: 6, background: isVerified ? 'rgba(0,166,118,.12)' : 'rgba(228,228,231,.055)', color: isVerified ? '#00845E' : '#71717A' }}>
            {isVerified ? 'Doğrulandı' : 'Doğrulanmadı'}
          </span>
        </div>
        <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
          <div style={{ position: 'relative', flex: 1, minWidth: 0 }}>
            <Globe className="w-3.5 h-3.5" style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#A1A1AA', pointerEvents: 'none' }} />
            <input
              value={domainInput}
              onChange={(e) => setDomainInput(e.target.value)}
              placeholder="portfolyo.site.com"
              className="w-full bg-zinc-50/50 border border-zinc-200 focus:bg-white focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 rounded-lg text-sm text-zinc-900 placeholder:text-zinc-400 transition-all outline-none pl-8 pr-3 py-1.5"
              style={{ fontFamily: 'var(--font-mono)' }}
            />
          </div>
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving || domainInput.trim() === (profile.custom_domain || '')}
            className="hover:bg-zinc-800 transition-colors"
            style={{ height: 34, padding: '0 15px', border: 0, borderRadius: 8, background: '#18181B', color: '#FFFFFF', fontSize: 12.5, fontWeight: 500, cursor: 'pointer', opacity: isSaving || domainInput.trim() === (profile.custom_domain || '') ? 0.5 : 1 }}
          >
            Kaydet
          </button>
        </div>
      </div>

      {!hasDomain && (
        <div style={{ background: '#FFFFFF', border: '1px solid rgba(228,228,231,.8)', borderRadius: 16, boxShadow: '0 1px 2px 0 rgba(0,0,0,0.04)', padding: '18px 20px' }}>
          <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 4 }}>Nasıl çalışır?</div>
          <p style={{ margin: '0 0 16px', fontSize: 12, color: '#71717A', lineHeight: 1.55 }}>
            <code style={{ fontFamily: 'var(--font-mono)', background: '#FAFAFA', padding: '1px 5px', borderRadius: 4 }}>kodfolyo.dev/{profile.username}</code> yerine kendi alan adında yayınla, üç adımda:
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
            {[
              { n: '1', t: 'Alan adını gir', d: 'Yukarıya sahip olduğun domaini yaz ve kaydet.' },
              { n: '2', t: 'DNS kaydını ekle', d: 'Sağlayıcının panelinde TXT kaydını oluştur.' },
              { n: '3', t: 'Doğrula', d: 'Doğrulanınca yönlendirme kaydını (CNAME/A) ekle.' },
            ].map((s) => (
              <div key={s.n} style={{ padding: 14, borderRadius: 12, background: '#FAFAFA', border: '1px solid #E4E4E7' }}>
                <span style={{ display: 'inline-grid', placeItems: 'center', width: 22, height: 22, borderRadius: '50%', background: '#18181B', color: '#FFFFFF', fontSize: 11, fontWeight: 700, marginBottom: 8 }}>{s.n}</span>
                <div style={{ fontSize: 12.5, fontWeight: 600 }}>{s.t}</div>
                <div style={{ fontSize: 11.5, color: '#71717A', marginTop: 3, lineHeight: 1.45 }}>{s.d}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {hasDomain && (
        <div style={{ background: '#FFFFFF', border: '1px solid rgba(228,228,231,.8)', borderRadius: 16, boxShadow: '0 1px 2px 0 rgba(0,0,0,0.04)', padding: '15px 16px' }}>
          <div style={{ fontSize: 13, fontWeight: 600 }}>DNS kaydı</div>
          <p style={{ margin: '5px 0 12px', fontSize: 12, color: '#71717A', lineHeight: 1.55 }}>
            Hosting sağlayıcının DNS panelinde bu TXT kaydını oluştur, sahiplik doğrulaması için. Doğrulandıktan sonra alan
            adını gerçekten bu siteye yönlendirmek için sağlayıcının (Vercel, Netlify vb.) &quot;Domains&quot; ayarına ekle.
            Oradan aldığın CNAME/A kaydını kendi DNS&apos;ine ekle. Yayılması birkaç dakikadan birkaç saate sürebilir.
          </p>
          <CopyRow label="Host" value={verificationHost} />
          <CopyRow label="Değer" value={verificationValue} />
          <button
            type="button"
            onClick={handleVerify}
            disabled={isVerifying}
            className="hover:bg-zinc-50 transition-colors"
            style={{ marginTop: 6, display: 'flex', alignItems: 'center', gap: 6, height: 32, padding: '0 14px', border: '1px solid rgba(228,228,231,.16)', borderRadius: 8, background: '#FFFFFF', fontSize: 12.5, fontWeight: 500, cursor: 'pointer', opacity: isVerifying ? 0.6 : 1 }}
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
