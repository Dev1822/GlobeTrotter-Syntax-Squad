import apiClient from './client';
export const adminApi = {
  getStats: () => apiClient.get('/admin/stats'),
  getUsers: () => apiClient.get('/admin/users'),
};
