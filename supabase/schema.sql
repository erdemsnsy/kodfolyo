-- Kodfolyo Supabase Veritabanı Şeması
-- Supabase SQL Editor üzerinde çalıştırılarak tablolar ve indeksler oluşturulabilir.

-- 1. Profiles Tablosu
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
    theme TEXT DEFAULT 'gece',
    custom_accent TEXT,
    custom_links JSONB DEFAULT '[]'::jsonb,
    experience JSONB DEFAULT '[]'::jsonb,
    manual_projects JSONB DEFAULT '[]'::jsonb,
    certificates JSONB DEFAULT '[]'::jsonb,
    section_visibility JSONB DEFAULT '{"techStack":true,"featuredProject":true,"projects":true,"manualProjects":true,"experience":true,"certificates":true,"externalContributions":true,"blogPosts":true}'::jsonb,
    is_published BOOLEAN DEFAULT true,
    custom_domain TEXT UNIQUE,
    custom_domain_verified BOOLEAN DEFAULT false,
    rss_url TEXT,
    seo_title TEXT,
    seo_description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Var olan veritabanlarında kolon eksikse ekler (yeni kurulumlarda no-op)
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS custom_accent TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS experience JSONB DEFAULT '[]'::jsonb;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS manual_projects JSONB DEFAULT '[]'::jsonb;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS certificates JSONB DEFAULT '[]'::jsonb;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS section_visibility JSONB DEFAULT '{"techStack":true,"featuredProject":true,"projects":true,"manualProjects":true,"experience":true,"certificates":true,"externalContributions":true,"blogPosts":true}'::jsonb;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS is_published BOOLEAN DEFAULT true;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS custom_domain TEXT UNIQUE;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS custom_domain_verified BOOLEAN DEFAULT false;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS rss_url TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS seo_title TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS seo_description TEXT;

CREATE INDEX IF NOT EXISTS idx_profiles_custom_domain ON public.profiles(custom_domain) WHERE custom_domain IS NOT NULL;

-- Index'ler (Hızlı sorgulama için)
CREATE INDEX IF NOT EXISTS idx_profiles_username ON public.profiles(username);
CREATE INDEX IF NOT EXISTS idx_profiles_github_id ON public.profiles(github_id);

-- 2. Cached Repositories Tablosu
CREATE TABLE IF NOT EXISTS public.cached_repos (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    github_repo_id BIGINT NOT NULL,
    name TEXT NOT NULL,
    full_name TEXT NOT NULL,
    description TEXT,
    html_url TEXT NOT NULL,
    homepage TEXT,
    stargazers_count INT DEFAULT 0,
    forks_count INT DEFAULT 0,
    language TEXT,
    languages JSONB DEFAULT '{}'::jsonb,
    topics TEXT[] DEFAULT '{}',
    is_visible BOOLEAN DEFAULT true,
    is_featured BOOLEAN DEFAULT false,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, github_repo_id)
);

-- Var olan veritabanlarında kolon eksikse ekler
ALTER TABLE public.cached_repos ADD COLUMN IF NOT EXISTS homepage TEXT;
ALTER TABLE public.cached_repos ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT false;

-- Index'ler
CREATE INDEX IF NOT EXISTS idx_cached_repos_user_id ON public.cached_repos(user_id);
CREATE INDEX IF NOT EXISTS idx_cached_repos_stars ON public.cached_repos(stargazers_count DESC);

-- 3. Sayfa Görüntülenme Kayıtları (gerçek analytics için)
CREATE TABLE IF NOT EXISTS public.page_views (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    referrer_host TEXT,
    visitor_hash TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_page_views_profile_id ON public.page_views(profile_id);
CREATE INDEX IF NOT EXISTS idx_page_views_created_at ON public.page_views(created_at);

-- 4. Link Tıklama Kayıtları
CREATE TABLE IF NOT EXISTS public.link_clicks (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    label TEXT,
    url TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_link_clicks_profile_id ON public.link_clicks(profile_id);

-- 5. PDF İndirme Kayıtları ("PDF indir" butonu -> window.print())
CREATE TABLE IF NOT EXISTS public.pdf_downloads (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_pdf_downloads_profile_id ON public.pdf_downloads(profile_id);

-- RLS (Row Level Security) Ayarları
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cached_repos ENABLE ROW LEVEL SECURITY;

-- Herkes okuyabilsin (Public Read Access)
CREATE POLICY "Public profiles read policy" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Public cached repos read policy" ON public.cached_repos FOR SELECT USING (true);

-- Service Role veya Yetkili Kullanıcı Yazabilsin
CREATE POLICY "Service role full access on profiles" ON public.profiles FOR ALL USING (true);
CREATE POLICY "Service role full access on cached_repos" ON public.cached_repos FOR ALL USING (true);

-- ─── Tablo düzeyi GRANT'lar ─────────────────────────────────────────────────
-- ÖNEMLİ: Proje oluşturulurken "Automatically expose new tables" seçeneği
-- kapatılırsa (güvenlik için önerilir), Supabase yeni tablolara service_role
-- dahil HİÇBİR role otomatik GRANT vermez. RLS politikaları (yukarıda) bu
-- GRANT'ların YERİNE geçmez — GRANT olmadan policy hiç devreye girmeden
-- "permission denied for table ..." hatası alınır. Bu yüzden service_role'e
-- (ve public okuma için anon/authenticated'e) açıkça grant veriyoruz.
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;

GRANT ALL ON public.profiles TO service_role;
GRANT ALL ON public.cached_repos TO service_role;
GRANT ALL ON public.page_views TO service_role;
GRANT ALL ON public.link_clicks TO service_role;
GRANT ALL ON public.pdf_downloads TO service_role;

GRANT SELECT ON public.profiles TO anon, authenticated;
GRANT SELECT ON public.cached_repos TO anon, authenticated;
