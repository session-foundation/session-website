/**
 * Blog Cache Service
 * 
 * Provides in-memory caching for Contentful blog data to reduce API calls.
 * 
 * Features:
 * - Configurable TTL (Time To Live) for cache entries
 * - Automatic expiration checking
 * - Periodic cleanup of expired entries
 * - Type-safe cache operations
 * 
 * Cache Strategy:
 * - Default TTL: 1 hour (3600000ms) aligned with CONTENT_REVALIDATE_RATE
 * - Automatic invalidation on expiration
 * - Fallback to API calls when cache is empty or expired
 * 
 * Usage:
 * - Caches blog entries with pagination keys
 * - Caches all blog entries under 'all_blog_entries' key
 * - Reduces Contentful API usage by serving cached data when available
 */

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  expiresAt: number;
}

class BlogCache {
  private cache: Map<string, CacheEntry<unknown>>;
  private defaultTTL: number; // Time to live in milliseconds

  constructor(defaultTTL = 3600000) {
    // Default 1 hour
    this.cache = new Map();
    this.defaultTTL = defaultTTL;
  }

  set<T>(key: string, data: T, ttl?: number): void {
    const timestamp = Date.now();
    const expiresAt = timestamp + (ttl || this.defaultTTL);
    this.cache.set(key, { data, timestamp, expiresAt });
  }

  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) {
      return null;
    }

    // Check if cache entry is expired
    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return null;
    }

    return entry.data as T;
  }

  has(key: string): boolean {
    const entry = this.cache.get(key);
    if (!entry) {
      return false;
    }

    // Check if expired
    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return false;
    }

    return true;
  }

  invalidate(key: string): void {
    this.cache.delete(key);
  }

  invalidateAll(): void {
    this.cache.clear();
  }

  // Clean up expired entries
  cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now > entry.expiresAt) {
        this.cache.delete(key);
      }
    }
  }
}

// Singleton instance
const blogCache = new BlogCache();

// Periodic cleanup every 10 minutes
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    blogCache.cleanup();
  }, 600000);
}

export default blogCache;
