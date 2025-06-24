import api from './api';

export const folderService = {
  getFolders: async () => {
    const response = await api.get('/folders');
    return response.data;
  },

  createFolder: async (folderData) => {
    const response = await api.post('/folders', folderData);
    return response.data;
  },

  updateFolder: async (folderId, folderData) => {
    const response = await api.put(`/folders/${folderId}`, folderData);
    return response.data;
  },

  deleteFolder: async (folderId) => {
    const response = await api.delete(`/folders/${folderId}`);
    return response.data;
  },

  getFolderPhotos: async (folderId) => {
    const response = await api.get(`/folders/${folderId}/photos`);
    return response.data;
  },
};