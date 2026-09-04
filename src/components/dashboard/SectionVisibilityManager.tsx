'use client';

import { SectionVisibility } from '@/types';

interface SectionVisibilityManagerProps {
  visibility: SectionVisibility;
  onChange: (visibility: SectionVisibility) => Promise<void>;
}

const SECTION_LABELS: { key: keyof SectionVisibility; label: string; desc: string }[] = [
  { key: 'featuredProject', label: 'Vitrin Projesi', desc: 'Seçtiğin tek projeyi büyük kart olarak gösterir.' },
  { key: 'techStack', label: 'Dil Dağılımı', desc: 'Depolarındaki dillerin oransal çubuğu.' },
  { key: 'projects', label: "Proje Grid'i", desc: 'Görünür depoların kart listesi.' },
  { key: 'manualProjects', label: 'Diğer Projeler', desc: 'GitHub dışı, elle eklediğin projeler.' },
  { key: 'experience', label: 'Deneyim & Eğitim', desc: 'Eklediğin kayıtların zaman çizelgesi.' },
  { key: 'certificates', label: 'Sertifikalar', desc: 'Eklediğin sertifikaların listesi.' },
  { key: 'externalContributions', label: 'Dış Katkılar', desc: 'Başka depolara açtığın PR\'lar.' },
  { key: 'blogPosts', label: 'Yazılar', desc: 'RSS adresinden son yazıların.' },
];

export default function SectionVisibilityManager({ visibility, onChange }: SectionVisibilityManagerProps) {
  const toggle = (key: keyof SectionVisibility) => {
    onChange({ ...visibility, [key]: !visibility[key] }).catch(console.error);
  };

  const onCount = SECTION_LABELS.filter(({ key }) => visibility[key] !== false).length;
  const setAll = (value: boolean) => {
    const next = { ...visibility };
    for (const { key } of SECTION_LABELS) next[key] = value;
    onChange(next).catch(console.error);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, padding: '11px 16px', background: '#FFFFFF', border: '1px solid rgba(228,228,231,.8)', borderRadius: 14, boxShadow: '0 1px 2px 0 rgba(0,0,0,0.04)' }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11.5, color: '#71717A' }}>
          <b style={{ color: '#18181B', fontWeight: 700 }}>{onCount}</b>/{SECTION_LABELS.length} bölüm açık
        </span>
        <div style={{ display: 'flex', gap: 6 }}>
          <button type="button" onClick={() => setAll(true)} className="hover:bg-zinc-50 transition-colors" style={{ height: 26, padding: '0 10px', fontSize: 11.5, fontWeight: 500, color: '#52525B', background: '#FFFFFF', border: '1px solid #E4E4E7', borderRadius: 7, cursor: 'pointer' }}>Tümünü aç</button>
          <button type="button" onClick={() => setAll(false)} className="hover:bg-zinc-50 transition-colors" style={{ height: 26, padding: '0 10px', fontSize: 11.5, fontWeight: 500, color: '#52525B', background: '#FFFFFF', border: '1px solid #E4E4E7', borderRadius: 7, cursor: 'pointer' }}>Tümünü kapat</button>
        </div>
      </div>

      <div style={{ background: '#FFFFFF', border: '1px solid rgba(228,228,231,.8)', borderRadius: 16, boxShadow: '0 1px 2px 0 rgba(0,0,0,0.04)', overflow: 'hidden' }}>
      {SECTION_LABELS.map(({ key, label, desc }, i) => {
        const on = visibility[key] !== false;
        return (
          <div
            key={key}
            style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '10px 16px', borderBottom: i < SECTION_LABELS.length - 1 ? '1px solid rgba(228,228,231,.06)' : 'none' }}
          >
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 12.5, fontWeight: 600 }}>{label}</div>
              <div style={{ fontSize: 11, color: '#A1A1AA', marginTop: 2 }}>{desc}</div>
            </div>
            <button
              type="button"
              onClick={() => toggle(key)}
              style={{ position: 'relative', width: 36, height: 21, borderRadius: 999, border: 0, cursor: 'pointer', padding: 0, flexShrink: 0, background: on ? '#00A676' : 'rgba(228,228,231,.16)' }}
            >
              <span style={{ position: 'absolute', top: 3, left: on ? 18 : 3, width: 15, height: 15, borderRadius: '50%', background: '#FFFFFF', boxShadow: '0 1px 2px rgba(228,228,231,.25)', transition: 'left .15s ease' }} />
            </button>
          </div>
        );
      })}
      </div>
    </div>
  );
}
