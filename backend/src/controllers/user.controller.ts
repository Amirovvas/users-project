import { RequestHandler } from 'express';
import { z } from 'zod';
import * as userService from '../services/user.service';

export const createUserSchema = z.object({
  name: z.string({ required_error: 'Name is required' }).trim().min(1, { message: 'Name cannot be empty' }),
  email: z.string({ required_error: 'Email is required' }).trim().email({ message: 'Invalid email address' }),
});

export const getUsers: RequestHandler = async (_req, res, next) => {
  try {
    const users = await userService.getAllUsers();
    res.status(200).json({
      success: true,
      data: users,
    });
  } catch (error) {
    next(error);
  }
};

export const createUser: RequestHandler = async (req, res, next) => {
  try {
    const validatedData = createUserSchema.parse(req.body);
    const user = await userService.createUser(validatedData);
    res.status(201).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};
