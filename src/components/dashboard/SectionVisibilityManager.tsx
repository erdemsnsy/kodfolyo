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
  { key: 'experience', label: 'Deneyim & Eğitim', desc: 'Eklediğin kayıtların zaman çizelgesi.' },
  { key: 'externalContributions', label: 'Dış Katkılar', desc: 'Başka depolara açtığın PR\'lar.' },
  { key: 'blogPosts', label: 'Yazılar', desc: 'RSS adresinden son yazıların.' },
];

export default function SectionVisibilityManager({ visibility, onChange }: SectionVisibilityManagerProps) {
  const toggle = (key: keyof SectionVisibility) => {
    onChange({ ...visibility, [key]: !visibility[key] }).catch(console.error);
  };

  return (
    <div style={{ background: '#FFFFFF', border: '1px solid rgba(25,23,32,.09)', borderRadius: 12, overflow: 'hidden' }}>
      {SECTION_LABELS.map(({ key, label, desc }, i) => {
        const on = visibility[key] !== false;
        return (
          <div
            key={key}
            style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '11px 16px', borderBottom: i < SECTION_LABELS.length - 1 ? '1px solid rgba(25,23,32,.06)' : 'none' }}
          >
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 600 }}>{label}</div>
              <div style={{ fontSize: 11.5, color: '#8C8797', marginTop: 2 }}>{desc}</div>
            </div>
            <button
              type="button"
              onClick={() => toggle(key)}
              style={{ position: 'relative', width: 36, height: 21, borderRadius: 999, border: 0, cursor: 'pointer', padding: 0, flexShrink: 0, background: on ? '#00A676' : 'rgba(25,23,32,.16)' }}
            >
              <span style={{ position: 'absolute', top: 3, left: on ? 18 : 3, width: 15, height: 15, borderRadius: '50%', background: '#FFFFFF', boxShadow: '0 1px 2px rgba(25,23,32,.25)', transition: 'left .15s ease' }} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
