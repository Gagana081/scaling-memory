import api from './api';

export const photoService = {
  uploadPhoto: async (folderId, formData) => {
    const response = await api.post(`/folders/${folderId}/photos`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  updatePhoto: async (folderId, photoId, photoData) => {
    const response = await api.put(`/folders/${folderId}/photos/${photoId}`, photoData);
    return response.data;
  },

  deletePhoto: async (folderId, photoId) => {
    const response = await api.delete(`/folders/${folderId}/photos/${photoId}`);
    return response.data;
  },

  toggleFavorite: async (photoId, isFavorite) => {
    // Note: You might need to implement this endpoint in your Django backend
    const response = await api.patch(`/photos/${photoId}`, {
      is_favorite: isFavorite,
    });
    return response.data;
  },

  getPhotoDetails: async (photoId) => {
    const response = await api.get(`/photos/${photoId}`);
    return response.data;
  },
};