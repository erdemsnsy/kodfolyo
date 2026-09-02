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
    theme TEXT DEFAULT 'corporate-dark',
    custom_accent TEXT,
    custom_links JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Var olan veritabanlarında kolon eksikse ekler (yeni kurulumlarda no-op)
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS custom_accent TEXT;

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
    stargazers_count INT DEFAULT 0,
    forks_count INT DEFAULT 0,
    language TEXT,
    languages JSONB DEFAULT '{}'::jsonb,
    topics TEXT[] DEFAULT '{}',
    is_visible BOOLEAN DEFAULT true,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, github_repo_id)
);

-- Index'ler
CREATE INDEX IF NOT EXISTS idx_cached_repos_user_id ON public.cached_repos(user_id);
CREATE INDEX IF NOT EXISTS idx_cached_repos_stars ON public.cached_repos(stargazers_count DESC);

-- RLS (Row Level Security) Ayarları
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cached_repos ENABLE ROW LEVEL SECURITY;

-- Herkes okuyabilsin (Public Read Access)
CREATE POLICY "Public profiles read policy" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Public cached repos read policy" ON public.cached_repos FOR SELECT USING (true);

-- Service Role veya Yetkili Kullanıcı Yazabilsin
CREATE POLICY "Service role full access on profiles" ON public.profiles FOR ALL USING (true);
CREATE POLICY "Service role full access on cached_repos" ON public.cached_repos FOR ALL USING (true);
