import { ThemeType } from '@/types';
import { getTheme } from '@/lib/theme';
import type { FeedPost } from '@/lib/rss';
import { ArrowUpRight } from 'lucide-react';

interface BlogFeedProps {
  posts: FeedPost[];
  themeType?: ThemeType;
}

function formatDate(iso: string | null): string {
  if (!iso) return '';
  const d = new Date(iso);
  if (isNaN(d.getTime())) return '';
  return d.toLocaleDateString('tr-TR', { day: 'numeric', month: 'short', year: 'numeric' });
}

export default function BlogFeed({ posts, themeType }: BlogFeedProps) {
  const theme = getTheme(themeType);

  if (!posts || posts.length === 0) return null;

  return (
    <section style={{ padding: '0 clamp(16px, 5vw, 40px) 60px' }}>
      <div style={{ maxWidth: 1020, margin: '0 auto' }}>
        <h2 style={{ margin: '0 0 20px', fontSize: 28, fontWeight: 800, letterSpacing: '-.03em', color: theme.ink }}>
          Yazılar
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 14 }}>
          {posts.map((post) => (
            <a
              key={post.url}
              href={post.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: 18, borderRadius: 14, border: `1px solid ${theme.border}`, background: theme.card, textDecoration: 'none' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10.5, padding: '3px 9px', borderRadius: 999, background: 'rgba(25,23,32,.05)', color: theme.dim }}>
                  {post.source}
                </span>
                {post.date && <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: theme.mutedLight }}>{formatDate(post.date)}</span>}
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 6 }}>
                <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: theme.ink, lineHeight: 1.35 }}>{post.title}</h3>
                <ArrowUpRight className="w-3.5 h-3.5" style={{ flexShrink: 0, marginTop: 3, color: theme.mutedLight }} />
              </div>
              {post.excerpt && (
                <p style={{ margin: 0, fontSize: 13, lineHeight: 1.5, color: theme.muted, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {post.excerpt}
                </p>
              )}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
