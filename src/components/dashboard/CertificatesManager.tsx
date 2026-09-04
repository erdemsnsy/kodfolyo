'use client';

import { useState } from 'react';
import type React from 'react';
import { Certificate } from '@/types';
import { Trash2, Plus, Award, Building2, CalendarRange, Link2 } from 'lucide-react';

interface CertificatesManagerProps {
  certificates: Certificate[];
  onSaveCertificates: (certificates: Certificate[]) => Promise<void>;
}

const FIELD_CLASS =
  'w-full bg-white border border-zinc-200 focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 rounded-lg text-sm text-zinc-900 placeholder:text-zinc-400 transition-all outline-none pl-8 pr-2.5 py-1.5';

function IconField({ icon: Icon, ...props }: { icon: typeof Award } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div style={{ position: 'relative' }}>
      <Icon className="w-3.5 h-3.5" style={{ position: 'absolute', left: 9, top: '50%', transform: 'translateY(-50%)', color: '#A1A1AA', pointerEvents: 'none' }} />
      <input {...props} className={FIELD_CLASS} />
    </div>
  );
}

export default function CertificatesManager({ certificates, onSaveCertificates }: CertificatesManagerProps) {
  const [list, setList] = useState<Certificate[]>(certificates || []);
  const [prevCertificates, setPrevCertificates] = useState<Certificate[]>(certificates);
  const [name, setName] = useState('');
  const [issuer, setIssuer] = useState('');
  const [date, setDate] = useState('');
  const [url, setUrl] = useState('');

  if (certificates !== prevCertificates) {
    setPrevCertificates(certificates);
    setList(certificates || []);
  }

  const ready = name.trim() && issuer.trim();

  const handleAdd = () => {
    if (!ready) return;
    const entry: Certificate = {
      id: Date.now().toString(),
      name: name.trim(),
      issuer: issuer.trim(),
      date: date.trim(),
      url: url.trim() || undefined,
    };
    const updated = [entry, ...list];
    setList(updated);
    setName('');
    setIssuer('');
    setDate('');
    setUrl('');
    onSaveCertificates(updated).catch(console.error);
  };

  const handleRemove = (id: string) => {
    const updated = list.filter((c) => c.id !== id);
    setList(updated);
    onSaveCertificates(updated).catch(console.error);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {list.length > 0 ? (
        <div style={{ background: '#FFFFFF', border: '1px solid rgba(228,228,231,.8)', borderRadius: 16, boxShadow: '0 1px 2px 0 rgba(0,0,0,0.04)', overflow: 'hidden' }}>
          {list.map((cert) => (
            <div key={cert.id} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: '13px 16px', borderBottom: '1px solid rgba(228,228,231,.06)' }}>
              <span style={{ display: 'grid', placeItems: 'center', width: 30, height: 30, borderRadius: 9, background: '#FAFAFA', border: '1px solid rgba(228,228,231,.8)', color: '#52525B', flexShrink: 0 }}>
                <Award className="w-3.5 h-3.5" />
              </span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, flexWrap: 'wrap' }}>
                  <span style={{ fontSize: 13.5, fontWeight: 600 }}>{cert.name}</span>
                  <span style={{ fontSize: 12.5, color: '#52525B' }}>{cert.issuer}</span>
                  {cert.date && <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10.5, color: '#A1A1AA' }}>{cert.date}</span>}
                </div>
                {cert.url && (
                  <a href={cert.url} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontFamily: 'var(--font-mono)', fontSize: 11, color: '#A1A1AA', marginTop: 5 }}>
                    <Link2 className="w-3 h-3" /> {cert.url.replace(/^https?:\/\//, '')}
                  </a>
                )}
              </div>
              <button
                onClick={() => handleRemove(cert.id)}
                style={{ display: 'grid', placeItems: 'center', width: 27, height: 27, border: '1px solid rgba(228,228,231,.09)', borderRadius: 7, background: '#FFFFFF', color: '#A1A1AA', cursor: 'pointer', flexShrink: 0 }}
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, textAlign: 'center', padding: '30px 20px', borderRadius: 16, border: '1px dashed rgba(228,228,231,.9)', color: '#A1A1AA' }}>
          <Award className="w-8 h-8" />
          <span style={{ fontSize: 12.5 }}>Henüz sertifika eklemedin.</span>
        </div>
      )}

      <div style={{ background: '#FAFAFA', border: '1px solid rgba(228,228,231,.8)', borderRadius: 16, boxShadow: '0 1px 2px 0 rgba(0,0,0,0.04)', padding: '14px 16px' }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9.5, letterSpacing: '.07em', textTransform: 'uppercase', color: '#A1A1AA', marginBottom: 11 }}>Yeni sertifika</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 9 }}>
          <IconField icon={Award} placeholder="Sertifika adı" value={name} onChange={(e) => setName(e.target.value)} />
          <IconField icon={Building2} placeholder="Veren kurum" value={issuer} onChange={(e) => setIssuer(e.target.value)} />
          <IconField icon={CalendarRange} placeholder="2024" value={date} onChange={(e) => setDate(e.target.value)} />
          <IconField icon={Link2} placeholder="Doğrulama linki (opsiyonel)" value={url} onChange={(e) => setUrl(e.target.value)} style={{ fontFamily: 'var(--font-mono)' }} />
        </div>
        <button
          type="button"
          onClick={handleAdd}
          disabled={!ready}
          className={ready ? 'hover:bg-zinc-800 transition-colors' : ''}
          style={{
            marginTop: 11, display: 'flex', alignItems: 'center', gap: 6, height: 32, padding: '0 14px', border: 0, borderRadius: 8,
            fontSize: 12.5, fontWeight: 500, cursor: ready ? 'pointer' : 'not-allowed',
            background: ready ? '#18181B' : 'rgba(228,228,231,.07)', color: ready ? '#FFFFFF' : '#A1A1AA',
          }}
        >
          <Plus className="w-3.5 h-3.5" /> sertifika ekle
        </button>
      </div>
    </div>
  );
}
