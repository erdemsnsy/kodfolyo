'use client';

import { useEffect } from 'react';

interface AnalyticsBeaconProps {
  username: string;
}

function send(payload: Record<string, unknown>) {
  const body = JSON.stringify(payload);
  if (navigator.sendBeacon) {
    navigator.sendBeacon('/api/analytics/track', new Blob([body], { type: 'application/json' }));
  } else {
    fetch('/api/analytics/track', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body, keepalive: true }).catch(() => {});
  }
}

// Gerçek görüntülenme sayacı + dışarıya giden link tıklamalarını izler.
// Sahte/örnek veri yok — Analytics panelindeki tüm sayılar buradan gelir.
export default function AnalyticsBeacon({ username }: AnalyticsBeaconProps) {
  useEffect(() => {
    send({ username, type: 'view', referrer: document.referrer || null });

    const handleClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement)?.closest('a');
      if (!target) return;
      const href = target.getAttribute('href');
      if (!href || href.startsWith('#') || href.startsWith('mailto:')) return;
      try {
        const url = new URL(href, window.location.href);
        if (url.origin === window.location.origin) return;
        send({ username, type: 'link_click', label: target.textContent?.trim().slice(0, 60) || null, url: url.toString() });
      } catch {
        // geçersiz URL — yoksay
      }
    };

    document.addEventListener('click', handleClick, true);
    return () => document.removeEventListener('click', handleClick, true);
  }, [username]);

  return null;
}
