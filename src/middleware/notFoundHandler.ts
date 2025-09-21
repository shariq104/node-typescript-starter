import { Request, Response, NextFunction } from 'express';
import { sendError } from '@/utils/response';

export const notFoundHandler = (req: Request, res: Response, next: NextFunction): void => {
  sendError(res, `Route ${req.originalUrl} not found`, 404);
};
