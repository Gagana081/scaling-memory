import axios from 'axios';

const API_BASE_URL = 'http://98.70.209.206:8000'; // Update with your Django backend URL

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      const refreshToken = localStorage.getItem('refresh_token');
      if (refreshToken) {
        try {
          const response = await axios.post(`${API_BASE_URL}/token/refresh`, {
            refresh: refreshToken,
          });
          
          localStorage.setItem('access_token', response.data.access);
          originalRequest.headers.Authorization = `Bearer ${response.data.access}`;
          
          return api(originalRequest);
        } catch (refreshError) {
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          window.location.href = '/login';
        }
      }
    }
    
    return Promise.reject(error);
  }
);

// Auth API calls
export const authAPI = {
  login: (credentials) => api.post('/token', credentials),
  register: (userData) => api.post('/users', userData),
  getCurrentUser: () => api.get('/users'),
};

// Folders API calls
export const foldersAPI = {
  getFolders: () => api.get('/folders'),
  createFolder: (folderData) => api.post('/folders', folderData),
  deleteFolder: (folderId) => api.delete(`/folders/${folderId}`),
  getFolderPhotos: (folderId) => api.get(`/folders/${folderId}/photos`),
};

// Photos API calls
export const photosAPI = {
  uploadPhoto: (folderId, formData) => {
    return api.post(`/folders/${folderId}/photos`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  deletePhoto: (folderId, photoId) => api.delete(`/folders/${folderId}/photos/${photoId}`),
  getAllPhotos: () => api.get('/folders'),
  toggleFavorite: (photoId, isFavorite) => {
    // You might need to add this endpoint to your Django backend
    return api.patch(`/photos/${photoId}`, { is_favorite: isFavorite });
  },
};

export default api;
