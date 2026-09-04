import { ImageResponse } from 'next/og';

// iOS "Ana ekrana ekle" ikonu — Apple şeffaflığı yok sayıp arkasını siyaha
// boyadığı için (icon.tsx'in aksine) kare tuvalin tamamı marka rengiyle dolu;
// köşe yuvarlama zaten iOS tarafından otomatik uygulanıyor. Piksel/absolute
// konumlama nedeni için icon.tsx'teki not'a bakın (Satori + % boyut hatası).
export const size = { width: 180, height: 180 };
export const contentType = 'image/png';

export default function AppleIcon() {
  const S = size.width;
  const px = (v: number) => (v / 100) * S;

  return new ImageResponse(
    (
      <div style={{ width: S, height: S, display: 'flex', position: 'relative', background: '#18181B' }}>
        <div style={{ position: 'absolute', left: px(36 - 7), top: px(46 - 7), width: px(14), height: px(14), borderRadius: '50%', background: '#FAFAFA', display: 'flex' }} />
        <div style={{ position: 'absolute', left: px(64 - 7), top: px(46 - 7), width: px(14), height: px(14), borderRadius: '50%', background: '#FAFAFA', display: 'flex' }} />
        <div style={{ position: 'absolute', left: px(34), top: px(66), width: px(32), height: px(7), borderRadius: px(3.5), background: '#FAFAFA', display: 'flex' }} />
      </div>
    ),
    { ...size }
  );
}
