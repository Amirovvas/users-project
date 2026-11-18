export interface User {
  id: number;
  name: string;
  email: string;
}

export interface Post {
  id: number;
  title: string;
  content: string;
  userId: number;
  user?: User;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: Array<{ field?: string; message: string }>;
}

export interface CreateUserInput {
  name: string;
  email: string;
}

export interface CreatePostInput {
  title: string;
  content: string;
  userId: number;
}
