import 'express';

declare global {
  namespace Express {
    // Custom properties on Express Request can be added here
    interface Request {
      // Extended request properties if needed in future
    }
  }
}
