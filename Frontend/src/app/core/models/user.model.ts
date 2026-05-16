export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  isConfirm: boolean;
  isDeleted: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthResponse {
  success: boolean;
  token: string;
  data: User;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  results?: number;
  count?: number;
  limit?: number;
  page?: number;
}
