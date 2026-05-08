/**
 * Request deduplication cache
 * Prevents multiple simultaneous requests for the same data
 */
class RequestCache {
  constructor() {
    // Map of request key -> Promise
    this.activeRequests = new Map();
    // Map of request key -> { data, timestamp }
    this.cachedData = new Map();
    this.cacheExpiry = 30 * 1000; // 30 seconds default
  }

  /**
   * Generate a cache key from endpoint and parameters
   */
  generateKey(endpoint, params = {}) {
    const paramStr = Object.entries(params)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([k, v]) => `${k}=${JSON.stringify(v)}`)
      .join('&');
    return `${endpoint}:${paramStr}`;
  }

  /**
   * Execute a request with deduplication
   * If the same request is already in flight, return that promise
   * If request is cached and fresh, return cached data
   * Otherwise execute the request
   */
  async execute(endpoint, executor, params = {}, cacheExpiry = this.cacheExpiry) {
    const key = this.generateKey(endpoint, params);

    // Check if we have an active request for this key
    if (this.activeRequests.has(key)) {
      console.log(`[RequestCache] Reusing active request for: ${key}`);
      return this.activeRequests.get(key);
    }

    // Check if we have fresh cached data
    const cached = this.cachedData.get(key);
    if (cached && Date.now() - cached.timestamp < cacheExpiry) {
      console.log(`[RequestCache] Returning cached data for: ${key}`);
      return cached.data;
    }

    // Create the request promise
    console.log(`[RequestCache] Executing new request for: ${key}`);
    const requestPromise = executor()
      .then((data) => {
        // Cache the successful result
        this.cachedData.set(key, {
          data,
          timestamp: Date.now(),
        });
        return data;
      })
      .catch((error) => {
        // On error, don't cache - allow retry
        throw error;
      })
      .finally(() => {
        // Remove from active requests
        this.activeRequests.delete(key);
      });

    // Store the active request
    this.activeRequests.set(key, requestPromise);

    return requestPromise;
  }

  /**
   * Manually invalidate cache for a specific endpoint
   */
  invalidate(endpoint, params = {}) {
    const key = this.generateKey(endpoint, params);
    console.log(`[RequestCache] Invalidating cache for: ${key}`);
    this.cachedData.delete(key);
  }

  /**
   * Invalidate all cache entries matching a pattern
   */
  invalidatePattern(pattern) {
    const regex = new RegExp(pattern);
    let count = 0;
    for (const key of this.cachedData.keys()) {
      if (regex.test(key)) {
        this.cachedData.delete(key);
        count++;
      }
    }
    console.log(`[RequestCache] Invalidated ${count} cache entries matching pattern: ${pattern}`);
  }

  /**
   * Clear all cache
   */
  clearAll() {
    console.log(`[RequestCache] Clearing all cache (${this.cachedData.size} entries)`);
    this.cachedData.clear();
  }

  /**
   * Get cache statistics
   */
  getStats() {
    return {
      activeRequests: this.activeRequests.size,
      cachedEntries: this.cachedData.size,
    };
  }
}

// Export singleton instance
export const requestCache = new RequestCache();
