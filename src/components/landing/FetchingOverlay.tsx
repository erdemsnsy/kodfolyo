'use client';

import { useEffect, useState } from 'react';
import Kodi from '@/components/mascot/Kodi';

// LandingHero'daki minimum gösterim süresiyle (MIN_DURATION_MS) birlikte
// senkron: 4 adım x 700ms = 2800ms — gerçek fetch daha hızlı bitse bile
// kullanıcı her adımı en az bir kez görür, ekran "aşırı kısa" akıp gitmez.
const STEPS = [
  'Kullanıcı adınız alındı…',
  'GitHub repolarınız çekiliyor…',
  'Verileriniz hazırlanıyor…',
  'Portfolyo kuruluyor…',
];
const STEP_DURATION_MS = 700;

// GitHub'dan veri çekilirken tam ekran gösterilen adım adım yükleme animasyonu.
export default function FetchingOverlay() {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setStep((s) => Math.min(s + 1, STEPS.length - 1)), STEP_DURATION_MS);
    return () => clearInterval(id);
  }, []);

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 250, background: '#F9FAFB',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 22,
      }}
    >
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ position: 'absolute', width: 190, height: 190, borderRadius: '50%', border: '2px dashed rgba(228,228,231,.15)', animation: 'kf-spin-slow 8s linear infinite' }} />
        <Kodi size={150} interactive={false} />
      </div>

      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 13.5, color: '#3F3F46', minHeight: 20 }}>{STEPS[step]}</div>

      <div style={{ display: 'flex', gap: 6 }}>
        {STEPS.map((_, i) => (
          <span
            key={i}
            style={{
              width: 6, height: 6, borderRadius: '50%',
              background: i <= step ? '#18181B' : 'rgba(228,228,231,.15)',
              transition: 'background .2s ease',
            }}
          />
        ))}
      </div>
    </div>
  );
}
