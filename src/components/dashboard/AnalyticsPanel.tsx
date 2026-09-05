'use client';

import { useEffect, useState } from 'react';
import { Eye, Users, MousePointerClick, FileDown } from 'lucide-react';
import type { AnalyticsSummary } from '@/lib/supabase/server';

interface AnalyticsPanelProps {
  username: string;
}

const cardStyle: React.CSSProperties = { background: '#FFFFFF', border: '1px solid rgba(228,228,231,.8)', borderRadius: 16, boxShadow: '0 1px 2px 0 rgba(0,0,0,0.04)' };

export default function AnalyticsPanel({ username }: AnalyticsPanelProps) {
  const [summary, setSummary] = useState<AnalyticsSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!username) return;
    // username değişince (aynı panel açıkken başka bir kullanıcıya geçilince) eski
    // özeti göstermeye devam etmemek için loading'e geri dönülüyor.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsLoading(true);
    fetch(`/api/analytics/${encodeURIComponent(username)}`)
      .then((res) => res.json())
      .then((data) => { if (data.success) setSummary(data.summary); })
      .catch((err) => console.error(err))
      .finally(() => setIsLoading(false));
  }, [username]);

  if (isLoading) {
    return (
      <div style={{ ...cardStyle, padding: '13px 14px' }}>
        <div style={{ fontSize: 13, color: '#71717A' }}>Analytics yükleniyor...</div>
      </div>
    );
  }

  if (!summary) return null;

  const maxDaily = Math.max(1, ...summary.dailyViews.map((d) => d.count));
  const total = summary.dailyViews.length;

  const metrics = [
    { label: 'Görüntülenme', value: summary.totalViews, icon: Eye },
    { label: 'Tekil', value: summary.uniqueVisitors30d, icon: Users },
    { label: 'Tıklama', value: summary.totalLinkClicks, icon: MousePointerClick },
    { label: 'PDF', value: summary.totalPdfDownloads, icon: FileDown },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
        {metrics.map((m) => {
          const Icon = m.icon;
          return (
            <div key={m.label} style={{ ...cardStyle, padding: '13px 14px' }}>
              <span style={{ display: 'grid', placeItems: 'center', width: 26, height: 26, borderRadius: 7, background: '#FAFAFA', border: '1px solid rgba(228,228,231,.09)', color: '#52525B' }}>
                <Icon className="w-3.5 h-3.5" />
              </span>
              <div style={{ marginTop: 11, fontSize: 20, fontWeight: 600, letterSpacing: '-.03em' }}>{m.value.toLocaleString('tr-TR')}</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9.5, letterSpacing: '.06em', textTransform: 'uppercase', color: '#A1A1AA', marginTop: 3 }}>{m.label}</div>
            </div>
          );
        })}
      </div>

      <div style={{ ...cardStyle, padding: '15px 16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 12.5, fontWeight: 600 }}>Görüntülenme</span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10.5, color: '#A1A1AA' }}>son 30 gün</span>
        </div>
        <div style={{ marginTop: 14, display: 'flex', alignItems: 'flex-end', gap: 4, height: 110 }}>
          {summary.dailyViews.map((d, i) => (
            <span
              key={d.date}
              title={`${d.date}: ${d.count}`}
              style={{
                flex: 1, borderRadius: 3, background: i >= total - 5 ? '#18181B' : 'rgba(24,24,27,.22)',
                height: `${Math.max(3, (d.count / maxDaily) * 100)}%`,
              }}
            />
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        <div style={{ ...cardStyle, overflow: 'hidden' }}>
          <div style={{ padding: '11px 14px', borderBottom: '1px solid rgba(228,228,231,.09)', fontSize: 12.5, fontWeight: 600 }}>Trafik kaynağı</div>
          {summary.topReferrers.length === 0 ? (
            <div style={{ padding: '11px 14px', fontSize: 12.5, color: '#A1A1AA' }}>Henüz veri yok.</div>
          ) : (
            summary.topReferrers.map((r) => (
              <div key={r.host} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, padding: '8px 14px', borderBottom: '1px solid rgba(228,228,231,.06)' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11.5, color: '#52525B' }}>{r.host}</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11.5 }}>{r.count}</span>
              </div>
            ))
          )}
        </div>

        <div style={{ ...cardStyle, overflow: 'hidden' }}>
          <div style={{ padding: '11px 14px', borderBottom: '1px solid rgba(228,228,231,.09)', fontSize: 12.5, fontWeight: 600 }}>En çok tıklanan</div>
          {summary.topLinks.length === 0 ? (
            <div style={{ padding: '11px 14px', fontSize: 12.5, color: '#A1A1AA' }}>Henüz veri yok.</div>
          ) : (
            summary.topLinks.map((l) => (
              <div key={l.url} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, padding: '8px 14px', borderBottom: '1px solid rgba(228,228,231,.06)' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11.5, color: '#52525B', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{l.label}</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11.5, flexShrink: 0 }}>{l.count}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
