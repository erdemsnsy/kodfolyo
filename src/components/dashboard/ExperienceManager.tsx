'use client';

import { useState } from 'react';
import { ExperienceEntry } from '@/types';
import { Trash2, Plus } from 'lucide-react';

interface ExperienceManagerProps {
  entries: ExperienceEntry[];
  onSaveEntries: (entries: ExperienceEntry[]) => Promise<void>;
}

const fieldStyle: React.CSSProperties = {
  width: '100%', padding: '8px 10px', border: '1px solid rgba(25,23,32,.12)', borderRadius: 7,
  background: '#FFFFFF', color: '#191720', fontSize: 12.5, outline: 'none', fontFamily: 'var(--font-sans)',
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

  const ready = role.trim() && organization.trim() && dateRange.trim();

  const handleAdd = () => {
    if (!ready) return;
    const entry: ExperienceEntry = {
      id: Date.now().toString(),
      role: role.trim(),
      organization: organization.trim(),
      dateRange: dateRange.trim(),
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {list.length > 0 && (
        <div style={{ background: '#FFFFFF', border: '1px solid rgba(25,23,32,.09)', borderRadius: 12, overflow: 'hidden' }}>
          {list.map((entry) => (
            <div key={entry.id} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: '13px 16px', borderBottom: '1px solid rgba(25,23,32,.06)' }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, flexWrap: 'wrap' }}>
                  <span style={{ fontSize: 13.5, fontWeight: 600 }}>{entry.role}</span>
                  <span style={{ fontSize: 12.5, color: '#56515F' }}>{entry.organization}</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10.5, color: '#8C8797' }}>{entry.dateRange}</span>
                </div>
                {entry.description && <div style={{ fontSize: 12, color: '#6B6675', marginTop: 5, lineHeight: 1.5 }}>{entry.description}</div>}
              </div>
              <button
                onClick={() => handleRemove(entry.id)}
                style={{ display: 'grid', placeItems: 'center', width: 27, height: 27, border: '1px solid rgba(25,23,32,.09)', borderRadius: 7, background: '#FFFFFF', color: '#8C8797', cursor: 'pointer', flexShrink: 0 }}
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}

      <div style={{ background: '#FBF9F4', border: '1px solid rgba(25,23,32,.09)', borderRadius: 12, padding: '14px 16px' }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9.5, letterSpacing: '.07em', textTransform: 'uppercase', color: '#8C8797', marginBottom: 11 }}>Yeni kayıt</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 9 }}>
          <input placeholder="Rol" value={role} onChange={(e) => setRole(e.target.value)} style={fieldStyle} />
          <input placeholder="Kurum" value={organization} onChange={(e) => setOrganization(e.target.value)} style={fieldStyle} />
          <input placeholder="2021 — 2023" value={dateRange} onChange={(e) => setDateRange(e.target.value)} style={fieldStyle} />
          <textarea placeholder="Kısa açıklama" value={description} onChange={(e) => setDescription(e.target.value)} rows={2} style={{ ...fieldStyle, gridColumn: '1 / -1', resize: 'vertical', lineHeight: 1.5 }} />
        </div>
        <button
          type="button"
          onClick={handleAdd}
          disabled={!ready}
          style={{
            marginTop: 11, display: 'flex', alignItems: 'center', gap: 6, height: 32, padding: '0 14px', border: 0, borderRadius: 8,
            fontSize: 12.5, fontWeight: 500, cursor: ready ? 'pointer' : 'not-allowed',
            background: ready ? '#191720' : 'rgba(25,23,32,.07)', color: ready ? '#FFFFFF' : '#8C8797',
          }}
        >
          <Plus className="w-3.5 h-3.5" /> deneyim ekle
        </button>
      </div>
    </div>
  );
}
