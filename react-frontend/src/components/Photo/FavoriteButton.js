import React, { useState } from 'react';
import { IconButton, Tooltip } from '@mui/material';
import { Favorite, FavoriteBorder } from '@mui/icons-material';
import { usePhotos } from '../../contexts/PhotoContext';

const FavoriteButton = ({ photo, size = 'medium' }) => {
  const { toggleFavorite } = usePhotos();
  const [loading, setLoading] = useState(false);

  const handleToggleFavorite = async (event) => {
    if (event) {
      event.stopPropagation();
    }
    
    setLoading(true);
    try {
      await toggleFavorite(photo.id, !photo.is_favorite);
    } catch (error) {
      console.error('Error toggling favorite:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Tooltip title={photo.is_favorite ? 'Remove from favorites' : 'Add to favorites'}>
      <IconButton
        onClick={handleToggleFavorite}
        disabled={loading}
        size={size}
        sx={{
          color: photo.is_favorite ? 'error.main' : 'text.secondary',
          '&:hover': {
            color: 'error.main',
            transform: 'scale(1.1)',
          },
          transition: 'all 0.2s ease',
        }}
      >
        {photo.is_favorite ? <Favorite /> : <FavoriteBorder />}
      </IconButton>
    </Tooltip>
  );
};

export default FavoriteButton;