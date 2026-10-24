
interface Options {
    interval?: number; // ms
    uniqueTokenPerInterval?: number; // max keys
}

export default function rateLimit(options?: Options) {
    const interval = options?.interval || 60000;
    const maxKeys = options?.uniqueTokenPerInterval || 500;

    const tokenCache = new Map<string, number[]>();

    // Clear cache periodically to prevent memory leaks
    // This is a simple implementation, a real LRU is better but this works for basic protection.
    // In serverless, this cache is ephemeral anyway.

    return {
        check: (limit: number, token: string) => new Promise<void>((resolve, reject) => {
            const now = Date.now();
            const tokenCount = tokenCache.get(token) || [0, now];

            // Allow resetting if interval passed
            if (now - tokenCount[1] > interval) {
                tokenCount[0] = 0;
                tokenCount[1] = now;
            }

            tokenCount[0] += 1;
            tokenCache.set(token, tokenCount);

            // Clean up if too big (naive strategy: clear all if over limits)
            if (tokenCache.size > maxKeys) {
                tokenCache.clear();
            }

            const currentUsage = tokenCount[0];
            const isRateLimited = currentUsage > limit;

            if (isRateLimited) {
                reject();
            } else {
                resolve();
            }
        })
    };
}
