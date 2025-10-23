const memory = new Map<string, { count: number; reset: number }>();

export function rateLimit(key: string, limit = 10, windowMs = 60_000) {
    const now = Date.now();
    const entry = memory.get(key);
    if (!entry || entry.reset < now) {
        memory.set(key, { count: 1, reset: now + windowMs });
        return { allowed: true };
    }
    if (entry.count >= limit) return { allowed: false };
    entry.count += 1;
    return { allowed: true };
}
