

import { AppError } from './app-error.js';

import type { ErrorRequestHandler } from 'express';

/**
 * Global error handling middleware.
 *
 *
 * @param err - The error thrown by the application.
 * @param req - Express request object.
 * @param res - Express response object.
 * @param next - Express next middleware function.
 * @returns A JSON response containing the error message.
 */
const globalErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
  void next;


  const error = err instanceof Error
    ? err
    : new Error('Unknown error');

  if (err instanceof AppError) {
    return res.status(400).json({
      message: err.message,
    });

  
  }


  return res.status(500).json({
    message: error.message,
  });
};

export default globalErrorHandler;
