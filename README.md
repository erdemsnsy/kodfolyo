# 🚀 Kodfolyo - Developer Executive & Minimalist Portfolyo Üreteci

> **GitHub verilerinizi (biyografi, repolar, diller, yıldızlar) anında profesyonel, sade ve kurumsal bir tek sayfa portfolyoya dönüştürün.**

![Kodfolyo Banner](https://raw.githubusercontent.com/swind/kodfolyo/main/public/favicon.ico)

---

## ✨ Öne Çıkan Özellikler

- ⚡ **Otomatik GitHub API Senkronizasyonu**: Kullanıcı adınızı girin; biyografiniz, konumuz, şirketiniz, en çok yıldız alan 6 reponuz ve dil kullanım oranlarınız canlı çekilsin.
- 🎨 **Kurumsal & Modern Temalar**: Executive Dark, Cyber Indigo, Terminal Amber, Matrix Mint, Dracula Slate, Paper Cream, Executive Light gibi 9 farklı renk ve stil seçeneği.
- 🖨️ **Tek Tıkla PDF İndirme & Print Desteği**: Özelleştirilmiş baskı CSS kuralları ile portfolyonuzu doğrudan PDF formatında dışa aktarın.
- 📱 **Canlı QR Kod & Sosyal Paylaşım Modalı**: Dahili saf TypeScript QR kod üreticisi ve WhatsApp, Twitter/X, LinkedIn hızlı paylaşım butonları.
- 🤖 **AI Destekli Biyografi Üreteci**: Profesyonel, yaratıcı veya minimalist tarzlarda yapay zeka biyografi önerileri.
- 🔗 **Özel Bağlantılar & CV Ekleme**: LinkedIn, Twitter veya Özgeçmiş (CV) PDF bağlantılarınızı özelleştirilebilir ikonlar ile portfolyonuza ekleyin.
- 💾 **Supabase Persistence & Akıllı Önbellek**: GitHub REST API rate limit sorunlarına karşı Supabase PostgreSQL veritabanı senkronizasyonu ve bellek içi önbellek fallback sistemi.

---

## 🛠️ Teknoloji Yığını (Tech Stack)

- **Framework**: [Next.js 16 (App Router & Turbopack)](https://nextjs.org/)
- **UI & Styling**: [React 19](https://react.dev/), [Tailwind CSS v4](https://tailwindcss.com/), [Lucide Icons](https://lucide.dev/)
- **Veritabanı**: [Supabase PostgreSQL](https://supabase.com/) & `@supabase/supabase-js`
- **Kimlik Doğrulama**: [NextAuth.js v5 (Beta)](https://next-auth.js.org/) & GitHub OAuth Provider
- **Dil**: [TypeScript](https://www.typescriptlang.org/)

---

## 🚀 Hızlı Başlangıç

### 1. Depoyu klonlayın ve bağımlılıkları yükleyin:

```bash
git clone https://github.com/kullaniciadi/kodfolyo.git
cd kodfolyo
npm install
```

### 2. Ortam Değişkenlerini Tanımlayın (`.env.local`):

`.env.example` dosyasını kopyalayarak `.env.local` oluşturun:

```bash
cp .env.example .env.local
```

Gerekli anahtarlar:
```env
NEXTAUTH_SECRET=kodfolyo_super_secret_key
NEXTAUTH_URL=http://localhost:3005

# Opsiyonel: Supabase veritabanı kullanmak isterseniz
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Opsiyonel: GitHub OAuth Girişi için
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
```

### 3. Geliştirme Sunucusunu Başlatın:

```bash
npm run dev
```

Tarayıcınızda [http://localhost:3005](http://localhost:3005) adresini açın.

---

## 🗄️ Supabase Veritabanı Kurulumu (Opsiyonel)

Verileri kalıcı olarak PostgreSQL'de saklamak isterseniz, `supabase/schema.sql` dosyasındaki SQL sorgusunu Supabase SQL Editor alanında çalıştırabilirsiniz:

```sql
-- Profiles ve Cached Repositories tabloları
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    github_id TEXT UNIQUE NOT NULL,
    username TEXT UNIQUE NOT NULL,
    name TEXT,
    avatar_url TEXT NOT NULL,
    bio TEXT,
    custom_bio TEXT,
    company TEXT,
    location TEXT,
    email TEXT,
    blog TEXT,
    theme TEXT DEFAULT 'corporate-dark',
    custom_links JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 📄 Lisans

Bu proje [MIT Lisansı](LICENSE) ile lisanslanmıştır.
