const DEFAULT_WINDOW_MS = 15 * 60 * 1000;
const DEFAULT_MAX_ATTEMPTS = 5;
export const MAX_UPLOAD_BYTES = 4 * 1024 * 1024;

/** @typedef {{ allowed: boolean, remaining: number, retryAfterMs: number }} RateLimitResult */

export function normalizeHttpUrl(value) {
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  if (!trimmed) return null;

  let url;
  try {
    url = new URL(trimmed);
  } catch {
    return null;
  }

  if (url.protocol !== 'http:' && url.protocol !== 'https:') {
    return null;
  }

  return url.toString();
}

export function normalizeMediaUrl(value) {
  if (typeof value !== 'string') return '';
  const trimmed = value.trim();
  if (!trimmed) return '';
  if (trimmed.startsWith('/')) return trimmed;
  return normalizeHttpUrl(trimmed) ?? '';
}

export function createRateLimiter(now = () => Date.now()) {
  /** @type {Map<string, { count: number, resetAt: number }>} */
  const buckets = new Map();

  return {
    check(key, maxAttempts = DEFAULT_MAX_ATTEMPTS, windowMs = DEFAULT_WINDOW_MS) {
      const currentTime = now();
      const current = buckets.get(key);

      if (!current || current.resetAt <= currentTime) {
        buckets.set(key, { count: 1, resetAt: currentTime + windowMs });
        return { allowed: true, remaining: maxAttempts - 1, retryAfterMs: 0 };
      }

      if (current.count >= maxAttempts) {
        return {
          allowed: false,
          remaining: 0,
          retryAfterMs: Math.max(0, current.resetAt - currentTime),
        };
      }

      current.count += 1;
      buckets.set(key, current);
      return {
        allowed: true,
        remaining: Math.max(0, maxAttempts - current.count),
        retryAfterMs: 0,
      };
    },
    reset(key) {
      buckets.delete(key);
    },
  };
}

export const rateLimiter = createRateLimiter();

export function getClientIp(source) {
  const get = typeof source?.get === 'function'
    ? (name) => source.get(name)
    : (name) => source?.[name] ?? null;

  const forwarded = get('x-forwarded-for');
  if (typeof forwarded === 'string' && forwarded.trim()) {
    return forwarded.split(',')[0].trim();
  }

  const realIp = get('x-real-ip');
  if (typeof realIp === 'string' && realIp.trim()) {
    return realIp.trim();
  }

  return 'unknown';
}

export function detectImageType(bytes) {
  if (!bytes || bytes.length < 12) return null;

  if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) {
    return { mime: 'image/jpeg', ext: 'jpg' };
  }

  if (
    bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47 &&
    bytes[4] === 0x0d && bytes[5] === 0x0a && bytes[6] === 0x1a && bytes[7] === 0x0a
  ) {
    return { mime: 'image/png', ext: 'png' };
  }

  if (
    bytes[0] === 0x47 && bytes[1] === 0x49 && bytes[2] === 0x46 && bytes[3] === 0x38
  ) {
    return { mime: 'image/gif', ext: 'gif' };
  }

  if (
    bytes[0] === 0x52 && bytes[1] === 0x49 && bytes[2] === 0x46 && bytes[3] === 0x46 &&
    bytes[8] === 0x57 && bytes[9] === 0x45 && bytes[10] === 0x42 && bytes[11] === 0x50
  ) {
    return { mime: 'image/webp', ext: 'webp' };
  }

  return null;
}

export function validateImageUpload(file) {
  if (!file) {
    return { ok: false, error: 'No file provided' };
  }

  if (file.byteLength > MAX_UPLOAD_BYTES) {
    return { ok: false, error: 'File too large' };
  }

  const detected = detectImageType(file.bytes);
  if (!detected) {
    return { ok: false, error: 'Invalid file type' };
  }

  return { ok: true, ...detected };
}
