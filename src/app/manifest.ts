import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Kodfolyo - Terminal & Developer Minimalist Portfolyo',
    short_name: 'Kodfolyo',
    description:
      'GitHub profilinizdeki verileri otomatik çekerek sade, minimalist portföy siteleri oluşturan ücretsiz web uygulaması.',
    start_url: '/',
    display: 'standalone',
    background_color: '#F4F1EA',
    theme_color: '#18181B',
    icons: [
      {
        src: '/icon',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
    ],
  };
}
