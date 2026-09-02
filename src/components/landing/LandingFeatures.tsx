'use client';

const FEATURES = [
  { icon: '⟳', title: 'Otomatik GitHub senkronu', desc: 'Biyografin, en çok yıldız alan projelerin ve dil yetkinliklerin canlı çekilsin.', tag: 'GitHub REST API' },
  { icon: '▤', title: 'Proje kartları', desc: 'Yıldız, fork, dil ve açıklama otomatik gelir. Hangileri görünsün, sen seçersin.', tag: 'aç/kapa yönetimi' },
  { icon: '◐', title: 'Dil ve teknoloji analizi', desc: 'Tüm repolarındaki dil dağılımı tek bir çubukta özetlenir.', tag: 'canlı hesaplanır' },
  { icon: '◈', title: 'Tema seçenekleri', desc: 'Dört hazır tema, canlı önizleme. Kod yazmadan tonunu değiştir.', tag: '4 tema' },
  { icon: '↗', title: 'Özel bağlantılar', desc: 'CV, LinkedIn, kişisel site — profilinin üstünde buton olarak dursun.', tag: 'sınırsız link' },
  { icon: '⚡', title: 'Akıllı önbellekleme', desc: 'API limitine takılmadan çalışır; sayfa her zaman hızlı açılır.', tag: 'Supabase cache' },
];

export default function LandingFeatures() {
  return (
    <div id="ozellikler" style={{ padding: '20px clamp(16px, 5vw, 40px) 96px' }}>
      <div style={{ maxWidth: 1180, margin: '0 auto' }}>
        <div style={{ marginBottom: 32 }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: '#00A676' }}>02 — ÖZELLİKLER</span>
          <h2 style={{ margin: '10px 0 0', fontSize: 40, fontWeight: 800, letterSpacing: '-.035em', color: '#191720' }}>Altı parça, sıfır ayar.</h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
          {FEATURES.map((f) => (
            <div
              key={f.title}
              style={{ position: 'relative', padding: 26, borderRadius: 16, background: '#FFFFFF', border: '1px solid rgba(25,23,32,.09)', overflow: 'hidden' }}
            >
              <div style={{ position: 'absolute', top: -40, right: -40, width: 120, height: 120, borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,166,118,.14), transparent 70%)' }} />
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', width: 42, height: 42, borderRadius: 12, background: 'rgba(31,58,232,.13)', border: '1px solid rgba(31,58,232,.28)', fontSize: 19, marginBottom: 16 }}>
                {f.icon}
              </div>
              <div style={{ fontSize: 17, fontWeight: 700, letterSpacing: '-.02em', marginBottom: 8, color: '#191720' }}>{f.title}</div>
              <div style={{ fontSize: 14, lineHeight: 1.55, color: '#6B6675' }}>{f.desc}</div>
              <div style={{ marginTop: 14, fontFamily: 'var(--font-mono)', fontSize: 11, color: '#A09BA8' }}>{f.tag}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
