import { Router } from 'express';
import userRoutes from './user.routes';
import postRoutes from './post.routes';

const router = Router();

// Health check endpoint
router.get('/health', (_req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
  });
});

// Resource routes
router.use('/users', userRoutes);
router.use('/posts', postRoutes);

export default router;
