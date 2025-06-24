import React, { useState } from 'react';
import {
  Box,
  IconButton,
  Menu,
  MenuItem,
  Tooltip,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  MoreVert,
  Favorite,
  FavoriteBorder,
  Download,
  Delete,
  Share,
  Info,
  Edit,
} from '@mui/icons-material';
import { usePhotos } from '../../contexts/PhotoContext';

const PhotoActions = ({ photo, folderId, onViewDetails, onEdit }) => {
  const { deletePhoto, toggleFavorite } = usePhotos();
  const [anchorEl, setAnchorEl] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleMenuOpen = (event) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleFavoriteToggle = async (event) => {
    event.stopPropagation();
    handleMenuClose();
    setLoading(true);
    try {
      await toggleFavorite(photo.id, !photo.is_favorite);
    } catch (error) {
      console.error('Error toggling favorite:', error);
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

  const handleShare = async (event) => {
    event.stopPropagation();
    handleMenuClose();
    
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
      navigator.clipboard.writeText(photo.image);
    }
  };

  const handleViewDetails = (event) => {
    event.stopPropagation();
    handleMenuClose();
    if (onViewDetails) {
      onViewDetails(photo);
    }
  };

  const handleEdit = (event) => {
    event.stopPropagation();
    handleMenuClose();
    if (onEdit) {
      onEdit(photo);
    }
  };

  const handleDelete = async (event) => {
    event.stopPropagation();
    handleMenuClose();
    
    if (window.confirm(`Are you sure you want to delete "${photo.title}"?`)) {
      setLoading(true);
      try {
        await deletePhoto(folderId, photo.id);
      } catch (error) {
        console.error('Error deleting photo:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <Box>
      <Tooltip title="More actions">
        <IconButton
          onClick={handleMenuOpen}
          disabled={loading}
          sx={{
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
      </Tooltip>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{
          sx: {
            borderRadius: 2,
            minWidth: 200,
            '& .MuiMenuItem-root': {
              borderRadius: 1,
              mx: 1,
              my: 0.5,
            },
          },
        }}
      >
        <MenuItem onClick={handleViewDetails}>
          <ListItemIcon>
            <Info fontSize="small" />
          </ListItemIcon>
          <ListItemText>View Details</ListItemText>
        </MenuItem>

        <MenuItem onClick={handleFavoriteToggle}>
          <ListItemIcon>
            {photo.is_favorite ? (
              <FavoriteBorder fontSize="small" />
            ) : (
              <Favorite fontSize="small" />
            )}
          </ListItemIcon>
          <ListItemText>
            {photo.is_favorite ? 'Remove from Favorites' : 'Add to Favorites'}
          </ListItemText>
        </MenuItem>

        <MenuItem onClick={handleDownload}>
          <ListItemIcon>
            <Download fontSize="small" />
          </ListItemIcon>
          <ListItemText>Download</ListItemText>
        </MenuItem>

        <MenuItem onClick={handleShare}>
          <ListItemIcon>
            <Share fontSize="small" />
          </ListItemIcon>
          <ListItemText>Share</ListItemText>
        </MenuItem>

        {onEdit && (
          <MenuItem onClick={handleEdit}>
            <ListItemIcon>
              <Edit fontSize="small" />
            </ListItemIcon>
            <ListItemText>Edit</ListItemText>
          </MenuItem>
        )}

        <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
          <ListItemIcon>
            <Delete fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText>Delete</ListItemText>
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default PhotoActions;
