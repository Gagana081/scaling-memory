import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  IconButton,
  Chip,
  Grid,
  Card,
  CardMedia,
  Divider,
  Tooltip,
} from '@mui/material';
import {
  Close,
  Favorite,
  FavoriteBorder,
  Download,
  Delete,
  Share,
  Info,
  Folder,
  Schedule,
  PhotoSizeSelectActual,
  Link as LinkIcon,
} from '@mui/icons-material';
import { usePhotos } from '../../contexts/PhotoContext';
import { formatDate, formatFileSize, getImageUrl } from '../../utils/helpers';
import ConfirmDialog from '../Common/ConfirmDialog';
import FavoriteButton from './FavoriteButton';

const PhotoDetail = ({ open, onClose, photo, folderId }) => {
  const { deletePhoto } = usePhotos();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!photo) return null;

  const handleDelete = async () => {
    setLoading(true);
    try {
      const result = await deletePhoto(folderId, photo.id);
      if (result.success) {
        setDeleteDialogOpen(false);
        onClose();
      }
    } catch (error) {
      console.error('Error deleting photo:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = photo.image;
    link.download = photo.title;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: photo.title,
          text: `Check out this photo: ${photo.title}`,
          url: photo.image,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback: copy link to clipboard
      navigator.clipboard.writeText(photo.image);
      // You could show a toast notification here
    }
  };

  const copyImageUrl = () => {
    navigator.clipboard.writeText(photo.image);
    // You could show a toast notification here
  };

  const photoDetails = [
    {
      label: 'File Name',
      value: photo.title,
      icon: <Info />,
    },
    {
      label: 'Folder',
      value: photo.folderName || 'Unknown',
      icon: <Folder />,
    },
    {
      label: 'Upload Date',
      value: formatDate(photo.created_at),
      icon: <Schedule />,
    },
    {
      label: 'File Size',
      value: photo.file_size ? formatFileSize(photo.file_size) : 'Unknown',
      icon: <PhotoSizeSelectActual />,
    },
    {
      label: 'Image URL',
      value: photo.image,
      icon: <LinkIcon />,
      copyable: true,
    },
  ];

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth="lg"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            maxHeight: '90vh',
            m: 2,
          },
        }}
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Info color="primary" />
              <Typography variant="h6" component="span" noWrap>
                {photo.title}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <FavoriteButton photo={photo} />
              <IconButton onClick={onClose} size="small">
                <Close />
              </IconButton>
            </Box>
          </Box>
        </DialogTitle>

        <DialogContent sx={{ p: 0 }}>
          <Grid container sx={{ height: '100%' }}>
            {/* Image Preview */}
            <Grid item xs={12} md={8}>
              <Box
                sx={{
                  height: { xs: 300, md: 500 },
                  position: 'relative',
                  background: 'linear-gradient(45deg, #f5f5f5, #e0e0e0)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <CardMedia
                  component="img"
                  image={photo.image}
                  alt={photo.title}
                  sx={{
                    maxWidth: '100%',
                    maxHeight: '100%',
                    objectFit: 'contain',
                    borderRadius: 2,
                    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                  }}
                />
                
                {/* Favorite Badge */}
                {photo.is_favorite && (
                  <Chip
                    icon={<Favorite />}
                    label="Favorite"
                    color="error"
                    sx={{
                      position: 'absolute',
                      top: 16,
                      left: 16,
                      background: 'rgba(244, 67, 54, 0.9)',
                      color: 'white',
                    }}
                  />
                )}
              </Box>
            </Grid>

            {/* Photo Details */}
            <Grid item xs={12} md={4}>
              <Box sx={{ p: 3, height: '100%', overflow: 'auto' }}>
                <Typography variant="h6" gutterBottom>
                  Photo Details
                </Typography>
                
                <Box sx={{ mb: 3 }}>
                  {photo.description && (
                    <>
                      <Typography variant="subtitle2" gutterBottom>
                        Description
                      </Typography>
                      <Typography variant="body2" color="text.secondary" paragraph>
                        {photo.description}
                      </Typography>
                      <Divider sx={{ my: 2 }} />
                    </>
                  )}
                  
                  {photoDetails.map((detail, index) => (
                    <Box key={index} sx={{ mb: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                        {detail.icon}
                        <Typography variant="subtitle2">
                          {detail.label}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{
                            wordBreak: detail.copyable ? 'break-all' : 'normal',
                            flex: 1,
                          }}
                        >
                          {detail.copyable && detail.value.length > 50
                            ? `${detail.value.substring(0, 50)}...`
                            : detail.value}
                        </Typography>
                        {detail.copyable && (
                          <Tooltip title="Copy URL">
                            <IconButton size="small" onClick={copyImageUrl}>
                              <LinkIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        )}
                      </Box>
                    </Box>
                  ))}
                </Box>

                {/* Quick Actions */}
                <Card sx={{ p: 2, background: 'linear-gradient(145deg, #f8fafc, #e2e8f0)' }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Quick Actions
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Button
                      startIcon={<Download />}
                      onClick={handleDownload}
                      size="small"
                      variant="outlined"
                      fullWidth
                    >
                      Download
                    </Button>
                    <Button
                      startIcon={<Share />}
                      onClick={handleShare}
                      size="small"
                      variant="outlined"
                      fullWidth
                    >
                      Share
                    </Button>
                    <Button
                      startIcon={<Delete />}
                      onClick={() => setDeleteDialogOpen(true)}
                      size="small"
                      variant="outlined"
                      color="error"
                      fullWidth
                    >
                      Delete
                    </Button>
                  </Box>
                </Card>
              </Box>
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions sx={{ p: 2, justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              startIcon={<Download />}
              onClick={handleDownload}
              variant="outlined"
              sx={{ borderRadius: 2 }}
            >
              Download
            </Button>
            <Button
              startIcon={<Share />}
              onClick={handleShare}
              variant="outlined"
              sx={{ borderRadius: 2 }}
            >
              Share
            </Button>
          </Box>
          <Button
            onClick={onClose}
            variant="contained"
            sx={{ borderRadius: 2 }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDelete}
        title="Delete Photo"
        message={`Are you sure you want to delete "${photo.title}"? This action cannot be undone.`}
        confirmText="Delete"
        loading={loading}
      />
    </>
  );
};

export default PhotoDetail;