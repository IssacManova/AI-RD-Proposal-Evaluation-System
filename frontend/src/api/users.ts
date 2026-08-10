import api from './axios';
import type { User } from '../types';

export const usersApi = {
  /**
   * GET /users/
   * Admin: list all users.
   */
  getAllUsers: async (): Promise<User[]> => {
    const res = await api.get<{ users: User[] }>('/users/');
    return res.data.users;
  },

  /**
   * GET /users/:id
   * Admin: get a single user by ID.
   */
  getUser: async (id: string): Promise<User> => {
    const res = await api.get<User>(`/users/${id}`);
    return res.data;
  },

  /**
   * PATCH /users/:id
   * Admin: update a user's role or status.
   */
  updateUser: async (id: string, data: Partial<User>): Promise<{ message: string }> => {
    const res = await api.patch<{ message: string }>(`/users/${id}`, data);
    return res.data;
  },

  /**
   * DELETE /users/:id
   * Admin: delete a user.
   */
  deleteUser: async (id: string): Promise<{ message: string }> => {
    const res = await api.delete<{ message: string }>(`/users/${id}`);
    return res.data;
  },
};
