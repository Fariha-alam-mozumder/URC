import rateLimit from 'express-rate-limit';


export const limiter = rateLimit({
  windowMs: 150 * 60 * 1000, 
  max: 1000,
  message: {
    error: "Too many requests from this IP, please try again later."
  },
  standardHeaders: true,
  legacyHeaders: false,
  
  skip: (req, res) => {

    const staticPaths = ['/documents', '/images', '/css', '/js', '/favicon.ico'];
    return staticPaths.some(path => req.url.startsWith(path));
  }
});

// Stricter limiter for auth routes
export const authLimiter = rateLimit({
  windowMs: 150 * 60 * 1000, 
  max: 50, 
  message: {
    error: "Too many authentication attempts, please try again later."
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// File upload limiter
export const uploadLimiter = rateLimit({
  windowMs: 600 * 1000, 
  max: 100, 
  message: {
    error: "Too many file uploads, please try again later."
  },
  standardHeaders: true,
  legacyHeaders: false,
});
