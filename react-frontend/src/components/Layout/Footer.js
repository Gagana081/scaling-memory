import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  Card,
  CardMedia,
  TextField,
  InputAdornment,
  Chip,
  IconButton,
  Tooltip,
  Button,
} from '@mui/material';
import { Search, Folder, AccessTime, Favorite, OpenInNew } from '@mui/icons-material';
import { usePhotos } from '../../contexts/PhotoContext';
import { formatRelativeTime } from '../../utils/helpers';
import SearchBar from '../Search/SearchBar';

const Footer = ({ onFolderClick }) => {
  const {
    folders,
    getRecentPhotos,
    favoritePhotos,
    searchPhotos,
  } = usePhotos();

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const recentPhotos = getRecentPhotos(6);

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.trim()) {
      const results = searchPhotos(query);
      setSearchResults(results.slice(0, 6));
    } else {
      setSearchResults([]);
    }
  };

  const RecentPhotosComponent = () => (
    <Card sx={{ height: '100%', background: 'linear-gradient(145deg, #f3f4f6, #ffffff)' }}>
      <Box sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
          <AccessTime sx={{ mr: 1, color: 'primary.main' }} />
          Recent Uploads
        </Typography>
        {recentPhotos.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="body2" color="text.secondary">
              No photos uploaded yet
            </Typography>
          </Box>
        ) : (
          <Grid container spacing={1}>
            {recentPhotos.map((photo) => (
              <Grid item xs={4} key={photo.id}>
                <Card 
                  sx={{ 
                    position: 'relative',
                    cursor: 'pointer',
                    transition: 'transform 0.2s',
                    '&:hover': {
                      transform: 'scale(1.05)',
                    },
                  }}
                >
                  <CardMedia
                    component="img"
                    height="80"
                    image={photo.image}
                    alt={photo.title}
                    sx={{ objectFit: 'cover' }}
                  />
                  <Tooltip title={`${photo.title} - ${photo.folderName} - ${formatRelativeTime(photo.created_at)}`}>
                    <Box
                      sx={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        background: 'linear-gradient(transparent, rgba(0,0,0,0.8))',
                        color: 'white',
                        p: 0.5,
                      }}
                    >
                      <Typography variant="caption" noWrap>
                        {photo.title}
                      </Typography>
                    </Box>
                  </Tooltip>
                  {photo.is_favorite && (
                    <Favorite
                      sx={{
                        position: 'absolute',
                        top: 4,
                        right: 4,
                        fontSize: 16,
                        color: 'error.main',
                      }}
                    />
                  )}
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </Card>
  );

  const FoldersComponent = () => (
    <Card sx={{ height: '100%', background: 'linear-gradient(145deg, #f3f4f6, #ffffff)' }}>
      <Box sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
          <Folder sx={{ mr: 1, color: 'primary.main' }} />
          Your Folders ({folders.length})
        </Typography>
        {folders.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="body2" color="text.secondary">
              No folders created yet
            </Typography>
          </Box>
        ) : (
          <Grid container spacing={1}>
            {folders.slice(0, 6).map((folder) => {
              const folderPhotos = recentPhotos.filter(photo => photo.folderName === folder.name);
              const latestPhoto = folderPhotos[0];
              const photoCount = folderPhotos.length;
              
              return (
                <Grid item xs={6} key={folder.id}>
                  <Card 
                    sx={{ 
                      cursor: 'pointer',
                      transition: 'all 0.3s',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                      },
                    }}
                    onClick={() => onFolderClick(folder)}
                  >
                    {latestPhoto ? (
                      <CardMedia
                        component="img"
                        height="80"
                        image={latestPhoto.image}
                        alt={folder.name}
                        sx={{ objectFit: 'cover' }}
                      />
                    ) : (
                      <Box
                        sx={{
                          height: 80,
                          background: 'linear-gradient(45deg, #e3f2fd, #bbdefb)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Folder sx={{ fontSize: 32, color: 'primary.main', opacity: 0.7 }} />
                      </Box>
                    )}
                    <Box sx={{ p: 1, textAlign: 'center' }}>
                      <Typography variant="subtitle2" noWrap gutterBottom>
                        {folder.name}
                      </Typography>
                      <Chip 
                        label={`${photoCount} photos`}
                        size="small"
                        color={photoCount > 0 ? 'primary' : 'default'}
                        sx={{ fontSize: '0.7rem' }}
                      />
                    </Box>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        )}
        {folders.length > 6 && (
          <Button
            size="small"
            endIcon={<OpenInNew />}
            sx={{ mt: 2, width: '100%' }}
            onClick={() => window.location.href = '/dashboard'}
          >
            View All Folders
          </Button>
        )}
      </Box>
    </Card>
  );

  const SearchComponent = () => (
    <Card sx={{ height: '100%', background: 'linear-gradient(145deg, #f3f4f6, #ffffff)' }}>
      <Box sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
          <Search sx={{ mr: 1, color: 'primary.main' }} />
          Search Photos
        </Typography>
        
        <Box sx={{ mb: 2 }}>
          <SearchBar
            onSearch={handleSearch}
            placeholder="Search your photos..."
          />
        </Box>
        
        {searchQuery && (
          <Box>
            <Typography variant="subtitle2" gutterBottom>
              Results for "{searchQuery}" ({searchResults.length})
            </Typography>
            {searchResults.length === 0 ? (
              <Typography variant="body2" color="text.secondary" sx={{ py: 2, textAlign: 'center' }}>
                No photos found
              </Typography>
            ) : (
              <Grid container spacing={1}>
                {searchResults.map((photo) => (
                  <Grid item xs={6} key={photo.id}>
                    <Card 
                      sx={{ 
                        cursor: 'pointer',
                        transition: 'transform 0.2s',
                        position: 'relative',
                        '&:hover': {
                          transform: 'scale(1.05)',
                        },
                      }}
                    >
                      <CardMedia
                        component="img"
                        height="60"
                        image={photo.image}
                        alt={photo.title}
                        sx={{ objectFit: 'cover' }}
                      />
                      {photo.is_favorite && (
                        <Favorite
                          sx={{
                            position: 'absolute',
                            top: 2,
                            right: 2,
                            fontSize: 14,
                            color: 'error.main',
                          }}
                        />
                      )}
                      <Box sx={{ p: 0.5 }}>
                        <Typography variant="caption" display="block" noWrap>
                          {photo.title}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" noWrap>
                          {photo.folderName}
                        </Typography>
                      </Box>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}
          </Box>
        )}

        {!searchQuery && favoritePhotos.length > 0 && (
          <Box>
            <Typography variant="subtitle2" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
              <Favorite sx={{ mr: 0.5, fontSize: 16, color: 'error.main' }} />
              Favorites ({favoritePhotos.length})
            </Typography>
            <Grid container spacing={1}>
              {favoritePhotos.slice(0, 4).map((photo) => (
                <Grid item xs={6} key={photo.id}>
                  <Card 
                    sx={{ 
                      cursor: 'pointer',
                      transition: 'transform 0.2s',
                      '&:hover': {
                        transform: 'scale(1.05)',
                      },
                    }}
                  >
                    <CardMedia
                      component="img"
                      height="60"
                      image={photo.image}
                      alt={photo.title}
                      sx={{ objectFit: 'cover' }}
                    />
                    <Box sx={{ p: 0.5 }}>
                      <Typography variant="caption" display="block" noWrap>
                        {photo.title}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" noWrap>
                        {photo.folderName}
                      </Typography>
                    </Box>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}
      </Box>
    </Card>
  );

  return (
    <Box
      component="footer"
      sx={{
        bgcolor: 'background.paper',
        py: 4,
        mt: 'auto',
        borderTop: '1px solid',
        borderColor: 'divider',
        background: 'linear-gradient(180deg, #fafafa 0%, #f5f5f5 100%)',
      }}
    >
      <Container maxWidth="xl">
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <RecentPhotosComponent />
          </Grid>
          <Grid item xs={12} md={4}>
            <FoldersComponent />
          </Grid>
          <Grid item xs={12} md={4}>
            <SearchComponent />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Footer;