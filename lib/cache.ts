import NodeCache from 'node-cache';

const cache = new NodeCache({ stdTTL: 600 }); // Cache for 10 minutes by default

export function getFromCache<T>(key: string): T | undefined {
  return cache.get(key);
}

export function setInCache<T>(key: string, value: T, ttl?: number): void {
  if (ttl !== undefined) {
    cache.set(key, value, ttl);
  } else {
    cache.set(key, value);
  }
}

export function invalidateCache(key: string): void {
  cache.del(key);
}