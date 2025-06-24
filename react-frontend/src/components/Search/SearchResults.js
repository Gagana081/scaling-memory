import React from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  Chip,
} from '@mui/material';
import { Search as SearchIcon, PhotoLibrary } from '@mui/icons-material';
import PhotoCard from '../Folder/PhotoCard';

const SearchResults = ({ photos, query, loading = false }) => {
  if (loading) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography variant="body1" color="text.secondary">
          Searching...
        </Typography>
      </Box>
    );
  }

  if (!query.trim()) {
    return (
      <Card sx={{ p: 4, textAlign: 'center', background: 'linear-gradient(145deg, #f8fafc, #e2e8f0)' }}>
        <SearchIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
        <Typography variant="h6" gutterBottom>
          Search Your Photos
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Enter a search term to find your photos
        </Typography>
      </Card>
    );
  }

  if (photos.length === 0) {
    return (
      <Card sx={{ p: 4, textAlign: 'center', background: 'linear-gradient(145deg, #f8fafc, #e2e8f0)' }}>
        <PhotoLibrary sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
        <Typography variant="h6" gutterBottom>
          No Results Found
        </Typography>
        <Typography variant="body2" color="text.secondary">
          No photos found for "{query}". Try different keywords.
        </Typography>
      </Card>
    );
  }

  return (
    <Box>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6">
          Search Results for "{query}"
        </Typography>
        <Chip
          label={`${photos.length} ${photos.length === 1 ? 'photo' : 'photos'} found`}
          color="primary"
          variant="outlined"
        />
      </Box>

      <Box className="photo-grid">
        {photos.map((photo) => (
          <PhotoCard
            key={photo.id}
            photo={photo}
            folderId={photo.folderId}
          />
        ))}
      </Box>
    </Box>
  );
};

export default SearchResults;