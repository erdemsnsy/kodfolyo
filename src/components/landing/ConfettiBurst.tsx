'use client';

import { useEffect, useState } from 'react';
import type { CSSProperties } from 'react';

const COLORS = ['#1F3AE8', '#00A676', '#FFB020', '#C6314E', '#4B7BFF'];

interface Piece {
  id: number;
  left: number;
  color: string;
  delay: number;
  duration: number;
  size: number;
  rotate: number;
  drift: number;
  round: boolean;
}

interface ConfettiBurstProps {
  count?: number;
}

// Tek seferlik, saf CSS ile çalışan konfeti patlaması. Mount olduğunda düşer,
// animasyon bitince görünmez kalır — ekstra bir kütüphane gerekmiyor.
// Rastgele parçacıklar render sırasında değil, mount sonrası bir effect'te
// üretiliyor (Math.random render'ı saf tutmuyor).
export default function ConfettiBurst({ count = 90 }: ConfettiBurstProps) {
  const [pieces, setPieces] = useState<Piece[]>([]);

  useEffect(() => {
    // Math.random bilerek effect'te üretiliyor (render'da değil) — sunucu/ilk client
    // render'ı hep boş dizi ile eşleşsin, hydration mismatch olmasın.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPieces(
      Array.from({ length: count }).map((_, i) => ({
        id: i,
        left: Math.random() * 100,
        color: COLORS[i % COLORS.length],
        delay: Math.random() * 0.5,
        duration: 2.4 + Math.random() * 1.6,
        size: 6 + Math.random() * 6,
        rotate: Math.random() * 360,
        drift: (Math.random() - 0.5) * 180,
        round: Math.random() > 0.5,
      }))
    );
  }, [count]);

  return (
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', overflow: 'hidden', zIndex: 300 }} aria-hidden>
      {pieces.map((p) => (
        <span
          key={p.id}
          style={
            {
              position: 'absolute', top: -20, left: `${p.left}%`, width: p.size, height: p.size * 1.4,
              background: p.color, borderRadius: p.round ? '50%' : 3,
              '--drift': `${p.drift}px`,
              transform: `rotate(${p.rotate}deg)`,
              animation: `kf-confetti-fall ${p.duration}s cubic-bezier(.24,.8,.4,1) ${p.delay}s forwards`,
            } as CSSProperties
          }
        />
      ))}
    </div>
  );
}
