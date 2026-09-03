import rateLimit from 'express-rate-limit';


/**
 *
 * Global rate limiter middleware.
 */

const globalRateLimiter = rateLimit({
  windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS),

  max: Number(process.env.RATE_LIMIT_MAX),

  standardHeaders: true,

  legacyHeaders: false,

  skip: (req) =>
    (
      req.method === 'PUT' &&
      /^\/v1\/api\/files\/[^/]+\/[^/]+\/[^/]+$/.test(req.originalUrl)
    ) ||
    (
      req.method === 'GET' &&
      /^\/v1\/api\/files\/[^/]+\/status$/.test(req.originalUrl)
    ),

  message: {
    message:"Too many request",
  },
});

export default globalRateLimiter;
