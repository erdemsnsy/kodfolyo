'use client';

import { useEffect, useRef } from 'react';

// "Böyle görünüyor" demo kartındaki gri maskot — public/kodi-avatar-gray.svg ile
// aynı tasarım (kırpık sol göz + gülümseme), ama statik dosya değil inline SVG:
// fare imlecini takip eden göz bunu gerektiriyor (bir <img>/next-image üzerinden
// script çalıştırılamaz). Sağ (açık) gözün bebeği imlece doğru kayar, sol göz
// zaten kırpık olduğu için sabit kalıyor.
export default function KodiAvatar({ className }: { className?: string }) {
  const svgRef = useRef<SVGSVGElement>(null);
  const pupilRef = useRef<SVGCircleElement>(null);
  const highlightRef = useRef<SVGCircleElement>(null);

  useEffect(() => {
    const EYE_CX = 146;
    const EYE_CY = 132;
    const PUPIL_BASE_X = 5; // orijinal statik pupil konumu (kodi-avatar-gray.svg ile aynı)
    const PUPIL_BASE_Y = 4;
    const MAX_OFFSET = 4.5; // pupil göz beyazından taşmasın diye sınır (viewBox birimi)
    // viewBox="25 42 220 220" (kodi-avatar-gray.svg ile birebir aynı)
    const VIEWBOX_SIZE = 220;
    const VIEWBOX_X = 25;
    const VIEWBOX_Y = 42;

    const handleMouseMove = (e: MouseEvent) => {
      const svg = svgRef.current;
      const pupil = pupilRef.current;
      if (!svg || !pupil) return;

      const rect = svg.getBoundingClientRect();
      if (rect.width === 0) return;
      const scale = rect.width / VIEWBOX_SIZE;
      const eyeScreenX = rect.left + (EYE_CX - VIEWBOX_X) * scale;
      const eyeScreenY = rect.top + (EYE_CY - VIEWBOX_Y) * scale;

      const dx = e.clientX - eyeScreenX;
      const dy = e.clientY - eyeScreenY;
      const dist = Math.hypot(dx, dy) || 1;
      const offsetX = (dx / dist) * MAX_OFFSET;
      const offsetY = (dy / dist) * MAX_OFFSET;

      pupil.setAttribute('cx', String(EYE_CX + PUPIL_BASE_X + offsetX));
      pupil.setAttribute('cy', String(EYE_CY + PUPIL_BASE_Y + offsetY));
      highlightRef.current?.setAttribute('cx', String(EYE_CX - 1 + offsetX * 0.7));
      highlightRef.current?.setAttribute('cy', String(EYE_CY - 4 + offsetY * 0.7));
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
    <svg
      ref={svgRef}
      viewBox="25 42 220 220"
      width="82%"
      height="82%"
      role="img"
      aria-label="Kodi, Kodfolyo maskotu"
      className={className}
      style={{ display: 'block' }}
    >
      <defs>
        <radialGradient id="kodi-avatar-live-body" cx="38%" cy="30%" r="78%">
          <stop offset="0%" stopColor="#D4D4D8" />
          <stop offset="55%" stopColor="#A1A1AA" />
          <stop offset="100%" stopColor="#71717A" />
        </radialGradient>
        <radialGradient id="kodi-avatar-live-belly" cx="42%" cy="30%" r="75%">
          <stop offset="0%" stopColor="#E4E4E7" />
          <stop offset="100%" stopColor="#A1A1AA" />
        </radialGradient>
        <radialGradient id="kodi-avatar-live-ear" cx="40%" cy="35%" r="70%">
          <stop offset="0%" stopColor="#F4F4F5" />
          <stop offset="100%" stopColor="#D4D4D8" />
        </radialGradient>
      </defs>

      <ellipse cx={120} cy={236} rx={64} ry={10} fill="#191720" opacity={0.1} />

      <path d="M186 182 C224 178 230 136 206 122" fill="none" stroke="url(#kodi-avatar-live-body)" strokeWidth={13} strokeLinecap="round" />
      <circle cx={206} cy={122} r={9} fill="#71717A" />

      <circle cx={68} cy={84} r={27} fill="url(#kodi-avatar-live-body)" />
      <circle cx={172} cy={84} r={27} fill="url(#kodi-avatar-live-body)" />
      <circle cx={68} cy={86} r={13} fill="url(#kodi-avatar-live-ear)" />
      <circle cx={172} cy={86} r={13} fill="url(#kodi-avatar-live-ear)" />

      <ellipse cx={120} cy={146} rx={80} ry={74} fill="url(#kodi-avatar-live-body)" />
      <ellipse cx={120} cy={166} rx={52} ry={46} fill="url(#kodi-avatar-live-belly)" />

      <ellipse cx={54} cy={188} rx={15} ry={12} fill="url(#kodi-avatar-live-body)" />
      <ellipse cx={186} cy={188} rx={15} ry={12} fill="url(#kodi-avatar-live-body)" />
      <ellipse cx={96} cy={212} rx={19} ry={12} fill="url(#kodi-avatar-live-body)" />
      <ellipse cx={144} cy={212} rx={19} ry={12} fill="url(#kodi-avatar-live-body)" />

      <circle cx={70} cy={152} r={9} fill="#A1A1AA" opacity={0.6} />
      <circle cx={170} cy={152} r={9} fill="#A1A1AA" opacity={0.6} />

      {/* sol göz: kırpık, sabit */}
      <path d="M82 134 q12 -18 24 0" fill="none" stroke="#191720" strokeWidth={7} strokeLinecap="round" />

      {/* sağ göz: açık, pupil fareyi takip eder */}
      <circle cx={146} cy={132} r={24} fill="#FBFAF7" />
      <circle ref={pupilRef} cx={151} cy={136} r={11} fill="#191720" />
      <circle ref={highlightRef} cx={145} cy={128} r={4.5} fill="#FBFAF7" />

      <path d="M100 164 q20 18 40 0" fill="none" stroke="#52525B" strokeWidth={5} strokeLinecap="round" />
    </svg>
    </div>
  );
}
