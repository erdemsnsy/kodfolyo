'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';

const FAQS = [
  {
    q: 'Kodfolyo ücretsiz mi?',
    a: 'Evet. GitHub kullanıcı adını yazıp yayına almak, tema seçmek ve bölümleri düzenlemek tamamen ücretsiz. Ödeme gerektiren tek şey, istersen sonradan bağlayabileceğin özel alan adının kendisi (o da domain sağlayıcına, Kodfolyo\'ya değil).',
  },
  {
    q: 'GitHub hesabıma ne kadar erişim veriyorum?',
    a: 'Salt okunur erişim: herkese açık profil bilgilerin, repo listen, yıldız ve fork sayıların. Yazma izni yok, hiçbir reponuza veya ayarınıza dokunulmaz.',
  },
  {
    q: 'Kod yazmam gerekiyor mu?',
    a: 'Hayır. Her şey dashboard üzerinden: profil bilgileri, tema, bağlantılar, deneyim, hangi bölümlerin görüneceği; tıkla, kaydet.',
  },
  {
    q: 'GitHub\'da bir şey değiştirirsem portfolyom otomatik güncellenir mi?',
    a: 'Repo, yıldız ve dil verisi periyodik olarak senkronize edilir; dashboard\'daki senkron butonuyla da anında tazeleyebilirsin. Biyografi, deneyim gibi kendi yazdığın alanlar GitHub\'dan bağımsız, elle güncelleniyor.',
  },
  {
    q: 'Kendi alan adımı bağlayabilir miyim?',
    a: 'Evet. Alan Adı sekmesinden alan adını gir, DNS kaydını sağlayıcında oluştur, doğrula. Yayılması birkaç dakikadan birkaç saate sürebilir.',
  },
  {
    q: 'Hesabımı silersem ne olur?',
    a: 'Profilin, repo verilerin ve özel alan adı bağlantın kalıcı olarak silinir. Bu adım geri alınamaz.',
  },
];

export default function LandingFAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div id="sss" style={{ padding: '20px clamp(16px, 5vw, 40px) 96px' }}>
      <div style={{ maxWidth: 820, margin: '0 auto' }}>
        <div style={{ marginBottom: 32 }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, letterSpacing: '.08em', color: '#71717A' }}>SIKÇA SORULANLAR</span>
          <h2 style={{ margin: '10px 0 0', fontSize: 36, fontWeight: 800, letterSpacing: '-.03em', color: '#18181B' }}>Merak edilenler.</h2>
        </div>

        <div style={{ borderTop: '1px solid #E4E4E7' }}>
          {FAQS.map((item, i) => {
            const open = openIndex === i;
            return (
              <div key={item.q} style={{ borderBottom: '1px solid #E4E4E7' }}>
                <button
                  type="button"
                  onClick={() => setOpenIndex(open ? null : i)}
                  aria-expanded={open}
                  className="hover:bg-zinc-50 transition-colors"
                  style={{
                    width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16,
                    padding: '20px 4px', background: 'transparent', border: 0, cursor: 'pointer', textAlign: 'left',
                  }}
                >
                  <span style={{ fontSize: 15.5, fontWeight: 600, color: '#18181B' }}>{item.q}</span>
                  <Plus
                    className="w-4 h-4"
                    style={{ flexShrink: 0, color: '#71717A', transition: 'transform .2s ease', transform: open ? 'rotate(45deg)' : 'none' }}
                  />
                </button>
                {open && (
                  <p style={{ margin: '0 4px 20px', maxWidth: 640, fontSize: 14, lineHeight: 1.65, color: '#52525B' }}>
                    {item.a}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
