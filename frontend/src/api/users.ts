import api from './axios';
import type { User } from '../types';

export const usersApi = {
  /**
   * GET /users/me  (NOT YET IMPLEMENTED IN BACKEND)
   * Returns the currently authenticated user's full profile.
   */
  getMe: async (): Promise<User> => {
    const res = await api.get<User>('/users/me');
    return res.data;
  },

  /**
   * GET /users/  (NOT YET IMPLEMENTED IN BACKEND)
   * Admin: list all users.
   */
  getAllUsers: async (): Promise<User[]> => {
    const res = await api.get<{ users: User[] }>('/users/');
    return res.data.users;
  },

  /**
   * PATCH /users/:id  (NOT YET IMPLEMENTED IN BACKEND)
   * Admin: update a user's role or status.
   */
  updateUser: async (id: string, data: Partial<User>): Promise<{ message: string }> => {
    const res = await api.patch<{ message: string }>(`/users/${id}`, data);
    return res.data;
  },
};
