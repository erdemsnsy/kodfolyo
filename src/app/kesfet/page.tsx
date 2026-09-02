import Navbar from '@/components/navbar/Navbar';
import DiscoverGrid from '@/components/discover/DiscoverGrid';
import { fetchDiscoverProfileSummary } from '@/lib/github/fetcher';

export const dynamic = 'force-dynamic';

// Örnek/gösterim amaçlı seçilmiş 12 gerçek GitHub kullanıcısı — verileri
// canlı GitHub API'den çekilir, hiçbiri uydurma değil.
const FEATURED_USERNAMES = [
  'torvalds', 'gaearon', 'sindresorhus', 'yyx990803', 'developit', 'kentcdodds',
  'wesbos', 'sdras', 'tj', 'mojombo', 'defunkt', 'addyosmani',
];

export default async function KesfetPage() {
  const results = await Promise.all(FEATURED_USERNAMES.map((u) => fetchDiscoverProfileSummary(u)));
  const profiles = results.filter((p): p is NonNullable<typeof p> => p !== null);

  return (
    <div style={{ minHeight: '100vh', background: '#F4F1EA' }}>
      <Navbar />

      <div style={{ maxWidth: 1180, margin: '0 auto', padding: '40px clamp(16px, 5vw, 40px) 90px' }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: '#1F3AE8' }}>KEŞFET</span>
        <h1 style={{ margin: '10px 0 10px', fontSize: 'clamp(28px, 5vw, 38px)', fontWeight: 900, letterSpacing: '-.035em', color: '#191720' }}>
          Kodfolyo ile geliştiricileri keşfet.
        </h1>
        <p style={{ margin: '0 0 34px', fontSize: 15.5, color: '#56515F', maxWidth: 560 }}>
          Örnek profil vitrini — gösterilen tüm bilgiler ilgili kullanıcıların gerçek, herkese açık GitHub verisidir.
        </p>

        <DiscoverGrid profiles={profiles} />
      </div>
    </div>
  );
}
