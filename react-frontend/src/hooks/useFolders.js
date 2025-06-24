import { useState, useEffect, useCallback } from 'react';
import { foldersAPI } from '../services/api';
import { handleError } from '../utils/helpers';

export const useFolders = () => {
  const [folders, setFolders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchFolders = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await foldersAPI.getFolders();
      setFolders(response.data);
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
      return { success: true };
    } catch (err) {
      const error = handleError(err);
      setError(error);
      return { success: false, error };
    }
  };

  useEffect(() => {
    fetchFolders();
  }, [fetchFolders]);

  return {
    folders,
    loading,
    error,
    fetchFolders,
    createFolder,
    deleteFolder,
    setError,
  };
};