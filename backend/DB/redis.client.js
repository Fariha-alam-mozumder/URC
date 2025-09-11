// backend/DB/redis.client.js
import Redis from 'ioredis';

const redis = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: Number(process.env.REDIS_PORT || 6379),
  password: process.env.REDIS_PASSWORD || undefined,
  db: Number(process.env.REDIS_DB || 0),
  retryStrategy(times) {
    return Math.min(times * 100, 3000);
  },
});

redis.on('error', (e) => console.error('Redis client error:', e?.message));
redis.on('connect', () => console.log('Redis client connected'));

export default redis;
