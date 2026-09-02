// Kodi — Kodfolyo'nun maskotu. Claude Design'da hazırlanan sistemden birebir alındı.
interface KodiProps {
  size?: number;
  float?: boolean;
  grayscale?: boolean;
}

export default function Kodi({ size = 150, float = true, grayscale = false }: KodiProps) {
  return (
    <svg
      width={size}
      height={size * (254 / 240)}
      viewBox="0 0 240 254"
      aria-label="Kodi, Kodfolyo maskotu"
      style={{
        animation: float ? 'kf-float 6s ease-in-out infinite' : undefined,
        filter: grayscale ? 'grayscale(.5)' : undefined,
        opacity: grayscale ? 0.9 : undefined,
      }}
    >
      <path d="M186 182 C224 178 230 136 206 122" fill="none" stroke="#1F3AE8" strokeWidth="13" strokeLinecap="round" />
      <circle cx="206" cy="122" r="9" fill="#00A676" />
      <circle cx="68" cy="84" r="27" fill="#1F3AE8" />
      <circle cx="172" cy="84" r="27" fill="#1F3AE8" />
      <circle cx="68" cy="86" r="13" fill="#9BB0FF" />
      <circle cx="172" cy="86" r="13" fill="#9BB0FF" />
      <ellipse cx="120" cy="146" rx="80" ry="74" fill="#1F3AE8" />
      <ellipse cx="120" cy="164" rx="52" ry="48" fill="#4B7BFF" />
      <ellipse cx="54" cy="188" rx="15" ry="12" fill="#1F3AE8" />
      <ellipse cx="186" cy="188" rx="15" ry="12" fill="#1F3AE8" />
      <ellipse cx="96" cy="212" rx="19" ry="12" fill="#1F3AE8" />
      <ellipse cx="144" cy="212" rx="19" ry="12" fill="#1F3AE8" />
      <circle cx="70" cy="152" r="9" fill="#00A676" opacity=".55" />
      <circle cx="170" cy="152" r="9" fill="#00A676" opacity=".55" />
      <g style={{ animation: 'kf-blink 5s ease-in-out infinite', transformOrigin: '120px 132px' }}>
        <circle cx="94" cy="132" r="24" fill="#FBFAF7" />
        <circle cx="146" cy="132" r="24" fill="#FBFAF7" />
        <circle cx="99" cy="136" r="11" fill="#191720" />
        <circle cx="151" cy="136" r="11" fill="#191720" />
        <circle cx="93" cy="128" r="4.5" fill="#FBFAF7" />
        <circle cx="145" cy="128" r="4.5" fill="#FBFAF7" />
      </g>
      <path d="M108 166 q12 11 24 0" fill="none" stroke="#F4F1EA" strokeWidth="5" strokeLinecap="round" />
    </svg>
  );
}
