import prisma from '../config/prisma';
import { ApiError } from '../errors/ApiError';
import { User } from '@prisma/client';

export interface CreateUserInput {
  name: string;
  email: string;
}

export const getAllUsers = async (): Promise<User[]> => {
  return prisma.user.findMany({
    orderBy: { id: 'asc' },
  });
};

export const createUser = async (data: CreateUserInput): Promise<User> => {
  const existingUser = await prisma.user.findUnique({
    where: { email: data.email },
  });

  if (existingUser) {
    throw ApiError.conflict(`User with email '${data.email}' already exists`);
  }

  return prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
    },
  });
};

export const getUserById = async (id: number): Promise<User | null> => {
  return prisma.user.findUnique({
    where: { id },
  });
};
