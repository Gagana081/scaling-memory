import { useState, useEffect, useCallback } from 'react';
import { photosAPI, foldersAPI } from '../services/api';
import { handleError } from '../utils/helpers';

export const usePhotos = (folderId) => {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchPhotos = useCallback(async () => {
    if (!folderId) return;
    
    setLoading(true);
    setError(null);
    try {
      const response = await foldersAPI.getFolderPhotos(folderId);
      setPhotos(response.data);
    } catch (err) {
      setError(handleError(err));
    } finally {
      setLoading(false);
    }
  }, [folderId]);

  const uploadPhoto = async (file, filename) => {
    try {
      const formData = new FormData();
      formData.append('image', file);
      formData.append('filename', filename || file.name);
      
      const response = await photosAPI.uploadPhoto(folderId, formData);
      setPhotos(prev => [...prev, response.data]);
      return { success: true, data: response.data };
    } catch (err) {
      const error = handleError(err);
      setError(error);
      return { success: false, error };
    }
  };

  const deletePhoto = async (photoId) => {
    try {
      await photosAPI.deletePhoto(folderId, photoId);
      setPhotos(prev => prev.filter(photo => photo.id !== photoId));
      return { success: true };
    } catch (err) {
      const error = handleError(err);
      setError(error);
      return { success: false, error };
    }
  };

  const toggleFavorite = async (photoId, isFavorite) => {
    try {
      await photosAPI.toggleFavorite(photoId, isFavorite);
      setPhotos(prev => prev.map(photo => 
        photo.id === photoId ? { ...photo, is_favorite: isFavorite } : photo
      ));
      return { success: true };
    } catch (err) {
      const error = handleError(err);
      setError(error);
      return { success: false, error };
    }
  };

  useEffect(() => {
    fetchPhotos();
  }, [fetchPhotos]);

  return {
    photos,
    loading,
    error,
    fetchPhotos,
    uploadPhoto,
    deletePhoto,
    toggleFavorite,
    setError,
  };
};