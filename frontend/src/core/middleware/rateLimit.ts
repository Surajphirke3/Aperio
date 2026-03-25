const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

interface RateLimitOptions {
  windowMs?: number;
  maxRequests?: number;
}

export function checkRateLimit(
  key: string,
  options: RateLimitOptions = {},
): { allowed: boolean; remaining: number } {
  const { windowMs = 60_000, maxRequests = 30 } = options;
  const now = Date.now();
  const entry = rateLimitMap.get(key);

  if (!entry || now > entry.resetTime) {
    rateLimitMap.set(key, { count: 1, resetTime: now + windowMs });
    return { allowed: true, remaining: maxRequests - 1 };
  }

  if (entry.count >= maxRequests) {
    return { allowed: false, remaining: 0 };
  }

  entry.count += 1;
  return { allowed: true, remaining: maxRequests - entry.count };
}
