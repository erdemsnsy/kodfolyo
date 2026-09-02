import type { Metadata } from 'next';
import { JetBrains_Mono, Plus_Jakarta_Sans, Space_Grotesk } from 'next/font/google';
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

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['500', '700'],
  variable: '--font-display',
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
    <html lang="tr" className={`${jetbrainsMono.variable} ${plusJakartaSans.variable} ${spaceGrotesk.variable}`}>
      <body className="bg-[#14110f] text-[#fdf6ec] font-sans antialiased selection:bg-[#ff5a3c] selection:text-[#14110f]">
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
