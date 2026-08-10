import api from './axios';
import type { LoginRequest, LoginResponse, RegisterRequest, RegisterResponse } from '../types';

export const authApi = {
  /** POST /auth/login */
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    const res = await api.post<LoginResponse>('/auth/login', data);
    return res.data;
  },

  /** POST /auth/register */
  register: async (data: RegisterRequest): Promise<RegisterResponse> => {
    const res = await api.post<RegisterResponse>('/auth/register', data);
    return res.data;
  },
};
