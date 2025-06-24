import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Breadcrumbs,
  Link,
  Chip,
  Alert,
  Fab,
  Tooltip,
  IconButton,
} from '@mui/material';
import {
  Home,
  Folder,
  CloudUpload,
  ArrowBack,
  Delete,
  PhotoLibrary,
} from '@mui/icons-material';
import { usePhotos } from '../../contexts/PhotoContext';
import PhotoGrid from './PhotoGrid';
import PhotoUpload from './PhotoUpload';
import LoadingSpinner from '../Common/LoadingSpinner';
import ConfirmDialog from '../Common/ConfirmDialog';

const FolderView = () => {
  const { folderId } = useParams();
  const navigate = useNavigate();
  const {
    folders,
    getPhotosByFolder,
    currentFolder,
    setCurrentFolder,
    deleteFolder,
    loading,
    error,
  } = usePhotos();

  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const folder = folders.find(f => f.id === parseInt(folderId));
  const photos = getPhotosByFolder(parseInt(folderId));

  useEffect(() => {
    if (folder) {
      setCurrentFolder(folder);
    }
  }, [folder, setCurrentFolder]);

  const handleDeleteFolder = async () => {
    setDeleteLoading(true);
    try {
      const result = await deleteFolder(parseInt(folderId));
      if (result.success) {
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Error deleting folder:', error);
    } finally {
      setDeleteLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading folder..." />;
  }

  if (!folder) {
    return (
      <Container maxWidth="md" sx={{ py: 4, textAlign: 'center' }}>
        <Typography variant="h5" gutterBottom>
          Folder not found
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          The folder you're looking for doesn't exist or has been deleted.
        </Typography>
        <Link
          component="button"
          variant="body2"
          onClick={() => navigate('/dashboard')}
        >
          Go back to dashboard
        </Link>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Breadcrumbs */}
      <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 3 }}>
        <Link
          component="button"
          variant="body2"
          onClick={() => navigate('/dashboard')}
          sx={{
            display: 'flex',
            alignItems: 'center',
            textDecoration: 'none',
            '&:hover': { textDecoration: 'underline' },
          }}
        >
          <Home sx={{ mr: 0.5, fontSize: 16 }} />
          Dashboard
        </Link>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Folder sx={{ mr: 0.5, fontSize: 16 }} />
          {folder.name}
        </Box>
      </Breadcrumbs>

      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 4 }}>
        <Box sx={{ flex: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <IconButton
              onClick={() => navigate('/dashboard')}
              sx={{
                background: 'rgba(102, 126, 234, 0.1)',
                '&:hover': { background: 'rgba(102, 126, 234, 0.2)' },
              }}
            >
              <ArrowBack />
            </IconButton>
            <Typography
              variant="h3"
              component="h1"
              sx={{
                fontWeight: 'bold',
                background: 'linear-gradient(45deg, #667eea, #764ba2)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              {folder.name}
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <Chip
              icon={<PhotoLibrary />}
              label={`${photos.length} ${photos.length === 1 ? 'photo' : 'photos'}`}
              color="primary"
              variant="outlined"
            />
            <Chip
              label={`Created ${new Date(folder.created_at).toLocaleDateString()}`}
              variant="outlined"
            />
            <Chip
              icon={<Delete />}
              label="Delete Folder"
              color="error"
              variant="outlined"
              onClick={() => setDeleteDialogOpen(true)}
              sx={{ cursor: 'pointer' }}
            />
          </Box>
        </Box>
      </Box>

      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
          {error}
        </Alert>
      )}

      {/* Photos Grid */}
      <PhotoGrid photos={photos} folderId={parseInt(folderId)} />

      {/* Upload FAB */}
      <Tooltip title="Upload Photos" placement="left">
        <Fab
          color="primary"
          aria-label="upload photos"
          onClick={() => setUploadDialogOpen(true)}
          sx={{
            position: 'fixed',
            bottom: 32,
            right: 32,
            background: 'linear-gradient(45deg, #667eea, #764ba2)',
            '&:hover': {
              background: 'linear-gradient(45deg, #5a6fd8, #6a4190)',
            },
          }}
        >
          <CloudUpload />
        </Fab>
      </Tooltip>

      {/* Photo Upload Dialog */}
      <PhotoUpload
        open={uploadDialogOpen}
        onClose={() => setUploadDialogOpen(false)}
        folderId={parseInt(folderId)}
        folderName={folder.name}
      />

      {/* Delete Folder Dialog */}
      <ConfirmDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDeleteFolder}
        title="Delete Folder"
        message={`Are you sure you want to delete "${folder.name}"? This will also delete all ${photos.length} photos in this folder. This action cannot be undone.`}
        confirmText="Delete Folder"
        loading={deleteLoading}
      />
    </Container>
  );
};

export default FolderView;