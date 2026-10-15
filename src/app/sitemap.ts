import { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/site';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = SITE_URL;

  return [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },
    { url: `${baseUrl}/kesfet`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.7 },
    { url: `${baseUrl}/temalar`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
  ];
}
