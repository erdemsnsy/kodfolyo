export interface FeedPost {
  title: string;
  url: string;
  date: string | null;
  excerpt: string;
  source: string;
}

function decodeEntities(text: string): string {
  return text
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .trim();
}

function stripHtml(html: string): string {
  return decodeEntities(html.replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ').trim();
}

function extractTag(block: string, tag: string): string | null {
  const match = block.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`, 'i'));
  return match ? decodeEntities(match[1]) : null;
}

function sourceFromUrl(feedUrl: string): string {
  if (feedUrl.includes('dev.to')) return 'dev.to';
  if (feedUrl.includes('medium.com')) return 'Medium';
  if (feedUrl.includes('hashnode')) return 'Hashnode';
  try {
    return new URL(feedUrl).hostname.replace(/^www\./, '');
  } catch {
    return 'RSS';
  }
}

// Bağımlılıksız, minimal RSS 2.0 / Atom parser — dev.to ve Medium
// akışlarını kapsayacak kadar yeterli, tam standart uyumu iddia etmiyor.
export async function fetchLatestPosts(feedUrl: string, limit = 3): Promise<FeedPost[]> {
  if (!feedUrl) return [];

  let normalizedUrl = feedUrl.trim();
  if (!/^https?:\/\//i.test(normalizedUrl)) normalizedUrl = `https://${normalizedUrl}`;

  try {
    const res = await fetch(normalizedUrl, {
      headers: { 'User-Agent': 'Kodfolyo-App' },
      next: { revalidate: 1800 },
    });
    if (!res.ok) return [];

    const xml = await res.text();
    const source = sourceFromUrl(normalizedUrl);

    // RSS 2.0 <item> veya Atom <entry> blokları
    const itemBlocks = xml.match(/<item[^>]*>[\s\S]*?<\/item>/gi) || xml.match(/<entry[^>]*>[\s\S]*?<\/entry>/gi) || [];

    const posts: FeedPost[] = itemBlocks.slice(0, limit).map((block) => {
      const title = extractTag(block, 'title') || 'Başlıksız yazı';
      const linkMatch = block.match(/<link[^>]*href="([^"]+)"/i) || block.match(/<link[^>]*>([\s\S]*?)<\/link>/i);
      const url = linkMatch ? decodeEntities(linkMatch[1]) : normalizedUrl;
      const date = extractTag(block, 'pubDate') || extractTag(block, 'published') || extractTag(block, 'updated');
      const rawDescription = extractTag(block, 'content:encoded') || extractTag(block, 'description') || extractTag(block, 'summary') || '';
      const excerpt = stripHtml(rawDescription).slice(0, 160);

      return { title: stripHtml(title), url, date, excerpt, source };
    });

    return posts;
  } catch (err) {
    console.warn('RSS fetch error:', err);
    return [];
  }
}
