# 🚀 Kodfolyo - Developer Executive & Minimalist Portfolyo Üreteci

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

```bash
git clone [https://github.com/erdemsnsy/kodfolyo.git](https://github.com/erdemsnsy/kodfolyo.git)
cd kodfolyo
npm install
cp .env.example .env.local
npm run dev
```

Tarayıcınızda [http://localhost:3005](http://localhost:3005) adresini açın.

### Ortam Değişkenleri (`.env.local`):

```env
NEXTAUTH_SECRET=kodfolyo_super_secret_key
NEXTAUTH_URL=http://localhost:3005

# Supabase (Opsiyonel)
NEXT_PUBLIC_SUPABASE_URL=[https://your-project.supabase.co](https://your-project.supabase.co)
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# GitHub OAuth (Opsiyonel)
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
```

---

## 🗄️ Supabase Veritabanı Kurulumu (Opsiyonel)

```sql
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
