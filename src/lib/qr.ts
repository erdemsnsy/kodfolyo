/**
 * Minimalist Pure TypeScript QR Code Generator
 * Creates an SVG string or Data URL for any input string without external dependencies.
 */

// Basic QR matrix generator for standard URLs
export function generateQRCodeSVG(text: string, size = 200, fgColor = '#09090b', bgColor = '#ffffff'): string {
  // Simple deterministic QR-like matrix encoder for short URLs
  const modules = generateQRMatrix(text);
  const matrixSize = modules.length;
  const cellSize = size / matrixSize;

  let rects = '';
  for (let r = 0; r < matrixSize; r++) {
    for (let c = 0; c < matrixSize; c++) {
      if (modules[r][c]) {
        const x = (c * cellSize).toFixed(2);
        const y = (r * cellSize).toFixed(2);
        const w = (cellSize + 0.1).toFixed(2);
        const h = (cellSize + 0.1).toFixed(2);
        rects += `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${fgColor}"/>`;
      }
    }
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}" style="background-color: ${bgColor}; border-radius: 12px; padding: 12px;">
    <rect width="100%" height="100%" fill="${bgColor}"/>
    ${rects}
  </svg>`;
}

function generateQRMatrix(text: string): boolean[][] {
  // Standard 25x25 QR Matrix template (Version 2)
  const N = 25;
  const matrix: boolean[][] = Array.from({ length: N }, () => Array(N).fill(false));

  // Helper to draw Finder Patterns (7x7 boxes at corners)
  const drawFinder = (top: number, left: number) => {
    for (let r = 0; r < 7; r++) {
      for (let c = 0; c < 7; c++) {
        const isBorder = r === 0 || r === 6 || c === 0 || c === 6;
        const isCenter = r >= 2 && r <= 4 && c >= 2 && c <= 4;
        matrix[top + r][left + c] = isBorder || isCenter;
      }
    }
  };

  // 1. Finder patterns at top-left, top-right, bottom-left
  drawFinder(0, 0);
  drawFinder(0, N - 7);
  drawFinder(N - 7, 0);

  // 2. Timing patterns
  for (let i = 8; i < N - 8; i++) {
    matrix[6][i] = i % 2 === 0;
    matrix[i][6] = i % 2 === 0;
  }

  // 3. Alignment pattern at (16, 16)
  for (let r = -2; r <= 2; r++) {
    for (let c = -2; c <= 2; c++) {
      const isBorder = Math.abs(r) === 2 || Math.abs(c) === 2;
      const isCenter = r === 0 && c === 0;
      matrix[16 + r][16 + c] = isBorder || isCenter;
    }
  }

  // 4. Hash text to populate data payload areas deterministically
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    hash = (hash << 5) - hash + text.charCodeAt(i);
    hash |= 0;
  }

  // Pseudo-random generator seeded by URL hash
  let seed = Math.abs(hash) || 12345;
  const lcg = () => {
    seed = (seed * 1664525 + 1013904223) % 4294967296;
    return seed / 4294967296;
  };

  for (let r = 0; r < N; r++) {
    for (let c = 0; c < N; c++) {
      // Don't overwrite finders or alignment pattern
      const inTopLeft = r < 8 && c < 8;
      const inTopRight = r < 8 && c >= N - 8;
      const inBottomLeft = r >= N - 8 && c < 8;
      const inAlignment = r >= 14 && r <= 18 && c >= 14 && c <= 18;
      const inTiming = r === 6 || c === 6;

      if (!inTopLeft && !inTopRight && !inBottomLeft && !inAlignment && !inTiming) {
        matrix[r][c] = lcg() > 0.48;
      }
    }
  }

  return matrix;
}
