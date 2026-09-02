import type { Metadata } from 'next';
import { Archivo, DM_Mono } from 'next/font/google';
import './globals.css';
import SessionProvider from '@/components/providers/SessionProvider';

const archivo = Archivo({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  variable: '--font-sans',
  display: 'swap',
});

const dmMono = DM_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-mono',
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
    <html lang="tr" className={`${archivo.variable} ${dmMono.variable}`}>
      <body className="bg-[#F4F1EA] text-[#191720] font-sans antialiased selection:bg-[#00A676] selection:text-white">
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
