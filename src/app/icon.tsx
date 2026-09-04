import { ImageResponse } from 'next/og';

// PWA/tarayıcı ikonu — KodfolyoLogo.tsx (src/components/icons) ile birebir aynı
// işaret (yuvarlak köşeli kare + iki nokta göz + ağız çubuğu), ImageResponse ile
// piksel olarak üretiliyor. manifest.ts bu route'u referans alıyor.
//
// Not: Satori (ImageResponse'un render motoru), yüzde (%) boyutunu yalnızca
// boyutu ZATEN belli bir ebeveyne göre hesaplayabiliyor — flex bir kutunun
// kendi genişliği/yüksekliği içerik tarafından belirleniyorsa (auto), içindeki
// çocukların % boyutu 0'a çöküyor (ilk denemede "gözler" bu yüzden kayboldu).
// Bu yüzden tüm iç elemanlar `size`'a göre hesaplanmış SABİT piksel + absolute
// konumla yerleştiriliyor; KodfolyoLogo'nun 100x100 viewBox'ındaki oranların
// birebir aynısı (rect 8/84/20, daire cx 36-64 cy46 r7, çubuk 34/66/32/7).
export const size = { width: 512, height: 512 };
export const contentType = 'image/png';

export default function Icon() {
  const S = size.width;
  const px = (v: number) => (v / 100) * S;

  return new ImageResponse(
    (
      <div style={{ width: S, height: S, display: 'flex', position: 'relative' }}>
        <div
          style={{
            position: 'absolute', left: px(8), top: px(8), width: px(84), height: px(84),
            borderRadius: px(20), background: '#18181B', display: 'flex',
          }}
        />
        <div style={{ position: 'absolute', left: px(36 - 7), top: px(46 - 7), width: px(14), height: px(14), borderRadius: '50%', background: '#FAFAFA', display: 'flex' }} />
        <div style={{ position: 'absolute', left: px(64 - 7), top: px(46 - 7), width: px(14), height: px(14), borderRadius: '50%', background: '#FAFAFA', display: 'flex' }} />
        <div style={{ position: 'absolute', left: px(34), top: px(66), width: px(32), height: px(7), borderRadius: px(3.5), background: '#FAFAFA', display: 'flex' }} />
      </div>
    ),
    { ...size }
  );
}
