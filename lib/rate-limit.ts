import rateLimit from "express-rate-limit";
import { NextApiRequest, NextApiResponse } from "next";

export const rateLimiter = (options: {
  windowMs?: number;
  max?: number;
  message?: string;
}) => {
  const limiter = rateLimit({
    windowMs: options.windowMs || 15 * 60 * 1000, // 15 minutes by default
    max: options.max || 100, // Limit each IP to 100 requests per windowMs
    message: options.message || "Too many requests, please try again later",
    standardHeaders: true,
    legacyHeaders: false,
  });

  return (req: NextApiRequest, res: NextApiResponse) =>
    new Promise((resolve, reject) => {
      // Only apply the rate limiter in production
      if (process.env.NODE_ENV === "production") {
        limiter(req, res, (result: any) => {
          if (result instanceof Error) {
            return reject(result);
          }
          return resolve(result);
        });
      } else {
        // In non-production environments, bypass the rate limiter
        return resolve(true); // Resolve immediately, effectively skipping the limit
      }
    });
};

// Pre-configured limiters for different operations
export const uploadLimiter = rateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // 50 uploads per 15 minutes
  message: "Too many upload attempts, please try again in 15 minutes",
});

export const downloadLimiter = rateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 downloads per 15 minutes
  message: "Too many download attempts, please try again in 15 minutes",
});

export const chunkLimiter = rateLimiter({
  windowMs: 60 * 1000, // 1 minute
  max: 200, // 200 chunk operations per minute
  message: "Too many chunk operations, please try again in 1 minute",
});
