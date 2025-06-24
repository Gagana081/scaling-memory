import React, { createContext, useContext, useState, useCallback } from 'react';
import { foldersAPI, photosAPI } from '../services/api';
import { handleError } from '../utils/helpers';

const PhotoContext = createContext();

export const usePhotos = () => {
  const context = useContext(PhotoContext);
  if (!context) {
    throw new Error('usePhotos must be used within a PhotoProvider');
  }
  return context;
};

export const PhotoProvider = ({ children }) => {
  const [folders, setFolders] = useState([]);
  const [currentFolder, setCurrentFolder] = useState(null);
  const [allPhotos, setAllPhotos] = useState([]);
  const [favoritePhotos, setFavoritePhotos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchFolders = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await foldersAPI.getFolders();
      setFolders(response.data);
      
      // Fetch all photos from all folders
      const allPhotosData = [];
      for (const folder of response.data) {
        try {
          const photosResponse = await foldersAPI.getFolderPhotos(folder.id);
          const folderPhotos = photosResponse.data.map(photo => ({
            ...photo,
            folderName: folder.name,
            folderId: folder.id,
          }));
          allPhotosData.push(...folderPhotos);
        } catch (err) {
          console.error(`Error fetching photos for folder ${folder.id}:`, err);
        }
      }
      
      setAllPhotos(allPhotosData);
      setFavoritePhotos(allPhotosData.filter(photo => photo.is_favorite));
    } catch (err) {
      setError(handleError(err));
    } finally {
      setLoading(false);
    }
  }, []);

  const createFolder = async (folderData) => {
    try {
      const response = await foldersAPI.createFolder(folderData);
      setFolders(prev => [...prev, response.data]);
      return { success: true, data: response.data };
    } catch (err) {
      const error = handleError(err);
      setError(error);
      return { success: false, error };
    }
  };

  const deleteFolder = async (folderId) => {
    try {
      await foldersAPI.deleteFolder(folderId);
      setFolders(prev => prev.filter(folder => folder.id !== folderId));
      setAllPhotos(prev => prev.filter(photo => photo.folderId !== folderId));
      return { success: true };
    } catch (err) {
      const error = handleError(err);
      setError(error);
      return { success: false, error };
    }
  };

  const uploadPhoto = async (folderId, file, filename) => {
    try {
      const formData = new FormData();
      formData.append('image', file);
      formData.append('filename', filename || file.name);
      
      const response = await photosAPI.uploadPhoto(folderId, formData);
      const folder = folders.find(f => f.id === folderId);
      const newPhoto = {
        ...response.data,
        folderName: folder?.name,
        folderId: folderId,
      };
      
      setAllPhotos(prev => [...prev, newPhoto]);
      return { success: true, data: newPhoto };
    } catch (err) {
      const error = handleError(err);
      setError(error);
      return { success: false, error };
    }
  };

  const deletePhoto = async (folderId, photoId) => {
    try {
      await photosAPI.deletePhoto(folderId, photoId);
      setAllPhotos(prev => prev.filter(photo => photo.id !== photoId));
      setFavoritePhotos(prev => prev.filter(photo => photo.id !== photoId));
      return { success: true };
    } catch (err) {
      const error = handleError(err);
      setError(error);
      return { success: false, error };
    }
  };

  const toggleFavorite = async (photoId, isFavorite) => {
    try {
      // Note: You might need to implement this endpoint in your Django backend
      // await photosAPI.toggleFavorite(photoId, isFavorite);
      
      setAllPhotos(prev => prev.map(photo => 
        photo.id === photoId ? { ...photo, is_favorite: isFavorite } : photo
      ));
      
      if (isFavorite) {
        const photo = allPhotos.find(p => p.id === photoId);
        if (photo) {
          setFavoritePhotos(prev => [...prev, { ...photo, is_favorite: true }]);
        }
      } else {
        setFavoritePhotos(prev => prev.filter(photo => photo.id !== photoId));
      }
      
      return { success: true };
    } catch (err) {
      const error = handleError(err);
      setError(error);
      return { success: false, error };
    }
  };

  const getPhotosByFolder = (folderId) => {
    return allPhotos.filter(photo => photo.folderId === folderId);
  };

  const getRecentPhotos = (limit = 10) => {
    return allPhotos
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .slice(0, limit);
  };

  const searchPhotos = (query) => {
    if (!query.trim()) return [];
    return allPhotos.filter(photo =>
      photo.title.toLowerCase().includes(query.toLowerCase()) ||
      photo.description?.toLowerCase().includes(query.toLowerCase()) ||
      photo.folderName.toLowerCase().includes(query.toLowerCase())
    );
  };

  const value = {
    folders,
    currentFolder,
    allPhotos,
    favoritePhotos,
    loading,
    error,
    setCurrentFolder,
    setError,
    fetchFolders,
    createFolder,
    deleteFolder,
    uploadPhoto,
    deletePhoto,
    toggleFavorite,
    getPhotosByFolder,
    getRecentPhotos,
    searchPhotos,
  };

  return (
    <PhotoContext.Provider value={value}>
      {children}
    </PhotoContext.Provider>
  );
};