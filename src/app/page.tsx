import Navbar from '@/components/navbar/Navbar';
import LandingHero from '@/components/landing/LandingHero';
import LandingFeatures from '@/components/landing/LandingFeatures';
import LandingPreview from '@/components/landing/LandingPreview';
import Link from 'next/link';
import { Code2 } from 'lucide-react';
import { GithubIcon } from '@/components/icons/GithubIcon';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0c0d0e] text-[#f8fafc] flex flex-col selection:bg-white selection:text-slate-950">
      <Navbar />

      <main className="flex-1 space-y-6">
        <LandingHero />
        <LandingPreview />
        <LandingFeatures />

        {/* CTA Bitiş Kutusu */}
        <section className="mx-auto max-w-4xl px-4 sm:px-6 my-16">
          <div className="p-8 sm:p-10 rounded-2xl border border-[#23272e] bg-[#141619] text-center space-y-4 shadow-xl">
            <h2 className="text-xl sm:text-3xl font-extrabold text-white">
              Portfolyonu Bugün Yayınla
            </h2>
            <p className="text-xs sm:text-sm text-[#94a3b8] max-w-lg mx-auto">
              Sıfır kurulum yükü. GitHub kullanıcı adını gir, sade ve kurumsal portfolyon anında oluşturulsun.
            </p>

            <div className="pt-2">
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 rounded-xl bg-white hover:bg-slate-200 px-6 py-3 text-xs font-bold text-slate-950 shadow transition active:scale-95"
              >
                <GithubIcon className="w-4 h-4" />
                <span>Hemen Başla (Ücretsiz)</span>
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#23272e] bg-[#0c0d0e] py-8 px-4 text-center text-xs text-[#64748b]">
        <div className="mx-auto max-w-4xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="flex h-5 w-5 items-center justify-center rounded bg-white text-slate-950 font-bold">
              <Code2 className="h-3 w-3" />
            </div>
            <span className="font-bold text-white">Kodfolyo.dev</span>
          </div>

          <p>© {new Date().getFullYear()} Kodfolyo. Tüm hakları saklıdır.</p>
        </div>
      </footer>
    </div>
  );
}
