import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Grid,
  Box,
  Card,
  CardContent,
  Chip,
  Alert,
  Fab,
  Tooltip,
} from '@mui/material';
import { Add, PhotoLibrary, Folder, Favorite, TrendingUp } from '@mui/icons-material';
import { usePhotos } from '../../contexts/PhotoContext';
import FolderCard from './FolderCard';
import LoadingSpinner from '../Common/LoadingSpinner';
import CreateFolderDialog from './CreateFolderDialog';

const Dashboard = () => {
  const {
    folders,
    allPhotos,
    favoritePhotos,
    loading,
    error,
    fetchFolders,
    createFolder,
  } = usePhotos();
  
  const [createFolderOpen, setCreateFolderOpen] = useState(false);

  useEffect(() => {
    fetchFolders();
  }, [fetchFolders]);

  const handleCreateFolder = async (folderData) => {
    const result = await createFolder(folderData);
    if (result.success) {
      setCreateFolderOpen(false);
    }
    return result;
  };

  const statsCards = [
    {
      title: 'Total Photos',
      value: allPhotos.length,
      icon: <PhotoLibrary sx={{ fontSize: 40, color: 'primary.main' }} />,
      color: 'primary',
    },
    {
      title: 'Folders',
      value: folders.length,
      icon: <Folder sx={{ fontSize: 40, color: 'secondary.main' }} />,
      color: 'secondary',
    },
    {
      title: 'Favorites',
      value: favoritePhotos.length,
      icon: <Favorite sx={{ fontSize: 40, color: 'error.main' }} />,
      color: 'error',
    },
    {
      title: 'Recent Uploads',
      value: allPhotos.filter(photo => {
        const photoDate = new Date(photo.created_at);
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        return photoDate > weekAgo;
      }).length,
      icon: <TrendingUp sx={{ fontSize: 40, color: 'success.main' }} />,
      color: 'success',
    },
  ];

  if (loading) {
    return <LoadingSpinner message="Loading your gallery..." />;
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Welcome Section */}
      <Box sx={{ mb: 4 }}>
        <Typography 
          variant="h3" 
          component="h1" 
          gutterBottom
          sx={{ 
            fontWeight: 'bold',
            background: 'linear-gradient(45deg, #667eea, #764ba2)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Welcome to Your Gallery
        </Typography>
        <Typography variant="h6" color="text.secondary" gutterBottom>
          Organize and manage your photos with ease
        </Typography>
      </Box>

      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
          {error}
        </Alert>
      )}

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {statsCards.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card
              sx={{
                height: '100%',
                background: 'linear-gradient(145deg, #ffffff, #f8fafc)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 8px 25px rgba(0,0,0,0.12)',
                },
              }}
            >
              <CardContent sx={{ textAlign: 'center', py: 3 }}>
                <Box sx={{ mb: 2 }}>
                  {stat.icon}
                </Box>
                <Typography variant="h4" component="div" fontWeight="bold" gutterBottom>
                  {stat.value}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {stat.title}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Folders Section */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" component="h2" fontWeight="bold">
            Your Folders
          </Typography>
          <Chip 
            label={`${folders.length} folders`} 
            color="primary" 
            variant="outlined"
          />
        </Box>

        {folders.length === 0 ? (
          <Card sx={{ p: 4, textAlign: 'center', background: 'linear-gradient(145deg, #f8fafc, #e2e8f0)' }}>
            <Folder sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              No folders yet
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Create your first folder to start organizing your photos
            </Typography>
          </Card>
        ) : (
          <Grid container spacing={3}>
            {folders.map((folder) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={folder.id}>
                <FolderCard folder={folder} />
              </Grid>
            ))}
          </Grid>
        )}
      </Box>

      {/* Floating Action Button */}
      <Tooltip title="Create New Folder" placement="left">
        <Fab
          color="primary"
          aria-label="create folder"
          onClick={() => setCreateFolderOpen(true)}
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
          <Add />
        </Fab>
      </Tooltip>

      {/* Create Folder Dialog */}
      <CreateFolderDialog
        open={createFolderOpen}
        onClose={() => setCreateFolderOpen(false)}
        onCreateFolder={handleCreateFolder}
      />
    </Container>
  );
};

export default Dashboard;