'use client';

import { useEffect, useState } from 'react';
import { Eye, Users, MousePointerClick, FileDown } from 'lucide-react';
import type { AnalyticsSummary } from '@/lib/supabase/server';

interface AnalyticsPanelProps {
  username: string;
}

const cardStyle: React.CSSProperties = { padding: 24, borderRadius: 16, background: '#FFFFFF', border: '1px solid rgba(25,23,32,.09)' };

export default function AnalyticsPanel({ username }: AnalyticsPanelProps) {
  const [summary, setSummary] = useState<AnalyticsSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!username) return;
    setIsLoading(true);
    fetch(`/api/analytics/${encodeURIComponent(username)}`)
      .then((res) => res.json())
      .then((data) => { if (data.success) setSummary(data.summary); })
      .catch((err) => console.error(err))
      .finally(() => setIsLoading(false));
  }, [username]);

  if (isLoading) {
    return (
      <div style={cardStyle}>
        <div style={{ fontSize: 13.5, color: '#6B6675' }}>Analytics yükleniyor...</div>
      </div>
    );
  }

  if (!summary) return null;

  const maxDaily = Math.max(1, ...summary.dailyViews.map((d) => d.count));

  const metrics = [
    { label: 'Görüntülenme', value: summary.totalViews, icon: Eye },
    { label: 'Tekil Ziyaretçi (30 gün)', value: summary.uniqueVisitors30d, icon: Users },
    { label: 'Link Tıklaması', value: summary.totalLinkClicks, icon: MousePointerClick },
    { label: 'PDF İndirme', value: summary.totalPdfDownloads, icon: FileDown },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12 }}>
        {metrics.map((m) => {
          const Icon = m.icon;
          return (
            <div key={m.label} style={{ ...cardStyle, padding: 18 }}>
              <Icon className="w-4 h-4" style={{ color: '#1F3AE8', marginBottom: 10 }} />
              <div style={{ fontSize: 24, fontWeight: 800, color: '#191720' }}>{m.value}</div>
              <div style={{ fontSize: 12, color: '#6B6675', marginTop: 2 }}>{m.label}</div>
            </div>
          );
        })}
      </div>

      <div style={cardStyle}>
        <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 14 }}>Son 30 Gün</div>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 3, height: 90, overflowX: 'auto' }}>
          {summary.dailyViews.map((d) => (
            <div key={d.date} title={`${d.date}: ${d.count}`} style={{ flex: 1, minWidth: 6, display: 'flex', alignItems: 'flex-end' }}>
              <div style={{ width: '100%', height: `${Math.max(3, (d.count / maxDaily) * 100)}%`, background: '#1F3AE8', borderRadius: '3px 3px 0 0', opacity: d.count === 0 ? 0.15 : 1 }} />
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16 }}>
        <div style={cardStyle}>
          <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 12 }}>Trafik Kaynağı</div>
          {summary.topReferrers.length === 0 ? (
            <div style={{ fontSize: 13, color: '#8C8797' }}>Henüz veri yok.</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
              {summary.topReferrers.map((r) => (
                <div key={r.host} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 13 }}>
                  <span style={{ color: '#3A3644' }}>{r.host}</span>
                  <span style={{ fontFamily: 'var(--font-mono)', color: '#8C8797' }}>{r.count}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={cardStyle}>
          <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 12 }}>En Çok Tıklanan Bağlantılar</div>
          {summary.topLinks.length === 0 ? (
            <div style={{ fontSize: 13, color: '#8C8797' }}>Henüz veri yok.</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
              {summary.topLinks.map((l) => (
                <div key={l.url} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, fontSize: 13 }}>
                  <span style={{ color: '#3A3644', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{l.label}</span>
                  <span style={{ fontFamily: 'var(--font-mono)', color: '#8C8797', flexShrink: 0 }}>{l.count}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
