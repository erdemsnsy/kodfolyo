import Navbar from '@/components/navbar/Navbar';
import LandingHero from '@/components/landing/LandingHero';
import LandingFeatures from '@/components/landing/LandingFeatures';
import LandingPreview from '@/components/landing/LandingPreview';
import Link from 'next/link';
import { Code2 } from 'lucide-react';
import { GithubIcon } from '@/components/icons/GithubIcon';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#14110f] text-[#fdf6ec] flex flex-col selection:bg-[#ff5a3c] selection:text-[#14110f]">
      <Navbar />

      <main className="flex-1 space-y-6">
        <LandingHero />
        <LandingPreview />
        <LandingFeatures />

        {/* CTA Bitiş Kutusu */}
        <section className="mx-auto max-w-4xl px-4 sm:px-6 my-16">
          <div className="p-8 sm:p-10 rounded-3xl border border-[#3a3530] bg-[#1f1a16] text-center space-y-4 shadow-[6px_6px_0_0_#14110f]">
            <h2 className="text-xl sm:text-3xl font-extrabold text-[#fdf6ec]">
              Portfolyonu Bugün Yayınla
            </h2>
            <p className="text-xs sm:text-sm text-[#d6d0c7] max-w-lg mx-auto">
              Sıfır kurulum yükü. GitHub kullanıcı adını gir, sade ve kurumsal portfolyon anında oluşturulsun.
            </p>

            <div className="pt-2">
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 rounded-full bg-[#ff5a3c] hover:bg-[#ff7159] px-6 py-3 text-xs font-bold text-[#14110f] shadow-[4px_4px_0_0_#38bdf8] transition active:scale-95"
              >
                <GithubIcon className="w-4 h-4" />
                <span>Hemen Başla (Ücretsiz)</span>
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#3a3530] bg-[#14110f] py-8 px-4 text-center text-xs text-[#9a948b]">
        <div className="mx-auto max-w-4xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-[#ff5a3c] text-[#14110f] font-bold">
              <Code2 className="h-3 w-3" />
            </div>
            <span className="font-bold text-[#fdf6ec]">Kodfolyo.dev</span>
          </div>

          <p>© {new Date().getFullYear()} Kodfolyo. Tüm hakları saklıdır.</p>
        </div>
      </footer>
    </div>
  );
}
