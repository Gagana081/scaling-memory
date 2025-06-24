import { format, formatDistanceToNow, parseISO, isValid } from 'date-fns';

// Date formatting functions
export const formatDate = (dateString, formatStr = 'PPp') => {
  if (!dateString) return 'Unknown';
  
  try {
    const date = typeof dateString === 'string' ? parseISO(dateString) : dateString;
    if (!isValid(date)) return 'Invalid date';
    return format(date, formatStr);
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Invalid date';
  }
};

export const formatRelativeTime = (dateString) => {
  if (!dateString) return 'Unknown';
  
  try {
    const date = typeof dateString === 'string' ? parseISO(dateString) : dateString;
    if (!isValid(date)) return 'Invalid date';
    return formatDistanceToNow(date, { addSuffix: true });
  } catch (error) {
    console.error('Error formatting relative time:', error);
    return 'Invalid date';
  }
};

export const formatShortDate = (dateString) => {
  return formatDate(dateString, 'MMM dd, yyyy');
};

export const formatLongDate = (dateString) => {
  return formatDate(dateString, 'EEEE, MMMM dd, yyyy');
};

export const formatDateTime = (dateString) => {
  return formatDate(dateString, 'MMM dd, yyyy \'at\' hh:mm a');
};

export const formatTime = (dateString) => {
  return formatDate(dateString, 'hh:mm a');
};

// File size formatting
export const formatFileSize = (bytes) => {
  if (!bytes || bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  if (i >= sizes.length) return 'File too large';
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const formatFileSizeDetailed = (bytes) => {
  if (!bytes || bytes === 0) return { size: 0, unit: 'Bytes', formatted: '0 Bytes' };
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  if (i >= sizes.length) {
    return { size: bytes, unit: 'Bytes', formatted: 'File too large' };
  }
  
  const size = parseFloat((bytes / Math.pow(k, i)).toFixed(2));
  const unit = sizes[i];
  
  return {
    size,
    unit,
    formatted: `${size} ${unit}`,
  };
};

// Number formatting
export const formatNumber = (number, options = {}) => {
  if (typeof number !== 'number' || isNaN(number)) return '0';
  
  const defaultOptions = {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  };
  
  return number.toLocaleString('en-US', { ...defaultOptions, ...options });
};

export const formatCompactNumber = (number) => {
  if (typeof number !== 'number' || isNaN(number)) return '0';
  
  if (number < 1000) return number.toString();
  if (number < 1000000) return (number / 1000).toFixed(1) + 'K';
  if (number < 1000000000) return (number / 1000000).toFixed(1) + 'M';
  return (number / 1000000000).toFixed(1) + 'B';
};

export const formatPercentage = (value, total, decimals = 1) => {
  if (!total || total === 0) return '0%';
  const percentage = (value / total) * 100;
  return `${percentage.toFixed(decimals)}%`;
};

// Text formatting
export const formatTitle = (text) => {
  if (!text) return '';
  return text
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

export const formatSlug = (text) => {
  if (!text) return '';
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim('-');
};

export const truncateText = (text, maxLength = 50, suffix = '...') => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - suffix.length) + suffix;
};

export const formatUsername = (username) => {
  if (!username) return 'Anonymous';
  return `@${username}`;
};

// URL and path formatting
export const formatImageUrl = (imagePath, baseUrl = '') => {
  if (!imagePath) return '';
  if (imagePath.startsWith('http')) return imagePath;
  
  const cleanBaseUrl = baseUrl.replace(/\/$/, '');
  const cleanPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
  
  return `${cleanBaseUrl}${cleanPath}`;
};

export const getFileExtension = (filename) => {
  if (!filename) return '';
  return filename.split('.').pop()?.toLowerCase() || '';
};

export const getFileNameWithoutExtension = (filename) => {
  if (!filename) return '';
  return filename.substring(0, filename.lastIndexOf('.')) || filename;
};

// Photo-specific formatters
export const formatPhotoTitle = (title) => {
  if (!title) return 'Untitled Photo';
  
  // Remove file extension if present
  const nameWithoutExt = getFileNameWithoutExtension(title);
  
  // Replace underscores and hyphens with spaces
  const cleaned = nameWithoutExt.replace(/[_-]/g, ' ');
  
  // Format as title case
  return formatTitle(cleaned);
};

export const formatFolderName = (name) => {
  if (!name) return 'Untitled Folder';
  return formatTitle(name.replace(/[_-]/g, ' '));
};

// Validation formatters
export const formatValidationError = (error) => {
  if (typeof error === 'string') return error;
  if (Array.isArray(error)) return error.join(', ');
  if (typeof error === 'object') {
    return Object.values(error).flat().join(', ');
  }
  return 'An error occurred';
};

// Search and filter formatters
export const formatSearchQuery = (query) => {
  if (!query) return '';
  return query.trim().toLowerCase();
};

export const highlightSearchTerm = (text, searchTerm) => {
  if (!text || !searchTerm) return text;
  
  const regex = new RegExp(`(${searchTerm})`, 'gi');
  return text.replace(regex, '<mark>$1</mark>');
};

// Statistics formatters
export const formatStatValue = (value, type = 'number') => {
  switch (type) {
    case 'percentage':
      return `${value}%`;
    case 'currency':
      return `$${formatNumber(value)}`;
    case 'compact':
      return formatCompactNumber(value);
    default:
      return formatNumber(value);
  }
};

// Export all formatters as a single object for easier importing
export const formatters = {
  // Date formatters
  date: formatDate,
  relativeTime: formatRelativeTime,
  shortDate: formatShortDate,
  longDate: formatLongDate,
  dateTime: formatDateTime,
  time: formatTime,
  
  // File formatters
  fileSize: formatFileSize,
  fileSizeDetailed: formatFileSizeDetailed,
  
  // Number formatters
  number: formatNumber,
  compactNumber: formatCompactNumber,
  percentage: formatPercentage,
  
  // Text formatters
  title: formatTitle,
  slug: formatSlug,
  truncateText,
  username: formatUsername,
  
  // Photo-specific formatters
  photoTitle: formatPhotoTitle,
  folderName: formatFolderName,
  
  // URL formatters
  imageUrl: formatImageUrl,
  
  // Validation formatters
  validationError: formatValidationError,
  
  // Search formatters
  searchQuery: formatSearchQuery,
  highlightSearchTerm,
  
  // Statistics formatters
  statValue: formatStatValue,
};

export default formatters;