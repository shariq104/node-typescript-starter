import { Response } from 'express';
import { ApiResponse, PaginationMeta } from '@/types';

// Success response helper
export const sendSuccess = <T>(
  res: Response,
  data: T,
  message: string = 'Success',
  statusCode: number = 200
): void => {
  const response: ApiResponse<T> = {
    success: true,
    message,
    data,
  };
  
  res.status(statusCode).json(response);
};

// Error response helper
export const sendError = (
  res: Response,
  message: string = 'Internal Server Error',
  statusCode: number = 500,
  error?: string
): void => {
  const response: ApiResponse = {
    success: false,
    message,
    error,
  };
  
  res.status(statusCode).json(response);
};

// Paginated response helper
export const sendPaginatedResponse = <T>(
  res: Response,
  data: T[],
  pagination: PaginationMeta,
  message: string = 'Success'
): void => {
  const response: ApiResponse<T[]> = {
    success: true,
    message,
    data,
    pagination,
  };
  
  res.status(200).json(response);
};

// Created response helper
export const sendCreated = <T>(
  res: Response,
  data: T,
  message: string = 'Resource created successfully'
): void => {
  sendSuccess(res, data, message, 201);
};

// Updated response helper
export const sendUpdated = <T>(
  res: Response,
  data: T,
  message: string = 'Resource updated successfully'
): void => {
  sendSuccess(res, data, message, 200);
};

// Deleted response helper
export const sendDeleted = (
  res: Response,
  message: string = 'Resource deleted successfully'
): void => {
  sendSuccess(res, null, message, 200);
};

// No content response helper
export const sendNoContent = (res: Response): void => {
  res.status(204).send();
};
