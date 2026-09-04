'use client';

const FEATURES = [
  { icon: '🔄', title: 'Otomatik GitHub senkronu', desc: 'Biyografin, en çok yıldız alan projelerin ve dil yetkinliklerin canlı çekilsin.', tag: 'GitHub REST API' },
  { icon: '🗂️', title: 'Proje kartları', desc: 'Yıldız, fork, dil ve açıklama otomatik gelir. Hangileri görünsün, sen seçersin.', tag: 'aç/kapa yönetimi' },
  { icon: '📊', title: 'Dil ve teknoloji analizi', desc: 'Tüm repolarındaki dil dağılımı tek bir çubukta özetlenir.', tag: 'canlı hesaplanır' },
  { icon: '🎨', title: 'Tema seçenekleri', desc: 'On hazır tema, canlı önizleme. Kod yazmadan tonunu değiştir.', tag: '10 tema' },
  { icon: '🔗', title: 'Özel bağlantılar', desc: 'CV, LinkedIn, kişisel site: profilinin üstünde buton olarak dursun.', tag: 'sınırsız link' },
  { icon: '⚡', title: 'Akıllı önbellekleme', desc: 'API limitine takılmadan çalışır; sayfa her zaman hızlı açılır.', tag: 'Supabase cache' },
  { icon: '🌐', title: 'Özel alan adı', desc: 'kodfolyo.dev yerine kendi adını bağla, DNS doğrulaması tek adımda.', tag: 'özel domain' },
  { icon: '📈', title: 'Ziyaretçi analitiği', desc: 'Görüntülenme, link tıklaması ve CV indirmeleri: kimin baktığını gör.', tag: 'gerçek zamanlı' },
];

export default function LandingFeatures() {
  return (
    <div id="ozellikler" style={{ padding: '20px clamp(16px, 5vw, 40px) 96px' }}>
      <div style={{ maxWidth: 1180, margin: '0 auto' }}>
        <div style={{ marginBottom: 32 }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, letterSpacing: '.08em', color: '#71717A' }}>ÖZELLİKLER</span>
          <h2 style={{ margin: '10px 0 0', fontSize: 40, fontWeight: 800, letterSpacing: '-.035em', color: '#18181B' }}>Sekiz parça, sıfır ayar.</h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 16 }}>
          {FEATURES.map((f) => (
            <div
              key={f.title}
              style={{ position: 'relative', padding: 26, borderRadius: 16, background: '#FFFFFF', border: '1px solid rgba(228,228,231,.09)', overflow: 'hidden' }}
            >
              <span
                aria-hidden
                style={{
                  position: 'absolute', right: -10, bottom: -20, fontSize: 92, lineHeight: 1,
                  opacity: 0.08, filter: 'grayscale(1)', userSelect: 'none', pointerEvents: 'none',
                }}
              >
                {f.icon}
              </span>
              <div style={{ position: 'relative', fontSize: 17, fontWeight: 700, letterSpacing: '-.02em', marginBottom: 8, color: '#18181B' }}>{f.title}</div>
              <div style={{ position: 'relative', fontSize: 14, lineHeight: 1.55, color: '#71717A' }}>{f.desc}</div>
              <div style={{ position: 'relative', marginTop: 14, fontFamily: 'var(--font-mono)', fontSize: 11, color: '#A09BA8' }}>{f.tag}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
