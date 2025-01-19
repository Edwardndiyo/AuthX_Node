const Redis = require('ioredis');

let redis;
let useMockRedis = true;

// Initialize Redis client if Redis is available
if (process.env.REDIS_HOST || process.env.REDIS_URL) {
    useMockRedis = false;
    redis = new Redis({
        host: process.env.REDIS_HOST || '127.0.0.1',
        port: process.env.REDIS_PORT || 6379,
        password: process.env.REDIS_PASSWORD || '',
    });
} else {
    console.warn('No Redis environment detected. Using mock Redis.');
}

// Mock Redis fallback
const redisMock = new Map();

// Revoke a token
async function revokeToken(jti) {
    if (useMockRedis) {
        redisMock.set(jti, 'revoked');
        setTimeout(() => redisMock.delete(jti), 3600 * 1000);
    } else {
        await redis.set(jti, 'revoked', 'EX', 3600);
    }
}

// Check if a token is revoked
async function isTokenRevoked(jti) {
    if (useMockRedis) {
        return redisMock.has(jti);
    } else {
        const result = await redis.get(jti);
        return result === 'revoked';
    }
}

// Graceful shutdown
if (!useMockRedis) {
    process.on('SIGINT', () => {
        redis.quit();
    });
}

module.exports = { revokeToken, isTokenRevoked };
