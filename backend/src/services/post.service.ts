import prisma from '../config/prisma';
import { ApiError } from '../errors/ApiError';
import { Post, User } from '@prisma/client';

export interface CreatePostInput {
  title: string;
  content: string;
  userId: number;
}

export type PostWithUser = Post & {
  user: User | null;
};

export const getAllPosts = async (): Promise<PostWithUser[]> => {
  return prisma.post.findMany({
    include: {
      user: true,
    },
    orderBy: { id: 'asc' },
  });
};

export const createPost = async (data: CreatePostInput): Promise<Post> => {
  const existingUser = await prisma.user.findUnique({
    where: { id: data.userId },
  });

  if (!existingUser) {
    throw ApiError.notFound(`User with id ${data.userId} does not exist`);
  }

  return prisma.post.create({
    data: {
      title: data.title,
      content: data.content,
      userId: data.userId,
    },
  });
};
