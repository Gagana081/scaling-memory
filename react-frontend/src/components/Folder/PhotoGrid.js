import React, { useState } from 'react';
import {
  Grid,
  Box,
  Typography,
  Card,
  Masonry,
} from '@mui/material';
import { PhotoLibrary } from '@mui/icons-material';
import PhotoCard from './PhotoCard';
import PhotoDetail from '../Photo/PhotoDetail';

const PhotoGrid = ({ photos, folderId }) => {
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [detailOpen, setDetailOpen] = useState(false);

  const handlePhotoClick = (photo) => {
    setSelectedPhoto(photo);
    setDetailOpen(true);
  };

  const handleDetailClose = () => {
    setDetailOpen(false);
    setSelectedPhoto(null);
  };

  if (!photos || photos.length === 0) {
    return (
      <Card sx={{ p: 4, textAlign: 'center', background: 'linear-gradient(145deg, #f8fafc, #e2e8f0)' }}>
        <PhotoLibrary sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
        <Typography variant="h6" gutterBottom>
          No photos yet
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Upload your first photo to get started
        </Typography>
      </Card>
    );
  }

  return (
    <>
      <Box sx={{ width: '100%' }}>
        {/* Use CSS Grid for better responsive layout */}
        <Box className="photo-grid">
          {photos.map((photo) => (
            <PhotoCard
              key={photo.id}
              photo={photo}
              folderId={folderId}
              onClick={() => handlePhotoClick(photo)}
            />
          ))}
        </Box>
      </Box>

      {/* Photo Detail Modal */}
      <PhotoDetail
        open={detailOpen}
        onClose={handleDetailClose}
        photo={selectedPhoto}
        folderId={folderId}
      />
    </>
  );
};

export default PhotoGrid;