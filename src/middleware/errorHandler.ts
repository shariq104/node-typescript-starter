import { Request, Response, NextFunction } from 'express';
import { logger } from '@/utils/logger';
import { AppError, isOperationalError } from '@/utils/errors';
import { sendError } from '@/utils/response';

export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  let statusCode = 500;
  let message = 'Internal Server Error';
  let errorDetails: string | undefined;

  // Handle known operational errors
  if (error instanceof AppError) {
    statusCode = error.statusCode;
    message = error.message;
  } else if (error.name === 'ValidationError') {
    statusCode = 400;
    message = 'Validation Error';
    errorDetails = error.message;
  } else if (error.name === 'CastError') {
    statusCode = 400;
    message = 'Invalid ID format';
  } else if (error.name === 'MongoError' && (error as any).code === 11000) {
    statusCode = 409;
    message = 'Duplicate field value';
  } else if (error.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid token';
  } else if (error.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token expired';
  }

  // Log error
  if (isOperationalError(error)) {
    logger.warn('Operational Error:', {
      message: error.message,
      statusCode,
      stack: error.stack,
      url: req.url,
      method: req.method,
      ip: req.ip,
    });
  } else {
    logger.error('Programming Error:', {
      message: error.message,
      stack: error.stack,
      url: req.url,
      method: req.method,
      ip: req.ip,
    });
  }

  // Send error response
  sendError(res, message, statusCode, errorDetails);
};
