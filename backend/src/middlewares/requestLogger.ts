import { Request, Response, NextFunction } from 'express';
import { randomUUID } from 'crypto';
import { logger } from '../utils/logger.js';

declare global {
  namespace Express {
    interface Request {
      requestId: string;
    }
  }
}

export function requestLogger(req: Request, res: Response, next: NextFunction): void {
  const requestId = randomUUID();
  req.requestId = requestId;

  const startTime = Date.now();

  // Log request
  logger.info({
    type: 'request',
    requestId,
    method: req.method,
    url: req.url,
    query: req.query,
  });

  // Log response on finish
  res.on('finish', () => {
    const duration = Date.now() - startTime;
    logger.info({
      type: 'response',
      requestId,
      method: req.method,
      url: req.url,
      status: res.statusCode,
      duration: `${duration}ms`,
    });
  });

  next();
}
