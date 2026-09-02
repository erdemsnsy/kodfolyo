'use client';

import { SectionVisibility } from '@/types';

interface SectionVisibilityManagerProps {
  visibility: SectionVisibility;
  onChange: (visibility: SectionVisibility) => Promise<void>;
}

const SECTION_LABELS: { key: keyof SectionVisibility; label: string; desc: string }[] = [
  { key: 'featuredProject', label: 'Vitrin Projesi', desc: 'Grid üstündeki tam genişlikte öne çıkan kart.' },
  { key: 'techStack', label: 'Dil Dağılımı', desc: 'Teknoloji/dil yüzde çubuğu.' },
  { key: 'projects', label: 'Proje Grid\'i', desc: 'Görünür repoların kart listesi.' },
  { key: 'experience', label: 'Deneyim & Eğitim', desc: 'Zaman çizelgesi bölümü.' },
  { key: 'externalContributions', label: 'Dış Katkılar', desc: 'Başka projelere açtığın birleşen PR\'lar.' },
  { key: 'blogPosts', label: 'Yazılar', desc: 'RSS akışından son yazılar.' },
];

export default function SectionVisibilityManager({ visibility, onChange }: SectionVisibilityManagerProps) {
  const toggle = (key: keyof SectionVisibility) => {
    onChange({ ...visibility, [key]: !visibility[key] }).catch(console.error);
  };

  return (
    <div style={{ padding: 24, borderRadius: 16, background: '#FFFFFF', border: '1px solid rgba(25,23,32,.09)' }}>
      <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 3 }}>Bölümler</div>
      <div style={{ fontSize: 13.5, color: '#6B6675', marginBottom: 16 }}>Portfolyonda hangi bölümlerin görüneceğini seç.</div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {SECTION_LABELS.map(({ key, label, desc }) => {
          const on = visibility[key] !== false;
          return (
            <div key={key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, padding: '11px 13px', borderRadius: 11, background: '#FBF9F4', border: '1px solid rgba(25,23,32,.1)' }}>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 600 }}>{label}</div>
                <div style={{ fontSize: 11.5, color: '#8C8797' }}>{desc}</div>
              </div>
              <button
                type="button"
                onClick={() => toggle(key)}
                style={{ position: 'relative', width: 42, height: 24, borderRadius: 999, border: 0, cursor: 'pointer', padding: 0, flexShrink: 0, background: on ? '#1F3AE8' : 'rgba(25,23,32,.14)' }}
              >
                <span style={{ position: 'absolute', top: 3, left: on ? 21 : 3, width: 18, height: 18, borderRadius: '50%', background: '#F4F1EA', transition: 'left .16s ease' }} />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
