const buckets = new Map();
export function rateLimit(key, limit = 5, windowMs = 60_000) {
  const now = Date.now();
  const arr = (buckets.get(key) || []).filter((t) => now - t < windowMs);
  arr.push(now);
  buckets.set(key, arr);
  return arr.length <= limit;
}