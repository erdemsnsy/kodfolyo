'use client';

import { useId, useRef, useState } from 'react';

// Kodi — Kodfolyo'nun maskotu. Gradyanlı gövde + fare üzerine gelince
// kulak/kuyruk tepkisi, tıklayınca (sevilince) mutlu yüz + kalp efekti verir.
interface KodiProps {
  size?: number;
  float?: boolean;
  grayscale?: boolean;
  /** Hover'da hareket, tıklayınca mutlu tepki. Dekoratif kullanımlarda false ver. */
  interactive?: boolean;
}

export default function Kodi({ size = 150, float = true, grayscale = false, interactive = true }: KodiProps) {
  const [hovered, setHovered] = useState(false);
  const [petted, setPetted] = useState(false);
  const pettedTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  // useId() içindeki ':' karakteri url(#id) referanslarında geçersiz — temizle.
  const uid = `kodi-${useId().replace(/:/g, '')}`;

  const active = interactive && (hovered || petted);
  const happy = interactive && petted;

  const handleClick = () => {
    if (!interactive) return;
    setPetted(true);
    clearTimeout(pettedTimer.current);
    pettedTimer.current = setTimeout(() => setPetted(false), 1500);
  };

  return (
    <svg
      width={size}
      height={size * (254 / 240)}
      viewBox="0 0 240 254"
      role="img"
      aria-label="Kodi, Kodfolyo maskotu"
      onMouseEnter={() => interactive && setHovered(true)}
      onMouseLeave={() => interactive && setHovered(false)}
      onClick={handleClick}
      style={{
        cursor: interactive ? 'pointer' : undefined,
        overflow: 'visible',
        animation: float ? 'kf-float 6s ease-in-out infinite' : undefined,
        filter: grayscale ? 'grayscale(1) contrast(1.05)' : undefined,
        opacity: grayscale ? 0.85 : undefined,
      }}
    >
      <defs>
        <radialGradient id={`${uid}-body`} cx="38%" cy="30%" r="78%">
          <stop offset="0%" stopColor="#6F9BFF" />
          <stop offset="55%" stopColor="#3059F2" />
          <stop offset="100%" stopColor="#1A2FC2" />
        </radialGradient>
        <radialGradient id={`${uid}-belly`} cx="42%" cy="30%" r="75%">
          <stop offset="0%" stopColor="#8BB0FF" />
          <stop offset="100%" stopColor="#4B7BFF" />
        </radialGradient>
        <radialGradient id={`${uid}-ear`} cx="40%" cy="35%" r="70%">
          <stop offset="0%" stopColor="#C7D7FF" />
          <stop offset="100%" stopColor="#7FA0FF" />
        </radialGradient>
      </defs>

      {/* zemin gölgesi */}
      <ellipse cx="120" cy="236" rx="64" ry="10" fill="#191720" opacity=".1" />

      {/* kuyruk — hover/pet'te sallanır */}
      <path
        d="M186 182 C224 178 230 136 206 122"
        fill="none"
        stroke={`url(#${uid}-body)`}
        strokeWidth="13"
        strokeLinecap="round"
        style={{
          transformOrigin: '186px 182px',
          transition: 'transform .45s cubic-bezier(.34,1.56,.64,1)',
          transform: active ? 'rotate(-16deg)' : 'rotate(0deg)',
        }}
      />
      <circle cx="206" cy="122" r="9" fill="#00A676" />

      {/* kulaklar — hover'da hafif kalkar */}
      <g
        style={{
          transformOrigin: '120px 100px',
          transition: 'transform .35s ease',
          transform: active ? 'translateY(-5px) scale(1.03)' : 'translateY(0) scale(1)',
        }}
      >
        <circle cx="68" cy="84" r="27" fill={`url(#${uid}-body)`} />
        <circle cx="172" cy="84" r="27" fill={`url(#${uid}-body)`} />
        <circle cx="68" cy="86" r="13" fill={`url(#${uid}-ear)`} />
        <circle cx="172" cy="86" r="13" fill={`url(#${uid}-ear)`} />
      </g>

      {/* gövde */}
      <ellipse cx="120" cy="146" rx="80" ry="74" fill={`url(#${uid}-body)`} />
      <ellipse cx="120" cy="166" rx="52" ry="46" fill={`url(#${uid}-belly)`} />

      {/* patiler */}
      <ellipse cx="54" cy="188" rx="15" ry="12" fill={`url(#${uid}-body)`} />
      <ellipse cx="186" cy="188" rx="15" ry="12" fill={`url(#${uid}-body)`} />
      <ellipse
        cx="96" cy="212" rx="19" ry="12" fill={`url(#${uid}-body)`}
        style={{ transformOrigin: '96px 218px', transition: 'transform .3s ease .05s', transform: happy ? 'rotate(-8deg)' : 'rotate(0deg)' }}
      />
      <ellipse
        cx="144" cy="212" rx="19" ry="12" fill={`url(#${uid}-body)`}
        style={{ transformOrigin: '144px 218px', transition: 'transform .3s ease .1s', transform: happy ? 'rotate(8deg)' : 'rotate(0deg)' }}
      />

      {/* yanaklar */}
      <circle cx="70" cy="152" r="9" fill="#00A676" opacity={happy ? 0.75 : 0.5} style={{ transition: 'opacity .3s ease' }} />
      <circle cx="170" cy="152" r="9" fill="#00A676" opacity={happy ? 0.75 : 0.5} style={{ transition: 'opacity .3s ease' }} />

      {/* gözler + ağız */}
      <g style={{ animation: !happy ? 'kf-blink 5s ease-in-out infinite' : undefined, transformOrigin: '120px 132px' }}>
        {happy ? (
          <g style={{ animation: 'kf-pop-in .25s ease-out' }}>
            <path d="M82 134 q12 -18 24 0" fill="none" stroke="#191720" strokeWidth="7" strokeLinecap="round" />
            <path d="M134 134 q12 -18 24 0" fill="none" stroke="#191720" strokeWidth="7" strokeLinecap="round" />
          </g>
        ) : (
          <>
            <circle cx="94" cy="132" r="24" fill="#FBFAF7" />
            <circle cx="146" cy="132" r="24" fill="#FBFAF7" />
            <circle cx={active ? 101 : 99} cy="136" r="11" fill="#191720" style={{ transition: 'cx .3s ease' }} />
            <circle cx={active ? 153 : 151} cy="136" r="11" fill="#191720" style={{ transition: 'cx .3s ease' }} />
            <circle cx={active ? 95 : 93} cy="128" r="4.5" fill="#FBFAF7" style={{ transition: 'cx .3s ease' }} />
            <circle cx={active ? 147 : 145} cy="128" r="4.5" fill="#FBFAF7" style={{ transition: 'cx .3s ease' }} />
          </>
        )}
      </g>
      <path
        d={happy ? 'M100 164 q20 18 40 0' : 'M108 166 q12 11 24 0'}
        fill="none"
        stroke="#F4F1EA"
        strokeWidth="5"
        strokeLinecap="round"
        style={{ transition: 'd .2s ease' }}
      />

      {/* sevildiğinde yükselen kalpler */}
      {happy && (
        <>
          <path
            d="M50 94 c-2.5 -3 -7 -2 -7 1.6 c0 3 7 7.4 7 7.4 c0 0 7 -4.4 7 -7.4 c0 -3.6 -4.5 -4.6 -7 -1.6 Z"
            fill="#00A676" opacity="0" style={{ animation: 'kf-heart-rise 1.1s ease-out .05s forwards' }}
          />
          <path
            d="M182 78 c-3 -3.5 -8.5 -2.3 -8.5 1.9 c0 3.6 8.5 8.8 8.5 8.8 c0 0 8.5 -5.2 8.5 -8.8 c0 -4.2 -5.5 -5.4 -8.5 -1.9 Z"
            fill="#1F3AE8" opacity="0" style={{ animation: 'kf-heart-rise 1.2s ease-out .2s forwards' }}
          />
        </>
      )}
    </svg>
  );
}
