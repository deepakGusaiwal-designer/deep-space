import { useState, useEffect, useMemo, useCallback } from 'react';
import type { BlogPost } from '../content/blogs';
import { BLOG_CATEGORIES, getAllBlogPosts } from '../content/blogs';
import BlogNav from './components/BlogNav';
import BlogCard from './components/BlogCard';
import BlogDetail from './components/BlogDetail';
import AdBanner from './components/AdBanner';
import BlogStudio from './admin/BlogStudio';
import AdminAuth, { isAdminAuthenticated } from './admin/AdminAuth';
import { Search, BookOpen } from 'lucide-react';

function getSlugFromLocation(): string | null {
  if (typeof window === 'undefined') return null;
  const pathname = window.location.pathname;
  const match = pathname.match(/^\/(?:blog|blogs)\/([^/]+)/i);
  if (match && match[1] && match[1] !== 'index.html') {
    return decodeURIComponent(match[1]);
  }
  const hash = window.location.hash.replace('#', '');
  if (hash) return decodeURIComponent(hash);
  return null;
}

export default function BlogApp() {
  const [allPosts, setAllPosts] = useState<BlogPost[]>(() => getAllBlogPosts());
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedPostSlug, setSelectedPostSlug] = useState<string | null>(getSlugFromLocation());
  const [isAdminAuthed, setIsAdminAuthed] = useState<boolean>(() => isAdminAuthenticated());

  const refreshPosts = useCallback(() => {
    setAllPosts(getAllBlogPosts());
  }, []);

  const isAdminRoute = selectedPostSlug === 'admin';

  // Listen to browser Back / Forward buttons & initial URL path
  useEffect(() => {
    const handleLocationChange = () => {
      const slug = getSlugFromLocation();
      setSelectedPostSlug(slug);
      setIsAdminAuthed(isAdminAuthenticated());

      if (slug === 'admin') {
        document.title = 'Author Studio — Deepak Gusaiwal';
      } else if (slug) {
        const post = allPosts.find((p) => p.slug === slug);
        if (post) {
          document.title = `${post.title} — Deepak Gusaiwal`;
        }
      } else {
        document.title = 'Thoughts & Articles — Deepak Gusaiwal | UI/UX & Interactive Developer';
      }
    };

    handleLocationChange();

    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);
    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
    };
  }, [allPosts]);

  const handleSelectPost = (slug: string | null) => {
    setSelectedPostSlug(slug);
    if (slug) {
      window.history.pushState({ slug }, '', `/blog/${slug}`);
      if (slug === 'admin') {
        document.title = 'Author Studio — Deepak Gusaiwal';
      } else {
        const post = allPosts.find((p) => p.slug === slug);
        if (post) {
          document.title = `${post.title} — Deepak Gusaiwal`;
        }
      }
    } else {
      window.history.pushState({}, '', '/blog/');
      document.title = 'Thoughts & Articles — Deepak Gusaiwal | UI/UX & Interactive Developer';
    }
  };

  const filteredPosts = useMemo(() => {
    return allPosts.filter((post) => {
      const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        post.title.toLowerCase().includes(q) ||
        post.excerpt.toLowerCase().includes(q) ||
        post.tags.some((t) => t.toLowerCase().includes(q));
      return matchesCategory && matchesSearch;
    });
  }, [allPosts, selectedCategory, searchQuery]);

  const currentPost = useMemo(() => {
    if (isAdminRoute) return null;
    return allPosts.find((p) => p.slug === selectedPostSlug) || null;
  }, [allPosts, selectedPostSlug, isAdminRoute]);

  // Admin Studio Route View
  if (isAdminRoute) {
    if (!isAdminAuthed) {
      return (
        <div className="min-h-screen bg-[#07080a] text-[#f5f3ee]">
          <header className="border-b border-white/10 px-6 py-4">
            <button
              type="button"
              onClick={() => handleSelectPost(null)}
              className="flex cursor-pointer items-center gap-1.5 text-xs font-semibold text-dim hover:text-soft"
            >
              ← Return to Blog
            </button>
          </header>
          <AdminAuth onAuthenticated={() => setIsAdminAuthed(true)} />
        </div>
      );
    }

    return (
      <BlogStudio
        onExit={() => handleSelectPost(null)}
        onPostUpdated={refreshPosts}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-[#f5f3ee] selection:bg-[#CB152F]/30 selection:text-white">
      {/* Navigation Header */}
      <BlogNav onSelectPost={handleSelectPost} selectedPostSlug={selectedPostSlug} />

      {/* Main Content */}
      <main className="mx-auto max-w-6xl px-6 py-10 md:px-10 md:py-16">
        {currentPost ? (
          <BlogDetail
            post={currentPost}
            onBack={() => handleSelectPost(null)}
            onSelectPost={handleSelectPost}
          />
        ) : (
          <div>
            {/* Hero Banner */}
            <div className="mb-12 text-center md:mb-16">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-semibold tracking-widest text-soft uppercase">
                <BookOpen className="size-3.5" />
                My Thoughts & Perspectives
              </div>
              <h1 className="h-display mt-6 text-4xl font-extrabold text-white md:text-6xl">
                Thoughts & Articles
              </h1>
              <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-slate-300 md:text-base">
                Reflections on UI/UX design, interactive experiences, 3D WebGL graphics, and creative development.
              </p>
            </div>

            {/* Top AdSense Banner */}
            <AdBanner slot="blog-listing-header" label="Sponsored Banner" className="mb-12" />

            {/* Controls: Search and Category Filter Tabs */}
            <div className="mb-10 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              {/* Category Pills */}
              <div className="flex flex-wrap gap-2">
                {BLOG_CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCategory(cat)}
                    className={`cursor-pointer rounded-full px-4 py-2 text-xs font-semibold tracking-wider uppercase transition-all duration-300 ${
                      selectedCategory === cat
                        ? 'border border-white/40 bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.3)]'
                        : 'border border-white/10 bg-white/5 text-soft hover:border-white/20 hover:bg-white/10'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Search Bar */}
              <div className="relative w-full max-w-xs">
                <Search className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-dim" />
                <input
                  type="text"
                  placeholder="Search articles or tags..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-full border border-white/15 bg-white/5 py-2 pl-10 pr-4 text-xs text-soft placeholder:text-dim backdrop-blur-md transition-all focus:border-white/40 focus:outline-none focus:ring-1 focus:ring-white/20"
                />
              </div>
            </div>

            {/* Post Listing Grid with In-Feed AdSense */}
            {filteredPosts.length > 0 ? (
              <div className="grid gap-8 sm:grid-cols-2">
                {filteredPosts.map((post, idx) => (
                  <div key={post.id} className="flex flex-col">
                    <BlogCard post={post} onSelect={handleSelectPost} />

                    {/* Insert In-Feed Ad Banner after the 2nd post */}
                    {idx === 1 && (
                      <div className="col-span-full my-4">
                        <AdBanner slot="in-feed-grid" label="Sponsored Post / Ad" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-white/10 bg-white/[0.02] py-20 text-center text-dim">
                <p className="text-sm">No articles found matching your criteria.</p>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedCategory('All');
                    setSearchQuery('');
                  }}
                  className="mt-4 text-xs font-semibold text-soft underline"
                >
                  Clear filters
                </button>
              </div>
            )}

            {/* Bottom AdSense Banner */}
            <AdBanner slot="blog-listing-footer" label="Advertisement" className="mt-16" />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 py-12 text-center text-xs text-dim">
        <p>© {new Date().getFullYear()} Deepak Gusaiwal · UI/UX Designer & Interactive Developer</p>
        <p className="mt-2 font-mono text-[10px] tracking-widest uppercase">
          Sic mundus creatus est
        </p>
      </footer>
    </div>
  );
}
