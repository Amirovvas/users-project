import api from './api';
import { ApiResponse, CreateUserInput, User } from '../types';

export const getUsers = async (): Promise<User[]> => {
  const response = await api.get<ApiResponse<User[]>>('/users');
  return response.data.data ?? [];
};

export const createUser = async (data: CreateUserInput): Promise<User> => {
  const response = await api.post<ApiResponse<User>>('/users', data);
  if (!response.data.data) {
    throw new Error(response.data.message || 'Failed to create user');
  }
  return response.data.data;
};
