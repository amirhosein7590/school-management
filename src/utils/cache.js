import redis from "@/lib/redis";

export class CacheService {
  constructor(prefix = "app:", defaultTTL = 3600) {
    this.prefix = prefix;
    this.defaultTTL = defaultTTL;
  }

  createKey(key) {
    return `${this.prefix}${key}`;
  }

  async set(key, value, ttl = null) {
    try {
      const cacheKey = this.createKey(key);
      const ttlToUse = ttl || this.defaultTTL;

      if (ttlToUse > 0) {
        await redis.setex(cacheKey, ttlToUse, JSON.stringify(value));
      } else {
        await redis.set(cacheKey, JSON.stringify(value));
      }

      return true;
    } catch (error) {
      console.error("Redis set error:", error);
      return false;
    }
  }

  async get(key) {
    try {
      const cacheKey = this.createKey(key);
      const data = await redis.get(cacheKey);

      if (!data) return null;

      return JSON.parse(data);
    } catch (error) {
      console.error("Redis get error:", error);
      return null;
    }
  }

  async del(key) {
    try {
      const cacheKey = this.createKey(key);
      await redis.del(cacheKey);
      return true;
    } catch (error) {
      console.error("Redis delete error:", error);
      return false;
    }
  }

  async delPattern(pattern) {
    try {
      const keys = await redis.keys(this.createKey(pattern));
      if (keys.length > 0) {
        await redis.del(...keys);
      }
      return true;
    } catch (error) {
      console.error("Redis delete pattern error:", error);
      return false;
    }
  }

  async ping() {
    try {
      return await redis.ping();
    } catch (error) {
      console.error("Redis ping error:", error);
      return null;
    }
  }
}

export const cache = new CacheService("user:");
