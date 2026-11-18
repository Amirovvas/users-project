import { ErrorRequestHandler } from 'express';
import { ZodError } from 'zod';
import { Prisma } from '@prisma/client';
import { ApiError } from '../errors/ApiError';

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next): void => {
  const isProduction = process.env.NODE_ENV === 'production';

  // 1. ApiError
  if (err instanceof ApiError) {
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
      errors: err.errors ?? [],
    });
    return;
  }

  // 2. Zod validation error
  if (err instanceof ZodError) {
    const formattedErrors = err.issues.map((issue) => ({
      field: issue.path.join('.'),
      message: issue.message,
    }));

    res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: formattedErrors,
    });
    return;
  }

  // 3. Prisma Known Request Errors
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    switch (err.code) {
      case 'P2002': {
        const target = Array.isArray(err.meta?.target)
          ? err.meta.target.join(', ')
          : String(err.meta?.target || 'field');
        res.status(409).json({
          success: false,
          message: `A record with this ${target} already exists`,
          errors: [],
        });
        return;
      }
      case 'P2025': {
        res.status(404).json({
          success: false,
          message: 'Requested record was not found',
          errors: [],
        });
        return;
      }
      case 'P2003': {
        res.status(400).json({
          success: false,
          message: 'Foreign key constraint violation',
          errors: [],
        });
        return;
      }
      default: {
        res.status(400).json({
          success: false,
          message: isProduction ? 'Database operation failed' : err.message,
          errors: [],
        });
        return;
      }
    }
  }

  // 4. Prisma Validation Error
  if (err instanceof Prisma.PrismaClientValidationError) {
    res.status(400).json({
      success: false,
      message: isProduction ? 'Invalid database query parameters' : err.message,
      errors: [],
    });
    return;
  }

  // 5. Unknown Server Error
  const message = isProduction ? 'Internal server error' : err.message || 'Internal server error';

  res.status(500).json({
    success: false,
    message,
    errors: [],
  });
};
