import React, { useState } from 'react';
import {
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Typography,
  IconButton,
  Box,
  Tooltip,
  Chip,
  Menu,
  MenuItem,
} from '@mui/material';
import {
  Favorite,
  FavoriteBorder,
  Delete,
  Info,
  MoreVert,
  Share,
  Download,
} from '@mui/icons-material';
import { usePhotos } from '../../contexts/PhotoContext';
import { formatRelativeTime, formatFileSize } from '../../utils/helpers';
import ConfirmDialog from '../Common/ConfirmDialog';

const PhotoCard = ({ photo, folderId, onClick }) => {
  const { deletePhoto, toggleFavorite } = usePhotos();
  const [anchorEl, setAnchorEl] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleMenuOpen = (event) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleFavoriteClick = async (event) => {
    event.stopPropagation();
    try {
      await toggleFavorite(photo.id, !photo.is_favorite);
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  const handleDeleteClick = (event) => {
    event.stopPropagation();
    handleMenuClose();
    setDeleteDialogOpen(true);
  };

  const handleInfoClick = (event) => {
    event.stopPropagation();
    handleMenuClose();
    onClick();
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      const result = await deletePhoto(folderId, photo.id);
      if (result.success) {
        setDeleteDialogOpen(false);
      }
    } catch (error) {
      console.error('Error deleting photo:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = (event) => {
    event.stopPropagation();
    handleMenuClose();
    
    const link = document.createElement('a');
    link.href = photo.image;
    link.download = photo.title;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      <Card
        className="photo-card"
        sx={{
          position: 'relative',
          background: 'linear-gradient(145deg, #ffffff, #f8fafc)',
          overflow: 'hidden',
        }}
        onClick={onClick}
      >
        {/* Photo Image */}
        <CardMedia
          component="img"
          image={photo.image}
          alt={photo.title}
          sx={{
            aspectRatio: '1',
            objectFit: 'cover',
            transition: 'transform 0.3s ease',
            '&:hover': {
              transform: 'scale(1.02)',
            },
          }}
        />

        {/* Favorite Badge */}
        {photo.is_favorite && (
          <Chip
            icon={<Favorite />}
            label="Favorite"
            size="small"
            color="error"
            sx={{
              position: 'absolute',
              top: 8,
              left: 8,
              background: 'rgba(244, 67, 54, 0.9)',
              color: 'white',
              backdropFilter: 'blur(10px)',
            }}
          />
        )}

        {/* Menu Button */}
        <IconButton
          onClick={handleMenuOpen}
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            background: 'rgba(255,255,255,0.9)',
            backdropFilter: 'blur(10px)',
            '&:hover': {
              background: 'rgba(255,255,255,1)',
            },
          }}
          size="small"
        >
          <MoreVert />
        </IconButton>

        {/* Photo Info Overlay */}
        <Box
          sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            background: 'linear-gradient(transparent, rgba(0,0,0,0.8))',
            color: 'white',
            p: 2,
            transform: 'translateY(100%)',
            transition: 'transform 0.3s ease',
            '.photo-card:hover &': {
              transform: 'translateY(0)',
            },
          }}
        >
          <Typography variant="subtitle2" noWrap gutterBottom>
            {photo.title}
          </Typography>
          <Typography variant="caption" display="block">
            {formatRelativeTime(photo.created_at)}
          </Typography>
        </Box>

        {/* Action Buttons - Always Visible on Mobile */}
        <CardActions
          sx={{
            position: 'absolute',
            bottom: 8,
            right: 8,
            p: 0,
            display: { xs: 'flex', md: 'none' },
            '.photo-card:hover &': {
              display: 'flex',
            },
            gap: 0.5,
          }}
        >
          <IconButton
            onClick={handleFavoriteClick}
            size="small"
            sx={{
              background: 'rgba(255,255,255,0.9)',
              '&:hover': { background: 'rgba(255,255,255,1)' },
            }}
          >
            {photo.is_favorite ? (
              <Favorite color="error" />
            ) : (
              <FavoriteBorder />
            )}
          </IconButton>
        </CardActions>
      </Card>

      {/* Context Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{
          sx: { borderRadius: 2, minWidth: 180 },
        }}
      >
        <MenuItem onClick={handleInfoClick}>
          <Info sx={{ mr: 1, fontSize: 18 }} />
          View Details
        </MenuItem>
        <MenuItem onClick={handleFavoriteClick}>
          {photo.is_favorite ? (
            <>
              <FavoriteBorder sx={{ mr: 1, fontSize: 18 }} />
              Remove from Favorites
            </>
          ) : (
            <>
              <Favorite sx={{ mr: 1, fontSize: 18 }} />
              Add to Favorites
            </>
          )}
        </MenuItem>
        <MenuItem onClick={handleDownload}>
          <Download sx={{ mr: 1, fontSize: 18 }} />
          Download
        </MenuItem>
        <MenuItem onClick={handleDeleteClick} sx={{ color: 'error.main' }}>
          <Delete sx={{ mr: 1, fontSize: 18 }} />
          Delete Photo
        </MenuItem>
      </Menu>

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

export default PhotoCard;