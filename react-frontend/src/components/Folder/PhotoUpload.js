import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  LinearProgress,
  Alert,
  Chip,
  Paper,
} from '@mui/material';
import {
  CloudUpload,
  Delete,
  PhotoLibrary,
  CheckCircle,
  Error as ErrorIcon,
} from '@mui/icons-material';
import { usePhotos } from '../../contexts/PhotoContext';
import { formatFileSize, isImageFile } from '../../utils/helpers';
import { validatePhotoUpload } from '../../utils/validation';

const PhotoUpload = ({ open, onClose, folderId, folderName }) => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});
  const [uploadResults, setUploadResults] = useState([]);
  const [error, setError] = useState('');

  const { uploadPhoto } = usePhotos();

  const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
    setError('');
    
    // Handle rejected files
    if (rejectedFiles.length > 0) {
      const errorMessages = rejectedFiles.map(({ file, errors }) => {
        const errorTexts = errors.map(error => {
          switch (error.code) {
            case 'file-too-large':
              return 'File is too large (max 10MB)';
            case 'file-invalid-type':
              return 'Only image files are allowed';
            default:
              return error.message;
          }
        });
        return `${file.name}: ${errorTexts.join(', ')}`;
      });
      setError(errorMessages.join('\n'));
    }

    // Add accepted files
    const newFiles = acceptedFiles.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      name: file.name,
      size: file.size,
      preview: URL.createObjectURL(file),
      status: 'pending', // pending, uploading, success, error
      error: null,
    }));

    setSelectedFiles(prev => [...prev, ...newFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp']
    },
    maxSize: 10 * 1024 * 1024, // 10MB
    multiple: true,
  });

  const removeFile = (fileId) => {
    setSelectedFiles(prev => {
      const updated = prev.filter(f => f.id !== fileId);
      // Revoke object URL to prevent memory leaks
      const removedFile = prev.find(f => f.id === fileId);
      if (removedFile?.preview) {
        URL.revokeObjectURL(removedFile.preview);
      }
      return updated;
    });
  };

  const uploadFiles = async () => {
    if (selectedFiles.length === 0) return;

    setUploading(true);
    setUploadResults([]);
    setError('');

    const results = [];

    for (let i = 0; i < selectedFiles.length; i++) {
      const fileData = selectedFiles[i];
      
      // Update file status to uploading
      setSelectedFiles(prev => prev.map(f => 
        f.id === fileData.id ? { ...f, status: 'uploading' } : f
      ));

      try {
        const result = await uploadPhoto(folderId, fileData.file, fileData.name);
        
        if (result.success) {
          setSelectedFiles(prev => prev.map(f => 
            f.id === fileData.id ? { ...f, status: 'success' } : f
          ));
          results.push({ ...fileData, status: 'success' });
        } else {
          setSelectedFiles(prev => prev.map(f => 
            f.id === fileData.id ? { ...f, status: 'error', error: result.error } : f
          ));
          results.push({ ...fileData, status: 'error', error: result.error });
        }
      } catch (error) {
        setSelectedFiles(prev => prev.map(f => 
          f.id === fileData.id ? { ...f, status: 'error', error: 'Upload failed' } : f
        ));
        results.push({ ...fileData, status: 'error', error: 'Upload failed' });
      }

      // Update progress
      setUploadProgress({ completed: i + 1, total: selectedFiles.length });
    }

    setUploadResults(results);
    setUploading(false);

    // Auto close if all uploads successful
    const hasErrors = results.some(r => r.status === 'error');
    if (!hasErrors) {
      setTimeout(() => {
        handleClose();
      }, 2000);
    }
  };

  const handleClose = () => {
    if (!uploading) {
      // Clean up object URLs
      selectedFiles.forEach(file => {
        if (file.preview) {
          URL.revokeObjectURL(file.preview);
        }
      });
      
      setSelectedFiles([]);
      setUploadProgress({});
      setUploadResults([]);
      setError('');
      onClose();
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'success':
        return <CheckCircle color="success" />;
      case 'error':
        return <ErrorIcon color="error" />;
      case 'uploading':
        return <LinearProgress sx={{ width: 20, height: 20 }} />;
      default:
        return <PhotoLibrary color="action" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'success':
        return 'success';
      case 'error':
        return 'error';
      case 'uploading':
        return 'primary';
      default:
        return 'default';
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 3, minHeight: 500 },
      }}
    >
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <CloudUpload color="primary" />
          <Typography variant="h6" component="span">
            Upload Photos to "{folderName}"
          </Typography>
        </Box>
      </DialogTitle>

      <DialogContent>
        {/* Error Alert */}
        {error && (
          <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
            {error.split('\n').map((line, index) => (
              <div key={index}>{line}</div>
            ))}
          </Alert>
        )}

        {/* Upload Progress */}
        {uploading && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" gutterBottom>
              Uploading {uploadProgress.completed} of {uploadProgress.total} files...
            </Typography>
            <LinearProgress
              variant="determinate"
              value={(uploadProgress.completed / uploadProgress.total) * 100}
              sx={{ height: 8, borderRadius: 4 }}
            />
          </Box>
        )}

        {/* Dropzone */}
        {!uploading && (
          <Paper
            {...getRootProps()}
            className={`photo-upload-dropzone ${isDragActive ? 'drag-active' : ''}`}
            sx={{ mb: 3 }}
          >
            <input {...getInputProps()} />
            <CloudUpload sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              {isDragActive ? 'Drop photos here' : 'Drag & drop photos here'}
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              or click to select files
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', justifyContent: 'center' }}>
              <Chip label="JPG" size="small" />
              <Chip label="PNG" size="small" />
              <Chip label="GIF" size="small" />
              <Chip label="WebP" size="small" />
            </Box>
            <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
              Maximum file size: 10MB per image
            </Typography>
          </Paper>
        )}

        {/* Selected Files List */}
        {selectedFiles.length > 0 && (
          <Box>
            <Typography variant="h6" gutterBottom>
              Selected Files ({selectedFiles.length})
            </Typography>
            <List sx={{ maxHeight: 300, overflow: 'auto' }}>
              {selectedFiles.map((fileData) => (
                <ListItem
                  key={fileData.id}
                  sx={{
                    border: 1,
                    borderColor: 'divider',
                    borderRadius: 2,
                    mb: 1,
                    bgcolor: fileData.status === 'success' ? 'success.light' : 
                             fileData.status === 'error' ? 'error.light' : 'transparent',
                  }}
                >
                  <Box sx={{ mr: 2 }}>
                    {getStatusIcon(fileData.status)}
                  </Box>
                  <ListItemText
                    primary={fileData.name}
                    secondary={
                      <Box>
                        <Typography variant="caption">
                          {formatFileSize(fileData.size)}
                        </Typography>
                        {fileData.error && (
                          <Typography variant="caption" color="error" display="block">
                            {fileData.error}
                          </Typography>
                        )}
                      </Box>
                    }
                  />
                  <ListItemSecondaryAction>
                    <Chip
                      label={fileData.status}
                      size="small"
                      color={getStatusColor(fileData.status)}
                      sx={{ mr: 1 }}
                    />
                    {!uploading && fileData.status !== 'success' && (
                      <IconButton
                        edge="end"
                        aria-label="delete"
                        onClick={() => removeFile(fileData.id)}
                        size="small"
                      >
                        <Delete />
                      </IconButton>
                    )}
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 3, gap: 1 }}>
        <Button
          onClick={handleClose}
          variant="outlined"
          disabled={uploading}
          sx={{ borderRadius: 2 }}
        >
          {uploadResults.length > 0 && !uploading ? 'Close' : 'Cancel'}
        </Button>
        <Button
          onClick={uploadFiles}
          variant="contained"
          disabled={selectedFiles.length === 0 || uploading}
          sx={{
            borderRadius: 2,
            background: 'linear-gradient(45deg, #667eea, #764ba2)',
          }}
        >
          {uploading ? `Uploading...` : `Upload ${selectedFiles.length} Files`}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PhotoUpload;