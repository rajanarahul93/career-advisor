interface CachedResponse {
  question: string;
  response: string;
  timestamp: Date;
  hits: number;
}

export class AICacheService {
  private static CACHE_KEY = "ai_response_cache";
  private static MAX_CACHE_SIZE = 100;
  private static CACHE_EXPIRY_HOURS = 24;

  static getCachedResponse(prompt: string): string | null {
    const cache = this.getCache();
    const cached = cache.find(
      (item) =>
        this.normalizePrompt(item.question) === this.normalizePrompt(prompt)
    );

    if (cached && this.isValid(cached)) {
      cached.hits++;
      this.saveCache(cache);
      return cached.response;
    }

    return null;
  }

  static cacheResponse(prompt: string, response: string) {
    const cache = this.getCache();

    // Remove existing cache for same prompt
    const filtered = cache.filter(
      (item) =>
        this.normalizePrompt(item.question) !== this.normalizePrompt(prompt)
    );

    // Add new cached response
    filtered.unshift({
      question: prompt,
      response,
      timestamp: new Date(),
      hits: 1,
    });

    // Maintain cache size limit
    const trimmed = filtered.slice(0, this.MAX_CACHE_SIZE);
    this.saveCache(trimmed);
  }

  private static normalizePrompt(prompt: string): string {
    return prompt.toLowerCase().trim().replace(/\s+/g, " ");
  }

  private static isValid(cached: CachedResponse): boolean {
    const hoursSinceCache =
      (Date.now() - new Date(cached.timestamp).getTime()) / (1000 * 60 * 60);
    return hoursSinceCache < this.CACHE_EXPIRY_HOURS;
  }

  private static getCache(): CachedResponse[] {
    const stored = localStorage.getItem(this.CACHE_KEY);
    return stored ? JSON.parse(stored) : [];
  }

  private static saveCache(cache: CachedResponse[]) {
    localStorage.setItem(this.CACHE_KEY, JSON.stringify(cache));
  }

  static getCacheStats() {
    const cache = this.getCache();
    const totalHits = cache.reduce((sum, item) => sum + item.hits, 0);
    return {
      totalCached: cache.length,
      totalHits,
      cacheHitRate:
        cache.length > 0
          ? (((totalHits - cache.length) / totalHits) * 100).toFixed(1) + "%"
          : "0%",
    };
  }
}