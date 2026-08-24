import { useState, useMemo } from 'react';
import type { BlogPost } from '../../content/blogs';
import {
  BLOG_CATEGORIES,
  getAllBlogPosts,
  saveCustomPost,
  deleteCustomPost,
  generateExportCode,
} from '../../content/blogs';
import BlogDetail from '../components/BlogDetail';
import BlogLexicalEditor from './lexical/BlogLexicalEditor';
import { clearAdminAuth } from './AdminAuth';
import {
  Plus,
  Trash2,
  Edit3,
  Copy,
  Download,
  Eye,
  Send,
  LogOut,
  ArrowLeft,
  Check,
  Code2,
  FileText,
  List,
  Sparkles,
} from 'lucide-react';

interface BlogStudioProps {
  onExit: () => void;
  onPostUpdated?: () => void;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function estimateReadingTime(paragraphs: string[]): string {
  const words = paragraphs.join(' ').trim().split(/\s+/).length;
  const minutes = Math.max(1, Math.ceil(words / 180));
  return `${minutes} min read`;
}

export default function BlogStudio({ onExit, onPostUpdated }: BlogStudioProps) {
  const [activeTab, setActiveTab] = useState<'editor' | 'manage'>('editor');
  const [posts, setPosts] = useState<BlogPost[]>(() => getAllBlogPosts());

  // Form State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [slug, setSlug] = useState('');
  const [category, setCategory] = useState<BlogPost['category']>('3D & WebGL');
  const [tagsInput, setTagsInput] = useState('WebGL, Three.js, UI/UX');
  const [paragraphs, setParagraphs] = useState<string[]>([
    'Start typing your article content here...',
  ]);
  const [contentHtml, setContentHtml] = useState<string>('');
  const [featured, setFeatured] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);
  const [copiedExport, setCopiedExport] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);

  // Auto-slug when title changes (if not editing an existing slug)
  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!editingId) {
      setSlug(slugify(val));
    }
  };

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const currentPreviewPost: BlogPost = useMemo(() => {
    const cleanParagraphs = paragraphs.filter((p) => p.trim().length > 0);
    return {
      id: editingId || `post-${Date.now()}`,
      slug: slug.trim() || 'preview-slug',
      title: title.trim() || 'Untitled Article',
      subtitle: subtitle.trim() || undefined,
      excerpt: cleanParagraphs[0] || 'Article excerpt preview...',
      content: cleanParagraphs.length > 0 ? cleanParagraphs : ['Write content...'],
      contentHtml: contentHtml.trim() || undefined,
      date: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
      readTime: estimateReadingTime(cleanParagraphs),
      category,
      tags: tagsInput
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
      featured,
    };
  }, [editingId, slug, title, subtitle, paragraphs, contentHtml, category, tagsInput, featured]);

  const handlePublish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      showToast('⚠️ Please enter an article title');
      return;
    }
    if (!slug.trim()) {
      showToast('⚠️ Please enter a URL slug');
      return;
    }

    const postToSave: BlogPost = {
      ...currentPreviewPost,
      id: editingId || `custom-${Date.now()}`,
      slug: slugify(slug),
    };

    saveCustomPost(postToSave);
    const updated = getAllBlogPosts();
    setPosts(updated);
    onPostUpdated?.();
    showToast('✨ Article published successfully!');

    // Reset form
    setEditingId(null);
    setTitle('');
    setSubtitle('');
    setSlug('');
    setParagraphs(['']);
    setContentHtml('');
    setTagsInput('WebGL, Three.js');
  };

  const handleEdit = (post: BlogPost) => {
    setEditingId(post.id);
    setTitle(post.title);
    setSubtitle(post.subtitle || '');
    setSlug(post.slug);
    setCategory(post.category);
    setTagsInput(post.tags.join(', '));
    setParagraphs(post.content.length > 0 ? post.content : ['']);
    setContentHtml(post.contentHtml || '');
    setFeatured(Boolean(post.featured));
    setActiveTab('editor');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    showToast(`Editing "${post.title}"`);
  };

  const handleDelete = (id: string, titleStr: string) => {
    if (window.confirm(`Are you sure you want to delete "${titleStr}"?`)) {
      deleteCustomPost(id);
      const updated = getAllBlogPosts();
      setPosts(updated);
      onPostUpdated?.();
      showToast('🗑️ Article deleted');
      if (editingId === id) {
        setEditingId(null);
        setTitle('');
        setParagraphs(['']);
      }
    }
  };

  const handleCopyExportCode = () => {
    const code = generateExportCode(posts);
    navigator.clipboard.writeText(code);
    setCopiedExport(true);
    setTimeout(() => setCopiedExport(false), 2500);
    showToast('📋 TypeScript code copied to clipboard!');
  };

  const handleDownloadFile = () => {
    const code = generateExportCode(posts);
    const blob = new Blob([code], { type: 'text/typescript' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'blogs.ts';
    a.click();
    URL.revokeObjectURL(url);
    showToast('💾 blogs.ts downloaded!');
  };

  const handleLogout = () => {
    clearAdminAuth();
    onExit();
  };

  return (
    <div className="min-h-screen bg-[#07080a] text-[#f5f3ee]">
      {/* Studio Header */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#07080a]/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={onExit}
              className="flex cursor-pointer items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3.5 py-1.5 text-xs font-semibold tracking-wider text-soft uppercase transition-all hover:bg-white/10"
            >
              <ArrowLeft className="size-3.5" />
              <span>Back to Blog</span>
            </button>

            <span className="h-4 w-px bg-white/20" />

            <div className="flex items-center gap-2">
              <span className="font-display text-sm font-bold tracking-widest text-white uppercase">
                Author Studio
              </span>
              <span className="rounded-full bg-emerald-500/20 px-2.5 py-0.5 font-mono text-[10px] font-semibold text-emerald-400">
                Logged In
              </span>
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setActiveTab('editor')}
              className={`flex cursor-pointer items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-xs font-semibold tracking-wider uppercase transition-all ${
                activeTab === 'editor'
                  ? 'border border-white/30 bg-white/15 text-white'
                  : 'text-dim hover:text-soft'
              }`}
            >
              <FileText className="size-3.5" />
              <span>Editor</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('manage')}
              className={`flex cursor-pointer items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-xs font-semibold tracking-wider uppercase transition-all ${
                activeTab === 'manage'
                  ? 'border border-white/30 bg-white/15 text-white'
                  : 'text-dim hover:text-soft'
              }`}
            >
              <List className="size-3.5" />
              <span>All Posts ({posts.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setShowExportModal(true)}
              className="flex cursor-pointer items-center gap-1.5 rounded-xl border border-white/15 bg-white/5 px-3.5 py-1.5 text-xs font-semibold tracking-wider text-soft uppercase transition-all hover:border-white/30 hover:bg-white/10"
            >
              <Code2 className="size-3.5" />
              <span>Export Code</span>
            </button>

            <button
              type="button"
              onClick={handleLogout}
              className="flex cursor-pointer items-center gap-1.5 rounded-xl border border-red-500/20 bg-red-500/10 px-3.5 py-1.5 text-xs font-semibold tracking-wider text-red-300 uppercase transition-all hover:bg-red-500/20"
              title="Logout from Studio"
            >
              <LogOut className="size-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* Toast Notification */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 rounded-2xl border border-white/20 bg-white/10 px-5 py-3 text-xs font-semibold text-white shadow-2xl backdrop-blur-xl">
          {notification}
        </div>
      )}

      {/* Main Studio View */}
      <div className="mx-auto max-w-7xl p-6 md:p-10">
        {activeTab === 'manage' ? (
          /* Manage Posts Table */
          <div className="rounded-3xl border border-white/10 bg-white/[0.02] p-8 backdrop-blur-xl">
            <div className="flex items-center justify-between pb-6 border-b border-white/10">
              <div>
                <h2 className="h-display text-2xl font-bold text-white">Manage Blog Posts</h2>
                <p className="mt-1 text-xs text-dim">
                  View, edit, or delete live and built-in articles
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setEditingId(null);
                  setTitle('');
                  setSubtitle('');
                  setSlug('');
                  setParagraphs(['']);
                  setActiveTab('editor');
                }}
                className="flex cursor-pointer items-center gap-2 rounded-xl border border-white/20 bg-white px-4 py-2 text-xs font-bold tracking-wider text-black uppercase hover:bg-white/90"
              >
                <Plus className="size-4" />
                New Post
              </button>
            </div>

            <div className="mt-6 divide-y divide-white/10">
              {posts.map((p) => (
                <div key={p.id} className="flex items-center justify-between py-4">
                  <div className="max-w-xl">
                    <div className="flex items-center gap-3">
                      <span className="rounded-md border border-white/20 bg-white/5 px-2 py-0.5 font-mono text-[10px] text-dim">
                        {p.category}
                      </span>
                      <span className="font-mono text-xs text-white/50">{p.date}</span>
                    </div>
                    <h3 className="h-display mt-1 text-base font-bold text-white">{p.title}</h3>
                    <p className="font-mono text-[11px] text-dim">/blog/{p.slug}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleEdit(p)}
                      className="flex cursor-pointer items-center gap-1 rounded-lg border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-semibold text-soft hover:bg-white/15"
                    >
                      <Edit3 className="size-3.5" />
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(p.id, p.title)}
                      className="flex cursor-pointer items-center gap-1 rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-1.5 text-xs font-semibold text-red-300 hover:bg-red-500/20"
                    >
                      <Trash2 className="size-3.5" />
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* Split View: Editor & Live Preview */
          <div className="grid gap-8 lg:grid-cols-2">
            {/* Editor Column */}
            <div className="rounded-3xl border border-white/10 bg-white/[0.02] p-6 backdrop-blur-xl md:p-8">
              <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Edit3 className="size-4 text-soft" />
                  <h2 className="h-display text-xl font-bold text-white">
                    {editingId ? 'Edit Article' : 'Compose New Article'}
                  </h2>
                </div>
                {editingId && (
                  <span className="rounded-md bg-amber-500/20 px-2 py-0.5 font-mono text-[10px] text-amber-300">
                    Editing Mode
                  </span>
                )}
              </div>

              <form onSubmit={handlePublish} className="space-y-6">
                {/* Title */}
                <div>
                  <label className="mb-2 block text-xs font-semibold tracking-wider text-soft uppercase">
                    Article Title *
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    placeholder="e.g. Building Next-Gen WebGL Shaders"
                    className="w-full rounded-xl border border-white/15 bg-white/5 p-3.5 text-sm font-semibold text-white placeholder:text-dim focus:border-white/40 focus:outline-none"
                    required
                  />
                </div>

                {/* Subtitle */}
                <div>
                  <label className="mb-2 block text-xs font-semibold tracking-wider text-soft uppercase">
                    Subtitle / Hook
                  </label>
                  <input
                    type="text"
                    value={subtitle}
                    onChange={(e) => setSubtitle(e.target.value)}
                    placeholder="A brief one-line description of the article..."
                    className="w-full rounded-xl border border-white/15 bg-white/5 p-3 text-xs text-soft placeholder:text-dim focus:border-white/40 focus:outline-none"
                  />
                </div>

                {/* URL Slug */}
                <div>
                  <label className="mb-2 block text-xs font-semibold tracking-wider text-soft uppercase">
                    Custom URL Slug *
                  </label>
                  <div className="flex items-center rounded-xl border border-white/15 bg-white/5 px-3">
                    <span className="font-mono text-xs text-dim">/blog/</span>
                    <input
                      type="text"
                      value={slug}
                      onChange={(e) => setSlug(slugify(e.target.value))}
                      placeholder="my-article-slug"
                      className="w-full bg-transparent p-2.5 font-mono text-xs text-soft focus:outline-none"
                      required
                    />
                  </div>
                </div>

                {/* Category & Tags Grid */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-xs font-semibold tracking-wider text-soft uppercase">
                      Category
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value as BlogPost['category'])}
                      className="w-full rounded-xl border border-white/15 bg-[#0a0b0d] p-3 text-xs text-soft focus:border-white/40 focus:outline-none"
                    >
                      {BLOG_CATEGORIES.filter((c) => c !== 'All').map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="mb-2 block text-xs font-semibold tracking-wider text-soft uppercase">
                      Tags (Comma separated)
                    </label>
                    <input
                      type="text"
                      value={tagsInput}
                      onChange={(e) => setTagsInput(e.target.value)}
                      placeholder="WebGL, Three.js, UI/UX"
                      className="w-full rounded-xl border border-white/15 bg-white/5 p-3 text-xs text-soft placeholder:text-dim focus:border-white/40 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Lexical Rich Text Editor */}
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <label className="text-xs font-semibold tracking-wider text-soft uppercase">
                      Article Content (Lexical Rich Text)
                    </label>
                    <span className="flex items-center gap-1 font-mono text-[10px] text-dim">
                      <Sparkles className="size-3 text-goldlight/70" />
                      Markdown & formatting shortcuts active
                    </span>
                  </div>

                  <BlogLexicalEditor
                    key={editingId || 'new-post-editor'}
                    initialParagraphs={paragraphs}
                    onChange={(paras, html) => {
                      setParagraphs(paras);
                      setContentHtml(html);
                    }}
                  />
                </div>

                {/* Submit Action */}
                <div className="flex items-center gap-4 pt-4">
                  <button
                    type="submit"
                    className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl border border-white/20 bg-white p-3.5 text-xs font-bold tracking-widest text-black uppercase shadow-[0_0_30px_rgba(255,255,255,0.25)] transition-all hover:bg-white/90 active:scale-[0.99]"
                  >
                    <Send className="size-4" />
                    <span>{editingId ? 'Update & Save Post' : 'Publish Article Live'}</span>
                  </button>

                  {editingId && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingId(null);
                        setTitle('');
                        setSubtitle('');
                        setSlug('');
                        setParagraphs(['']);
                        setContentHtml('');
                      }}
                      className="cursor-pointer rounded-xl border border-white/15 bg-white/5 px-4 py-3.5 text-xs font-semibold text-dim hover:text-soft"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>

            {/* Live Preview Column */}
            <div className="rounded-3xl border border-white/10 bg-[#050505] p-6 shadow-2xl backdrop-blur-2xl md:p-8">
              <div className="mb-4 flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-soft uppercase">
                  <Eye className="size-4" />
                  <span>Real-Time Live Reader Preview</span>
                </div>
                <span className="font-mono text-[10px] text-dim">
                  URL: /blog/{slug || 'your-slug'}
                </span>
              </div>

              <div className="max-h-[85vh] overflow-y-auto pr-2">
                <BlogDetail
                  post={currentPreviewPost}
                  onBack={() => {}}
                  onSelectPost={() => {}}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Export TypeScript Code Modal */}
      {showExportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md">
          <div className="relative w-full max-w-2xl rounded-3xl border border-white/20 bg-[#0a0b0d] p-6 shadow-2xl md:p-8">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-2">
                <Code2 className="size-5 text-soft" />
                <h3 className="h-display text-lg font-bold text-white">Export Code for Git</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowExportModal(false)}
                className="cursor-pointer text-dim hover:text-white"
              >
                ✕
              </button>
            </div>

            <p className="mt-3 text-xs text-slate-300">
              Copy this code and paste it into{' '}
              <code className="rounded bg-white/10 px-1.5 py-0.5 font-mono text-soft">
                src/content/blogs.ts
              </code>{' '}
              to permanently bake all your articles into your source code repository.
            </p>

            <div className="relative mt-4">
              <pre className="max-h-72 overflow-y-auto rounded-xl border border-white/10 bg-black/60 p-4 font-mono text-[11px] text-slate-300">
                {generateExportCode(posts)}
              </pre>
            </div>

            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={handleDownloadFile}
                className="flex cursor-pointer items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-xs font-semibold text-soft hover:bg-white/15"
              >
                <Download className="size-3.5" />
                Download blogs.ts
              </button>

              <button
                type="button"
                onClick={handleCopyExportCode}
                className="flex cursor-pointer items-center gap-2 rounded-xl border border-white/20 bg-white px-5 py-2.5 text-xs font-bold text-black hover:bg-white/90"
              >
                {copiedExport ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
                <span>{copiedExport ? 'Copied Code!' : 'Copy Code'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
