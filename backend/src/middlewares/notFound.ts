import { RequestHandler } from 'express';
import { ApiError } from '../errors/ApiError';

export const notFound: RequestHandler = (req, _res, next) => {
  next(ApiError.notFound(`Route ${req.method} ${req.originalUrl} not found`));
};
