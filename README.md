# 🚀 Kodfolyo — Developer Executive & Minimalist Portfolyo Üreteci

> **GitHub verilerinizi (biyografi, repolar, diller, yıldızlar) anında profesyonel, sade ve kurumsal bir tek sayfa portfolyoya dönüştürün.**

<p align="left">
  <a href="https://kodfolyo.vercel.app" target="_blank">
    <img src="https://img.shields.io/badge/🌐_Canlı_Demo-kodfolyo.vercel.app-blue?style=for-the-badge" alt="Canlı Demo" />
  </a>
  <img src="https://img.shields.io/badge/Next.js_16-black?style=for-the-badge&logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/Tailwind_CSS_v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Supabase-3FCF8E?style=for-the-badge&logo=supabase&logoColor=white" alt="Supabase" />
</p>

---

## ✨ Öne Çıkan Özellikler

- ⚡ **Otomatik GitHub API Senkronizasyonu**: Kullanıcı adınızı girin; biyografiniz, konumunuz, şirketiniz, en çok yıldız alan 6 reponuz ve dil kullanım oranlarınız canlı çekilsin.
- 🎨 **10 Kurumsal Tema + Canlı Galeri**: Herkese açık `/temalar` sayfasında, siteye hiç girmeden tüm temaları canlı önizlemeyle gezin ve seçin.
- 🧑‍💼 **Tam Kapsamlı Panel (Dashboard)**: Profil/biyografi (AI destekli öneri dahil), öne çıkan repo seçimi, deneyim geçmişi, elle proje/sertifika ekleme, bölüm görünürlüğü, rozet üretici, analiz paneli ve özel alan adı — hepsi tek panelde, canlı önizlemeyle.
- 🤖 **AI Destekli Biyografi Üreteci**: Profesyonel, yaratıcı veya minimalist tarzlarda yapay zeka biyografi önerileri.
- 🖨️ **Tek Tıkla PDF İndirme & Print Desteği**: Özelleştirilmiş baskı CSS kurallarıyla portfolyonuzu doğrudan PDF olarak dışa aktarın.
- 📱 **Canlı QR Kod & Sosyal Paylaşım Modalı**: Dahili saf TypeScript QR kod üreticisi ve WhatsApp, X (Twitter), LinkedIn hızlı paylaşım butonları.
- 🌐 **Özel Alan Adı Bağlama**: Kendi domain'inizi TXT kaydı ile doğrulayıp portfolyonuzu o adreste yayınlayın.
- 🏷️ **Gömülebilir Rozet**: README'lere eklenebilen, gerçek profil verisinden üretilen SVG rozet.
- 📊 **Gerçek Analiz Paneli**: Sayfa görüntülenme, referrer, link tıklama ve PDF indirme istatistikleri (sahte veri yok, Supabase'e gerçek olay kaydı).
- 🔎 **Keşfet Sayfası**: `/kesfet` üzerinden yayınlanan diğer portfolyoları keşfedin.
- 🔗 **Özel Bağlantılar, Dış Katkılar & Blog Akışı**: LinkedIn/X/CV bağlantıları, GitHub dışı katkı listesi ve RSS blog akışı entegrasyonu.
- 🔍 **SEO & PWA Desteği**: Sayfa başına dinamik meta etiketleri, kurulabilir PWA (manifest + ikonlar).
- 🔐 **GitHub OAuth Girişi**: NextAuth.js ile giriş yapıp kendi panelinizi düzenleyin.
- 💾 **Supabase Persistence & Akıllı Önbellek**: GitHub REST API rate limit sorunlarına karşı Supabase PostgreSQL senkronizasyonu ve bellek içi önbellek fallback sistemi.

---

## 🛠️ Teknoloji Yığını (Tech Stack)

- **Framework**: [Next.js 16 (App Router & Turbopack)](https://nextjs.org/)
- **UI & Styling**: [React 19](https://react.dev/), [Tailwind CSS v4](https://tailwindcss.com/), [Lucide Icons](https://lucide.dev/), [Framer Motion](https://www.framer.com/motion/)
- **Veritabanı**: [Supabase PostgreSQL](https://supabase.com/) & `@supabase/supabase-js`
- **Kimlik Doğrulama**: [NextAuth.js v5 (Beta)](https://next-auth.js.org/) & GitHub OAuth Provider
- **Dil**: [TypeScript](https://www.typescriptlang.org/)

---

## 🚀 Hızlı Başlangıç

### 1. Depoyu klonlayın ve bağımlılıkları yükleyin

```bash
git clone https://github.com/erdemsnsy/kodfolyo.git
cd kodfolyo
npm install
```

### 2. Ortam değişkenlerini tanımlayın

`.env.example` dosyasını kopyalayarak `.env.local` oluşturun:

```bash
cp .env.example .env.local
```

Gerekli/opsiyonel anahtarlar:

```env
# Zorunlu
NEXTAUTH_SECRET=kodfolyo_super_secret_key
NEXTAUTH_URL=http://localhost:3005

# Opsiyonel: GitHub OAuth girişi için (yoksa kullanıcı adıyla misafir modu çalışır)
# Callback URL (GitHub OAuth App ayarlarında): http://localhost:3005/api/auth/callback/github
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret

# Opsiyonel: Supabase kalıcılığı için (yoksa bellek içi önbelleğe düşer)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

### 3. Geliştirme sunucusunu başlatın

```bash
npm run dev
```

Tarayıcınızda [http://localhost:3005](http://localhost:3005) adresini açın.

---

## 🗄️ Supabase Veritabanı Kurulumu (Opsiyonel)

Verileri kalıcı olarak PostgreSQL'de saklamak isterseniz, [`supabase/schema.sql`](./supabase/schema.sql) dosyasının tamamını Supabase projenizin **SQL Editor**'ünde çalıştırın. Dosya, aşağıdaki tabloları ve gerekli index/RLS ayarlarını oluşturur:

- `profiles` — kullanıcı profili, tema, özel bağlantılar, deneyim, sertifikalar, bölüm görünürlüğü, özel alan adı
- `cached_repos` — GitHub repo önbelleği (görünürlük ve vitrin seçimiyle birlikte)
- `page_views`, `link_clicks`, `pdf_downloads` — analiz paneli için gerçek olay kayıtları

---

## 📄 Telif Hakkı

Tüm hakları saklıdır. Bu projenin kodları ve içeriği izinsiz kopyalanamaz veya ticari amaçla kullanılamaz.
