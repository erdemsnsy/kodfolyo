export function KodfolyoLogo({ size = 26 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" aria-hidden="true">
      <rect x="8" y="8" width="84" height="84" rx="26" fill="#1F3AE8" />
      <circle cx="36" cy="46" r="7" fill="#F4F1EA" />
      <circle cx="64" cy="46" r="7" fill="#F4F1EA" />
      <rect x="34" y="66" width="32" height="7" rx="3.5" fill="#F4F1EA" />
    </svg>
  );
}
