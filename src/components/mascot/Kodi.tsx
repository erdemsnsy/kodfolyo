'use client';

import { motion } from 'framer-motion';
import { BOUNCE_EASE } from '@/lib/motion';

export { BOUNCE_EASE };

interface KodiProps {
  pose: 'idle' | 'wave' | 'jump' | 'wink';
  size?: number;
}

const BODY = '#ff5a3c';
const OUTLINE = '#7c2d18';
const CREAM = '#fdf6ec';
const DARK = '#3a1810';
const BLUSH = '#ffb199';
const MUSTARD = '#f5b83d';
const SKY = '#4fd8ff';

function Torso() {
  return (
    <>
      <rect x="23" y="19" width="114" height="118" rx="52" ry="52" fill={BODY} stroke={OUTLINE} strokeWidth="3" />
      <ellipse cx="58" cy="42" rx="20" ry="12" fill="#ffffff" opacity="0.16" transform="rotate(-18 58 42)" />
      <rect x="60" y="47" width="40" height="20" rx="8" fill={CREAM} />
      <text x="80" y="61" textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontSize="12" fontWeight="700" fill={OUTLINE}>{'</>'}</text>
      <ellipse cx="60" cy="155" rx="14" ry="10" fill={OUTLINE} />
      <ellipse cx="100" cy="155" rx="14" ry="10" fill={OUTLINE} />
    </>
  );
}

function Antenna({ animated }: { animated: boolean }) {
  return (
    <>
      <line x1="80" y1="19" x2="80" y2="3" stroke={MUSTARD} strokeWidth="3" strokeLinecap="round" />
      {animated ? (
        <motion.circle
          cx="80" cy="0" r="7" fill={MUSTARD}
          animate={{ scale: [1, 1.15, 1], opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 1.1, repeat: Infinity, ease: BOUNCE_EASE }}
        />
      ) : (
        <circle cx="80" cy="0" r="7" fill={MUSTARD} />
      )}
    </>
  );
}

function Idle() {
  return (
    <svg width="100%" height="100%" viewBox="0 0 160 195">
      <ellipse cx="80" cy="180" rx="44" ry="9" fill="#000000" opacity="0.35" />
      <Antenna animated={false} />
      <Torso />
      <ellipse cx="40" cy="93" rx="7" ry="4" fill={BLUSH} opacity="0.65" />
      <ellipse cx="120" cy="93" rx="7" ry="4" fill={BLUSH} opacity="0.65" />
      <ellipse cx="47" cy="75" rx="12" ry="15" fill={CREAM} />
      <ellipse cx="113" cy="75" rx="12" ry="15" fill={CREAM} />
      <circle cx="50" cy="79" r="5" fill={DARK} />
      <circle cx="116" cy="79" r="5" fill={DARK} />
      <circle cx="47.5" cy="75.5" r="1.8" fill="#ffffff" />
      <circle cx="113.5" cy="75.5" r="1.8" fill="#ffffff" />
      <path d="M63 103 Q80 113 97 103" stroke={DARK} strokeWidth="4" strokeLinecap="round" fill="none" />
      <ellipse cx="25" cy="105" rx="10" ry="15" fill={BODY} stroke={OUTLINE} strokeWidth="3" transform="rotate(-14 25 105)" />
      <ellipse cx="135" cy="105" rx="10" ry="15" fill={BODY} stroke={OUTLINE} strokeWidth="3" transform="rotate(14 135 105)" />
    </svg>
  );
}

function Wave() {
  return (
    <svg width="100%" height="100%" viewBox="0 0 160 195">
      <ellipse cx="80" cy="180" rx="44" ry="9" fill="#000000" opacity="0.35" />
      <Antenna animated={true} />
      <Torso />
      <ellipse cx="40" cy="93" rx="7" ry="4" fill={BLUSH} opacity="0.65" />
      <ellipse cx="120" cy="93" rx="7" ry="4" fill={BLUSH} opacity="0.65" />
      <path d="M38 58 Q46 51 54 57" stroke={OUTLINE} strokeWidth="3.5" strokeLinecap="round" fill="none" />
      <path d="M106 57 Q114 51 122 58" stroke={OUTLINE} strokeWidth="3.5" strokeLinecap="round" fill="none" />
      <ellipse cx="47" cy="76" rx="12" ry="16" fill={CREAM} />
      <ellipse cx="113" cy="76" rx="12" ry="16" fill={CREAM} />
      <circle cx="50" cy="79" r="5.5" fill={DARK} />
      <circle cx="116" cy="79" r="5.5" fill={DARK} />
      <circle cx="47.5" cy="75" r="2" fill="#ffffff" />
      <circle cx="113.5" cy="75" r="2" fill="#ffffff" />
      <path d="M60 101 Q80 119 100 101" stroke={DARK} strokeWidth="4" strokeLinecap="round" fill="none" />
      <ellipse cx="25" cy="107" rx="10" ry="15" fill={BODY} stroke={OUTLINE} strokeWidth="3" transform="rotate(-14 25 107)" />
      <motion.g
        style={{ transformOrigin: '133px 45px' }}
        animate={{ rotate: [0, 18, 0] }}
        transition={{ duration: 0.6, repeat: Infinity, ease: BOUNCE_EASE }}
      >
        <ellipse cx="133" cy="45" rx="10" ry="16" fill={BODY} stroke={OUTLINE} strokeWidth="3" transform="rotate(150 133 45)" />
      </motion.g>
    </svg>
  );
}

