import api from './api';

export const authService = {
  login: async (credentials) => {
    const response = await api.post('/token', credentials);
    return response.data;
  },

  register: async (userData) => {
    const response = await api.post('/users', userData);
    return response.data;
  },

  refreshToken: async (refreshToken) => {
    const response = await api.post('/token/refresh', {
      refresh: refreshToken,
    });
    return response.data;
  },

  getCurrentUser: async () => {
    const response = await api.get('/users');
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  },
};