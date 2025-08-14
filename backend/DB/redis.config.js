import ExpressRedisCache from "express-redis-cache";

// Create Redis cache instance with proper configuration
const redisCache = ExpressRedisCache({
  port: 6379,
  host: "localhost",
  prefix: "master_backend",
  expire: {
    200: 60 * 60, // Cache successful responses for 1 hour
    4: 60,        // Cache 4xx errors for 1 minute  
    5: 30         // Cache 5xx errors for 30 seconds
  },
  // Add these options for better stability
  auth_pass: process.env.REDIS_PASSWORD || null,
  db: 0,
  options: {
    // Add retry strategy
    retry_strategy: (options) => {
      if (options.error && options.error.code === 'ECONNREFUSED') {
        console.error('Redis server connection refused');
        return new Error('Redis server connection refused');
      }
      if (options.total_retry_time > 1000 * 60 * 60) {
        console.error('Redis retry time exhausted');
        return new Error('Retry time exhausted');
      }
      if (options.attempt > 10) {
        console.error('Redis max retry attempts reached');
        return undefined;
      }
      return Math.min(options.attempt * 100, 3000);
    }
  }
});

// Add error handling
redisCache.on('error', (err) => {
  console.error('Redis Cache Error:', err.message);
});

redisCache.on('connected', () => {
  console.log('Redis Cache connected successfully');
});

redisCache.on('disconnected', () => {
  console.log('Redis Cache disconnected');
});

export default redisCache;