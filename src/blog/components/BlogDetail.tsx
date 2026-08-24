import { useEffect } from 'react';
import type { BlogPost } from '../../content/blogs';
import { BLOG_POSTS } from '../../content/blogs';
import AdBanner from './AdBanner';
import { ArrowLeft, Clock, Calendar, Share2, Check } from 'lucide-react';
import { useState } from 'react';

interface BlogDetailProps {
  post: BlogPost;
  onBack: () => void;
  onSelectPost: (slug: string) => void;
}

export default function BlogDetail({ post, onBack, onSelectPost }: BlogDetailProps) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [post.slug]);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const related = BLOG_POSTS.filter((p) => p.slug !== post.slug).slice(0, 2);

  return (
    <article className="mx-auto max-w-4xl py-12 md:px-10 md:py-16">
      {/* Back button */}
      <button
        type="button"
        onClick={onBack}
        className="group mb-10 flex cursor-pointer items-center gap-2 text-xs font-semibold tracking-widest text-soft uppercase transition-colors hover:text-white"
      >
        <ArrowLeft className="size-4 transition-transform duration-300 group-hover:-translate-x-1" />
        Back to all articles
      </button>

      {/* Header Info */}
      <header className="border-b border-white/10 pb-8">
        <div className="flex flex-wrap items-center gap-3">
          <span className="rounded-full border border-white/20 bg-white/10 px-3.5 py-1 text-[11px] font-semibold tracking-widest text-soft uppercase">
            {post.category}
          </span>
          <span className="flex items-center gap-1.5 font-mono text-xs text-dim">
            <Clock className="size-3.5" />
            {post.readTime}
          </span>
          <span className="flex items-center gap-1.5 font-mono text-xs text-dim">
            <Calendar className="size-3.5" />
            {post.date}
          </span>
        </div>

        <h1 className="h-display mt-6 text-3xl font-extrabold text-white md:text-5xl leading-tight">
          {post.title}
        </h1>

        {post.subtitle && (
          <p className="mt-4 text-base font-normal leading-relaxed text-slate-300 md:text-lg">
            {post.subtitle}
          </p>
        )}

        <div className="mt-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-full border border-white/20 bg-white/10 font-bold text-xs">
              DG
            </div>
            <div>
              <div className="text-xs font-semibold text-white">Deepak Gusaiwal</div>
              <div className="text-[10px] text-dim uppercase">UI/UX & Interactive Developer</div>
            </div>
          </div>

          <button
            type="button"
            onClick={handleShare}
            className="flex cursor-pointer items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3.5 py-1.5 text-xs font-semibold text-soft transition-all duration-300 hover:border-white/30 hover:bg-white/10"
            aria-label="Share article link"
          >
            {copied ? <Check className="size-3.5 text-emerald-400" /> : <Share2 className="size-3.5" />}
            <span>{copied ? 'Copied' : 'Share'}</span>
          </button>
        </div>
      </header>

      {/* Top Article Ad Banner */}
      <AdBanner slot="article-top-banner" label="Advertisement" />

      {/* Article Body Content */}
      {post.contentHtml ? (
        <div
          className="prose prose-invert max-w-none my-10 space-y-5 text-base leading-relaxed text-slate-200 md:text-lg [&_h1]:text-2xl [&_h1]:font-bold [&_h1]:text-white [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-soft [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:text-soft [&_blockquote]:border-l-2 [&_blockquote]:border-white/40 [&_blockquote]:bg-white/[0.03] [&_blockquote]:py-2 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-slate-300 [&_ul]:list-disc [&_ul]:ml-6 [&_ol]:list-decimal [&_ol]:ml-6 [&_code]:rounded [&_code]:bg-white/10 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-sm [&_pre]:rounded-xl [&_pre]:border [&_pre]:border-white/15 [&_pre]:bg-black/80 [&_pre]:p-4 [&_pre]:font-mono [&_pre]:text-sm"
          dangerouslySetInnerHTML={{ __html: post.contentHtml }}
        />
      ) : (
        <div className="prose prose-invert max-w-none my-10 space-y-6 text-base leading-relaxed text-slate-200 md:text-lg">
          {post.content.map((paragraph, idx) => (
            <div key={idx}>
              <p className="leading-relaxed">{paragraph}</p>

              {/* In-Article AdSense Banner midway through the article */}
              {idx === 2 && (
                <AdBanner slot="in-article-middle" label="Sponsored Context" className="my-10" />
              )}
            </div>
          ))}
        </div>
      )}

      {/* Article Tags */}
      <div className="my-10 flex flex-wrap gap-2 border-t border-white/10 pt-6">
        {post.tags.map((tag) => (
          <span
            key={tag}
            className="rounded-lg border border-white/10 bg-white/5 px-3 py-1 font-mono text-xs text-soft"
          >
            #{tag}
          </span>
        ))}
      </div>

      {/* Bottom Article Ad Banner */}
      <AdBanner slot="article-bottom-banner" label="Advertisement" />

      {/* Related Articles */}
      {related.length > 0 && (
        <section className="mt-16 border-t border-white/10 pt-10">
          <h2 className="h-display text-2xl font-bold text-white mb-6">More Thoughts</h2>
          <div className="grid gap-6 sm:grid-cols-2">
            {related.map((item) => (
              <div
                key={item.slug}
                onClick={() => onSelectPost(item.slug)}
                className="cursor-pointer rounded-xl border border-white/10 bg-white/[0.03] p-5 transition-all duration-300 hover:border-white/30 hover:bg-white/[0.06]"
              >
                <span className="text-[10px] font-mono text-dim uppercase">{item.category}</span>
                <h4 className="h-display mt-2 text-base font-bold text-white line-clamp-2">{item.title}</h4>
                <p className="mt-2 text-xs text-slate-400 line-clamp-2">{item.excerpt}</p>
              </div>
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
