import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger.js';

export interface ApiError extends Error {
  status?: number;
  errors?: Record<string, string[]>;
}

export function errorHandler(
  err: ApiError,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';

  logger.error({
    status,
    message,
    stack: err.stack,
  });

  res.status(status).json({
    error: {
      message,
      status,
      ...(err.errors && { errors: err.errors }),
    },
  });
}

export function createError(message: string, status: number = 500): ApiError {
  const error = new Error(message) as ApiError;
  error.status = status;
  return error;
}

export function notFoundHandler(_req: Request, res: Response): void {
  res.status(404).json({
    error: {
      message: 'Route not found',
      status: 404,
    },
  });
}
