interface CacheEntry<T> {
  data: T;
  expiresAt: number;
}

class InMemoryCache {
  private cache: Map<string, CacheEntry<unknown>> = new Map();
  private defaultTTL: number;

  constructor(defaultTTLSeconds: number = 60) {
    this.defaultTTL = defaultTTLSeconds * 1000;
  }

  get<T>(key: string): T | null {
    const entry = this.cache.get(key) as CacheEntry<T> | undefined;

    if (!entry) {
      return null;
    }

    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return null;
    }

    return entry.data;
  }

  set<T>(key: string, data: T, ttlSeconds?: number): void {
    const ttl = ttlSeconds ? ttlSeconds * 1000 : this.defaultTTL;
    this.cache.set(key, {
      data,
      expiresAt: Date.now() + ttl,
    });
  }

  delete(key: string): boolean {
    return this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  has(key: string): boolean {
    const entry = this.cache.get(key);
    if (!entry) return false;
    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return false;
    }
    return true;
  }

  size(): number {
    return this.cache.size;
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

// Cache for Rick and Morty API responses (60 seconds TTL)
export const apiCache = new InMemoryCache(60);

// Start cleanup interval (every 5 minutes)
setInterval(() => {
  apiCache.cleanup();
}, 5 * 60 * 1000);

export { InMemoryCache };
