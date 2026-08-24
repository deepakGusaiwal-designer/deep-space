import { supabase, isSupabaseConfigured } from '../lib/supabase';
import type { BlogPost } from '../content/blogs';
import {
  BLOG_POSTS,
  saveCustomPost,
  deleteCustomPost,
  getAllBlogPosts,
} from '../content/blogs';

export interface DbBlogPost {
  id: string;
  slug: string;
  title: string;
  subtitle: string | null;
  excerpt: string;
  content: string[];
  content_html: string | null;
  category: string;
  date: string;
  read_time: string;
  tags: string[];
  featured: boolean;
  created_at?: string;
  updated_at?: string;
}

function mapDbToBlogPost(db: DbBlogPost): BlogPost {
  return {
    id: db.id,
    slug: db.slug,
    title: db.title,
    subtitle: db.subtitle || undefined,
    excerpt: db.excerpt,
    content: Array.isArray(db.content) ? db.content : [db.excerpt],
    contentHtml: db.content_html || undefined,
    category: db.category as BlogPost['category'],
    date: db.date,
    readTime: db.read_time,
    tags: Array.isArray(db.tags) ? db.tags : [],
    featured: Boolean(db.featured),
  };
}

function mapBlogPostToDb(post: BlogPost): DbBlogPost {
  return {
    id: post.id,
    slug: post.slug,
    title: post.title,
    subtitle: post.subtitle || null,
    excerpt: post.excerpt,
    content: post.content,
    content_html: post.contentHtml || null,
    category: post.category,
    date: post.date,
    read_time: post.readTime,
    tags: post.tags,
    featured: Boolean(post.featured),
    updated_at: new Date().toISOString(),
  };
}

/** Fetch all global posts from Supabase or fallback to local */
export async function fetchGlobalBlogPosts(): Promise<BlogPost[]> {
  // If Supabase is not configured, return local + static posts
  if (!isSupabaseConfigured() || !supabase) {
    return getAllBlogPosts();
  }

  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('Supabase fetch error, using local fallback:', error.message);
      return getAllBlogPosts();
    }

    if (data && data.length > 0) {
      const cloudPosts = (data as DbBlogPost[]).map(mapDbToBlogPost);

      // Merge with static built-in posts (deduplicating by slug)
      const cloudSlugs = new Set(cloudPosts.map((p) => p.slug));
      const filteredBuiltIn = BLOG_POSTS.filter((p) => !cloudSlugs.has(p.slug));
      const merged = [...cloudPosts, ...filteredBuiltIn];

      // Update local storage cache for instant offline loads
      cloudPosts.forEach((p) => saveCustomPost(p));

      return merged;
    }

    // If cloud table is empty, seed with built-in posts
    return getAllBlogPosts();
  } catch (err) {
    console.error('Unexpected error fetching from Supabase:', err);
    return getAllBlogPosts();
  }
}

/** Save a post to Supabase Cloud + LocalStorage */
export async function saveGlobalBlogPost(post: BlogPost): Promise<{ success: boolean; error?: string }> {
  // Always update local cache first
  saveCustomPost(post);

  if (!isSupabaseConfigured() || !supabase) {
    return { success: true };
  }

  try {
    const dbPayload = mapBlogPostToDb(post);
    const { error } = await supabase
      .from('blog_posts')
      .upsert(dbPayload, { onConflict: 'id' });

    if (error) {
      console.error('Failed to save to Supabase:', error.message);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err: any) {
    console.error('Error saving post to Supabase:', err);
    return { success: false, error: err?.message || 'Unknown network error' };
  }
}

/** Delete a post from Supabase Cloud + LocalStorage */
export async function deleteGlobalBlogPost(id: string): Promise<{ success: boolean; error?: string }> {
  deleteCustomPost(id);

  if (!isSupabaseConfigured() || !supabase) {
    return { success: true };
  }

  try {
    const { error } = await supabase.from('blog_posts').delete().eq('id', id);
    if (error) {
      console.error('Failed to delete from Supabase:', error.message);
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (err: any) {
    console.error('Error deleting from Supabase:', err);
    return { success: false, error: err?.message || 'Unknown error' };
  }
}
