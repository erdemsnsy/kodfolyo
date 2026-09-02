import Navbar from '@/components/navbar/Navbar';
import LandingHero from '@/components/landing/LandingHero';
import LandingFeatures from '@/components/landing/LandingFeatures';
import LandingPreview from '@/components/landing/LandingPreview';
import Link from 'next/link';
import { Code2 } from 'lucide-react';
import { GithubIcon } from '@/components/icons/GithubIcon';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0d1310] text-[#f2f7f0] flex flex-col selection:bg-[#1fd88f] selection:text-[#0d1310]">
      <Navbar />

      <main className="flex-1 space-y-6">
        <LandingHero />
        <LandingPreview />
        <LandingFeatures />

        {/* CTA Bitiş Kutusu */}
        <section className="mx-auto max-w-4xl px-4 sm:px-6 my-16">
          <div className="p-8 sm:p-10 rounded-3xl border border-[#384139] bg-[#17201b] text-center space-y-4 shadow-[6px_6px_0_0_#0d1310]">
            <h2 className="text-xl sm:text-3xl font-extrabold text-[#f2f7f0]">
              Portfolyonu Bugün Yayınla
            </h2>
            <p className="text-xs sm:text-sm text-[#c9d1cb] max-w-lg mx-auto">
              Sıfır kurulum yükü. GitHub kullanıcı adını gir, sade ve kurumsal portfolyon anında oluşturulsun.
            </p>

            <div className="pt-2">
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 rounded-full bg-[#1fd88f] hover:bg-[#4eeaa8] px-6 py-3 text-xs font-bold text-[#0d1310] shadow-[4px_4px_0_0_#f0b429] transition active:scale-95"
              >
                <GithubIcon className="w-4 h-4" />
                <span>Hemen Başla (Ücretsiz)</span>
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#384139] bg-[#0d1310] py-8 px-4 text-center text-xs text-[#93a297]">
        <div className="mx-auto max-w-4xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-[#1fd88f] text-[#0d1310] font-bold">
              <Code2 className="h-3 w-3" />
            </div>
            <span className="font-bold text-[#f2f7f0]">Kodfolyo.dev</span>
          </div>

          <p>© {new Date().getFullYear()} Kodfolyo. Tüm hakları saklıdır.</p>
        </div>
      </footer>
    </div>
  );
}
