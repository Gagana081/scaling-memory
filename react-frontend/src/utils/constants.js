export const API_BASE_URL = 'http://98.70.209.206:8000';
export const APP_NAME = process.env.REACT_APP_NAME || 'Photo Gallery';

export const ROUTES = {
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  FOLDER: '/folder',
};

export const API_ENDPOINTS = {
  LOGIN: '/token',
  REGISTER: '/users',
  REFRESH: '/token/refresh',
  FOLDERS: '/folders',
  PHOTOS: '/photos',
  USERS: '/users',
};

export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'access_token',
  REFRESH_TOKEN: 'refresh_token',
  USER_DATA: 'user_data',
};

export const PHOTO_UPLOAD_CONFIG = {
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  ACCEPTED_FORMATS: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  MAX_FILES: 10,
};

export const MESSAGES = {
  LOGIN_SUCCESS: 'Login successful!',
  REGISTER_SUCCESS: 'Registration successful! Please log in.',
  LOGOUT_SUCCESS: 'Logged out successfully.',
  FOLDER_CREATED: 'Folder created successfully!',
  FOLDER_DELETED: 'Folder deleted successfully!',
  PHOTO_UPLOADED: 'Photo uploaded successfully!',
  PHOTO_DELETED: 'Photo deleted successfully!',
  PHOTO_FAVORITED: 'Photo added to favorites!',
  PHOTO_UNFAVORITED: 'Photo removed from favorites!',
  ERROR_GENERIC: 'Something went wrong. Please try again.',
  ERROR_NETWORK: 'Network error. Please check your connection.',
  ERROR_UNAUTHORIZED: 'You are not authorized to perform this action.',
};
