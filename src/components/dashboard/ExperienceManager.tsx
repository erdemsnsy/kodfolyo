'use client';

import { useState } from 'react';
import { ExperienceEntry } from '@/types';

interface ExperienceManagerProps {
  entries: ExperienceEntry[];
  onSaveEntries: (entries: ExperienceEntry[]) => Promise<void>;
}

const fieldStyle: React.CSSProperties = {
  background: '#FFFFFF', border: '1px solid rgba(25,23,32,.12)', borderRadius: 10, padding: '9px 12px',
  color: '#191720', fontSize: 13, outline: 'none',
};

export default function ExperienceManager({ entries, onSaveEntries }: ExperienceManagerProps) {
  const [list, setList] = useState<ExperienceEntry[]>(entries || []);
  const [prevEntries, setPrevEntries] = useState<ExperienceEntry[]>(entries);
  const [role, setRole] = useState('');
  const [organization, setOrganization] = useState('');
  const [dateRange, setDateRange] = useState('');
  const [description, setDescription] = useState('');

  if (entries !== prevEntries) {
    setPrevEntries(entries);
    setList(entries || []);
  }

  const handleAdd = () => {
    if (!role.trim() || !organization.trim()) return;
    const entry: ExperienceEntry = {
      id: Date.now().toString(),
      role: role.trim(),
      organization: organization.trim(),
      dateRange: dateRange.trim() || '—',
      description: description.trim(),
    };
    const updated = [entry, ...list];
    setList(updated);
    setRole('');
    setOrganization('');
    setDateRange('');
    setDescription('');
    onSaveEntries(updated).catch(console.error);
  };

  const handleRemove = (id: string) => {
    const updated = list.filter((e) => e.id !== id);
    setList(updated);
    onSaveEntries(updated).catch(console.error);
  };

  return (
    <div style={{ padding: 24, borderRadius: 16, background: '#FFFFFF', border: '1px solid rgba(25,23,32,.09)' }}>
      <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 3 }}>Deneyim & Eğitim</div>
      <div style={{ fontSize: 13.5, color: '#6B6675', marginBottom: 16 }}>Portfolyonda projelerin altında zaman çizelgesi olarak görünür.</div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
        {list.map((entry) => (
          <div key={entry.id} style={{ display: 'flex', alignItems: 'flex-start', gap: 11, padding: '11px 13px', borderRadius: 11, background: '#FBF9F4', border: '1px solid rgba(25,23,32,.1)' }}>
            <div style={{ minWidth: 0, flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 700 }}>{entry.role} <span style={{ fontWeight: 400, color: '#6B6675' }}>· {entry.organization}</span></div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: '#8C8797', marginTop: 2 }}>{entry.dateRange}</div>
              {entry.description && <div style={{ fontSize: 12, color: '#56515F', marginTop: 4 }}>{entry.description}</div>}
            </div>
            <button onClick={() => handleRemove(entry.id)} style={{ width: 44, height: 44, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, color: '#A09BA8', background: 'transparent', border: 0, cursor: 'pointer' }}>×</button>
          </div>
        ))}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          <input placeholder="Rol (Stajyer, Öğrenci...)" value={role} onChange={(e) => setRole(e.target.value)} style={fieldStyle} />
          <input placeholder="Kurum / Şirket" value={organization} onChange={(e) => setOrganization(e.target.value)} style={fieldStyle} />
          <input placeholder="Tarih aralığı (2024 - Günümüz)" value={dateRange} onChange={(e) => setDateRange(e.target.value)} style={{ ...fieldStyle, gridColumn: 'span 2' }} />
          <textarea placeholder="Kısa açıklama (1-2 satır)" value={description} onChange={(e) => setDescription(e.target.value)} rows={2} style={{ ...fieldStyle, gridColumn: 'span 2', resize: 'vertical' }} />
        </div>
        <button
          type="button"
          onClick={handleAdd}
          disabled={!role.trim() || !organization.trim()}
          style={{ fontFamily: 'var(--font-mono)', fontSize: 12.5, color: '#00845E', background: 'transparent', border: '1px dashed rgba(0,166,118,.4)', borderRadius: 11, padding: 11, cursor: 'pointer', opacity: !role.trim() || !organization.trim() ? 0.5 : 1 }}
        >
          + deneyim ekle
        </button>
      </div>
    </div>
  );
}
