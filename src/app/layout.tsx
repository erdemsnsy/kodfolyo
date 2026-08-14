import type { Metadata } from 'next';
import { JetBrains_Mono, Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import SessionProvider from '@/components/providers/SessionProvider';

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Kodfolyo - Terminal & Developer Minimalist Portfolyo',
  description:
    'GitHub profilinizdeki verileri (bio, repolar, diller) otomatik çekerek sade, karakterli ve minimalist portföy siteleri oluşturan ücretsiz web uygulaması.',
  keywords: ['GitHub', 'Portfolyo', 'CV', 'Developer Portfolio', 'Minimalist', 'Next.js', 'Kodfolyo'],
  openGraph: {
    title: 'Kodfolyo - Minimalist Portfolyo Üreteci',
    description: 'GitHub profilinizden sade, terminal estetiğinde portföy oluşturun.',
    siteName: 'Kodfolyo',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" className={`${jetbrainsMono.variable} ${plusJakartaSans.variable}`}>
      <body className="bg-[#0c0d0e] text-[#f8fafc] font-sans antialiased selection:bg-white selection:text-slate-950">
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
