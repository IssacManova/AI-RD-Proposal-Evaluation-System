import api from './axios';
import type { NotificationsResponse } from '../types';

export const notificationsApi = {
  /** GET /notifications/my-notifications */
  getMyNotifications: async (): Promise<NotificationsResponse> => {
    const res = await api.get<NotificationsResponse>('/notifications/my-notifications');
    return res.data;
  },

  /** PUT /notifications/{id}/read */
  markAsRead: async (id: string): Promise<void> => {
    await api.put(`/notifications/${id}/read`);
  },

  /** PUT /notifications/mark-all-read */
  markAllAsRead: async (): Promise<void> => {
    await api.put('/notifications/mark-all-read');
  },
};