function Wink() {
  return (
    <svg width="100%" height="100%" viewBox="0 0 160 195">
      <ellipse cx="80" cy="180" rx="44" ry="9" fill="#000000" opacity="0.35" />
      <Antenna animated={false} />
      <Torso />
      <ellipse cx="40" cy="93" rx="8" ry="4.5" fill={BLUSH} opacity="0.7" />
      <ellipse cx="120" cy="93" rx="7" ry="4" fill={BLUSH} opacity="0.6" />
      <path d="M40 75 Q47 82 54 75" stroke={DARK} strokeWidth="4" strokeLinecap="round" fill="none" />
      <ellipse cx="113" cy="75" rx="12" ry="15" fill={CREAM} />
      <circle cx="116" cy="79" r="5" fill={DARK} />
      <circle cx="113.5" cy="75.5" r="1.8" fill="#ffffff" />
      <path d="M60 103 Q80 115 100 99" stroke={DARK} strokeWidth="4" strokeLinecap="round" fill="none" />
      <ellipse cx="25" cy="105" rx="10" ry="15" fill={BODY} stroke={OUTLINE} strokeWidth="3" transform="rotate(-14 25 105)" />
      <ellipse cx="135" cy="65" rx="10" ry="15" fill={BODY} stroke={OUTLINE} strokeWidth="3" transform="rotate(-70 135 65)" />
    </svg>
  );
}

function Jump() {
  return (
    <svg width="100%" height="100%" viewBox="0 0 160 195">
      <motion.ellipse
        cx="80" cy="180" rx="44" ry="9" fill="#000000" opacity="0.4"
        style={{ transformOrigin: '80px 180px' }}
        animate={{ scaleX: [1, 0.5, 1], opacity: [1, 0.5, 1] }}
        transition={{ duration: 0.9, repeat: Infinity, ease: BOUNCE_EASE }}
      />
      <motion.path
        d="M20 45 L23 39 L26 45 L23 51 Z" fill={SKY}
        animate={{ opacity: [0.15, 1, 0.15], scale: [0.7, 1.1, 0.7], rotate: [0, 20, 0] }}
        transition={{ duration: 1.3, repeat: Infinity, ease: BOUNCE_EASE }}
      />
      <motion.path
        d="M144 30 L147 24 L150 30 L147 36 Z" fill={MUSTARD}
        animate={{ opacity: [0.15, 1, 0.15], scale: [0.7, 1.1, 0.7], rotate: [0, 20, 0] }}
        transition={{ duration: 1.3, repeat: Infinity, ease: BOUNCE_EASE, delay: 0.4 }}
      />
      <motion.path
        d="M85 -10 L88 -16 L91 -10 L88 -4 Z" fill={SKY}
        animate={{ opacity: [0.15, 1, 0.15], scale: [0.7, 1.1, 0.7], rotate: [0, 20, 0] }}
        transition={{ duration: 1.3, repeat: Infinity, ease: BOUNCE_EASE, delay: 0.8 }}
      />
      <motion.g
        animate={{ y: [0, -22, 0] }}
        transition={{ duration: 0.9, repeat: Infinity, ease: BOUNCE_EASE }}
      >
        <Antenna animated={true} />
        <Torso />
        <ellipse cx="40" cy="91" rx="7.5" ry="4.5" fill={BLUSH} opacity="0.7" />
        <ellipse cx="120" cy="91" rx="7.5" ry="4.5" fill={BLUSH} opacity="0.7" />
        <path d="M37 56 Q46 47 55 55" stroke={OUTLINE} strokeWidth="3.5" strokeLinecap="round" fill="none" />
        <path d="M105 55 Q114 47 123 56" stroke={OUTLINE} strokeWidth="3.5" strokeLinecap="round" fill="none" />
        <ellipse cx="47" cy="73" rx="12" ry="17" fill={CREAM} />
        <ellipse cx="113" cy="73" rx="12" ry="17" fill={CREAM} />
        <circle cx="50" cy="75" r="6" fill={DARK} />
        <circle cx="116" cy="75" r="6" fill={DARK} />
        <circle cx="47.5" cy="70.5" r="2.2" fill="#ffffff" />
        <circle cx="113.5" cy="70.5" r="2.2" fill="#ffffff" />
        <path d="M57 101 Q80 121 103 101" stroke={DARK} strokeWidth="4.5" strokeLinecap="round" fill="none" />
        <ellipse cx="21" cy="87" rx="10" ry="15" fill={BODY} stroke={OUTLINE} strokeWidth="3" transform="rotate(-40 21 87)" />
        <ellipse cx="139" cy="87" rx="10" ry="15" fill={BODY} stroke={OUTLINE} strokeWidth="3" transform="rotate(40 139 87)" />
      </motion.g>
    </svg>
  );
}

export default function Kodi({ pose, size = 160 }: KodiProps) {
  const content =
    pose === 'jump' ? <Jump /> : pose === 'wave' ? <Wave /> : pose === 'wink' ? <Wink /> : <Idle />;

  return (
    <div
      style={{ width: size, height: size * 1.22, filter: 'drop-shadow(3px 4px 0 #14110f)' }}
      aria-hidden="true"
    >
      {content}
    </div>
  );
}
