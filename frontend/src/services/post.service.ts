import api from './api';
import { ApiResponse, CreatePostInput, Post } from '../types';

export const getPosts = async (): Promise<Post[]> => {
  const response = await api.get<ApiResponse<Post[]>>('/posts');
  return response.data.data ?? [];
};

export const createPost = async (data: CreatePostInput): Promise<Post> => {
  const response = await api.post<ApiResponse<Post>>('/posts', data);
  if (!response.data.data) {
    throw new Error(response.data.message || 'Failed to create post');
  }
  return response.data.data;
};
