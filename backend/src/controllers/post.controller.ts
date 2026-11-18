import { RequestHandler } from 'express';
import { z } from 'zod';
import * as postService from '../services/post.service';

export const createPostSchema = z.object({
  title: z
    .string({ required_error: 'Title is required' })
    .trim()
    .min(1, { message: 'Title cannot be empty' }),
  content: z
    .string({ required_error: 'Content is required' })
    .trim()
    .min(1, { message: 'Content cannot be empty' }),
  userId: z
    .number({ required_error: 'userId is required' })
    .int({ message: 'userId must be an integer' })
    .positive({ message: 'userId must be positive' }),
});

export const getPosts: RequestHandler = async (_req, res, next) => {
  try {
    const posts = await postService.getAllPosts();
    res.status(200).json({
      success: true,
      data: posts,
    });
  } catch (error) {
    next(error);
  }
};

export const createPost: RequestHandler = async (req, res, next) => {
  try {
    const validatedData = createPostSchema.parse(req.body);
    const post = await postService.createPost(validatedData);
    res.status(201).json({
      success: true,
      data: post,
    });
  } catch (error) {
    next(error);
  }
};
