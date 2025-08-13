// config/ratelimiter.js
import rateLimit from 'express-rate-limit';

// Main API rate limiter
export const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    error: "Too many requests from this IP, please try again later."
  },
  standardHeaders: true,
  legacyHeaders: false,
  // Skip rate limiting for static files
  skip: (req, res) => {
    // Don't rate limit static files (documents, images, etc.)
    const staticPaths = ['/documents', '/images', '/css', '/js', '/favicon.ico'];
    return staticPaths.some(path => req.url.startsWith(path));
  }
});

// Stricter limiter for auth routes
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 auth attempts per windowMs
  message: {
    error: "Too many authentication attempts, please try again later."
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// File upload limiter
export const uploadLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // limit each IP to 10 uploads per minute
  message: {
    error: "Too many file uploads, please try again later."
  },
  standardHeaders: true,
  legacyHeaders: false,
});