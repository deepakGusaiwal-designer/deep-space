import type { BlogPost } from '../../content/blogs';
import { ArrowUpRight, Clock, Calendar } from 'lucide-react';

interface BlogCardProps {
  post: BlogPost;
  onSelect: (slug: string) => void;
}

export default function BlogCard({ post, onSelect }: BlogCardProps) {
  return (
    <article
      onClick={() => onSelect(post.slug)}
      className="group relative flex cursor-pointer flex-col justify-between rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-lg transition-all duration-500 hover:-translate-y-1 hover:border-white/30 hover:bg-white/[0.06] hover:shadow-[0_12px_40px_-15px_rgba(255,255,255,0.12)] md:p-8"
    >
      <div>
        {/* Top Badges */}
        <div className="flex items-center justify-between gap-2">
          <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[10px] font-semibold tracking-widest text-soft uppercase">
            {post.category}
          </span>
          <div className="flex items-center gap-4 text-xs font-mono text-dim">
            <span className="flex items-center gap-1">
              <Clock className="size-3" />
              {post.readTime}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="size-3" />
              {post.date}
            </span>
          </div>
        </div>

        {/* Title & Subtitle */}
        <h3 className="h-display mt-5 text-xl font-bold text-soft transition-colors duration-300 group-hover:text-white md:text-2xl">
          {post.title}
        </h3>

        {post.subtitle && (
          <p className="mt-2 text-xs font-medium text-white/60 leading-relaxed">
            {post.subtitle}
          </p>
        )}

        <p className="mt-4 text-sm leading-relaxed text-slate-300 line-clamp-3">
          {post.excerpt}
        </p>
      </div>

      {/* Footer Tags & Action */}
      <div className="mt-8 border-t border-white/10 pt-4">
        <div className="flex items-center justify-between">
          <div className="flex flex-wrap gap-1.5">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="font-mono text-[10px] tracking-wider text-dim"
              >
                #{tag}
              </span>
            ))}
          </div>

          <div className="flex items-center gap-1 text-xs font-semibold tracking-wider text-soft uppercase transition-colors group-hover:text-white">
            Read
            <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </div>
        </div>
      </div>
    </article>
  );
}
