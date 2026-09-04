'use client';

import { useState } from 'react';
import type React from 'react';
import Image from 'next/image';
import { ExperienceEntry } from '@/types';
import { Trash2, Plus, Briefcase, Building2, CalendarRange, AlignLeft } from 'lucide-react';

interface ExperienceManagerProps {
  entries: ExperienceEntry[];
  onSaveEntries: (entries: ExperienceEntry[]) => Promise<void>;
}

const FIELD_CLASS =
  'w-full bg-white border border-zinc-200 focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 rounded-lg text-sm text-zinc-900 placeholder:text-zinc-400 transition-all outline-none pl-8 pr-2.5 py-1.5';

function IconField({ icon: Icon, ...props }: { icon: typeof Briefcase } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div style={{ position: 'relative' }}>
      <Icon className="w-3.5 h-3.5" style={{ position: 'absolute', left: 9, top: '50%', transform: 'translateY(-50%)', color: '#A1A1AA', pointerEvents: 'none' }} />
      <input {...props} className={FIELD_CLASS} />
    </div>
  );
}

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
      {list.length > 0 ? (
        <div style={{ background: '#FFFFFF', border: '1px solid rgba(228,228,231,.8)', borderRadius: 16, boxShadow: '0 1px 2px 0 rgba(0,0,0,0.04)', overflow: 'hidden' }}>
          {list.map((entry) => (
            <div key={entry.id} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: '13px 16px', borderBottom: '1px solid rgba(228,228,231,.06)' }}>
              <span style={{ display: 'grid', placeItems: 'center', width: 30, height: 30, borderRadius: 9, background: '#FAFAFA', border: '1px solid rgba(228,228,231,.8)', color: '#52525B', flexShrink: 0 }}>
                <Briefcase className="w-3.5 h-3.5" />
              </span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, flexWrap: 'wrap' }}>
                  <span style={{ fontSize: 13.5, fontWeight: 600 }}>{entry.role}</span>
                  <span style={{ fontSize: 12.5, color: '#52525B' }}>{entry.organization}</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10.5, color: '#A1A1AA' }}>{entry.dateRange}</span>
                </div>
                {entry.description && <div style={{ fontSize: 12, color: '#71717A', marginTop: 5, lineHeight: 1.5 }}>{entry.description}</div>}
              </div>
              <button
                onClick={() => handleRemove(entry.id)}
                style={{ display: 'grid', placeItems: 'center', width: 27, height: 27, border: '1px solid rgba(228,228,231,.09)', borderRadius: 7, background: '#FFFFFF', color: '#A1A1AA', cursor: 'pointer', flexShrink: 0 }}
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, textAlign: 'center', padding: '30px 20px', borderRadius: 16, border: '1px dashed rgba(228,228,231,.9)', color: '#A1A1AA' }}>
          <span style={{ position: 'relative', width: 44, height: 44 }}>
            <Image src="/icons/deneyim-bos.png" alt="" fill sizes="44px" style={{ objectFit: 'contain' }} />
          </span>
          <span style={{ fontSize: 12.5 }}>Henüz deneyim veya eğitim kaydı eklemedin.</span>
        </div>
      )}

      <div style={{ background: '#FAFAFA', border: '1px solid rgba(228,228,231,.8)', borderRadius: 16, boxShadow: '0 1px 2px 0 rgba(0,0,0,0.04)', padding: '14px 16px' }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9.5, letterSpacing: '.07em', textTransform: 'uppercase', color: '#A1A1AA', marginBottom: 11 }}>Yeni kayıt</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 9 }}>
          <IconField icon={Briefcase} placeholder="Rol" value={role} onChange={(e) => setRole(e.target.value)} />
          <IconField icon={Building2} placeholder="Kurum" value={organization} onChange={(e) => setOrganization(e.target.value)} />
          <IconField icon={CalendarRange} placeholder="2021 — 2023" value={dateRange} onChange={(e) => setDateRange(e.target.value)} />
          <div style={{ position: 'relative', gridColumn: '1 / -1' }}>
            <AlignLeft className="w-3.5 h-3.5" style={{ position: 'absolute', left: 9, top: 11, color: '#A1A1AA', pointerEvents: 'none' }} />
            <textarea placeholder="Kısa açıklama" value={description} onChange={(e) => setDescription(e.target.value)} rows={2} className={`${FIELD_CLASS} resize-y`} style={{ lineHeight: 1.5 }} />
          </div>
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
          <Plus className="w-3.5 h-3.5" /> deneyim ekle
        </button>
      </div>
    </div>
  );
}
