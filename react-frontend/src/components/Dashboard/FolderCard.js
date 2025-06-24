import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Typography,
  IconButton,
  Chip,
  Box,
  Menu,
  MenuItem,
  Tooltip,
} from '@mui/material';
import {
  Folder,
  MoreVert,
  Delete,
  OpenInNew,
  PhotoLibrary,
} from '@mui/icons-material';
import { usePhotos } from '../../contexts/PhotoContext';
import { formatRelativeTime } from '../../utils/helpers';
import ConfirmDialog from '../Common/ConfirmDialog';

const FolderCard = ({ folder }) => {
  const navigate = useNavigate();
  const { getPhotosByFolder, deleteFolder } = usePhotos();
  const [anchorEl, setAnchorEl] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const folderPhotos = getPhotosByFolder(folder.id);
  const latestPhoto = folderPhotos.sort((a, b) => 
    new Date(b.created_at) - new Date(a.created_at)
  )[0];

  const handleMenuOpen = (event) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleCardClick = () => {
    navigate(`/folder/${folder.id}`);
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      const result = await deleteFolder(folder.id);
      if (result.success) {
        setDeleteDialogOpen(false);
      }
    } catch (error) {
      console.error('Error deleting folder:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (event) => {
    event.stopPropagation();
    handleMenuClose();
    setDeleteDialogOpen(true);
  };

  const handleOpenClick = (event) => {
    event.stopPropagation();
    handleMenuClose();
    navigate(`/folder/${folder.id}`);
  };

  return (
    <>
      <Card
        className="folder-card"
        sx={{
          height: '100%',
          cursor: 'pointer',
          background: 'linear-gradient(145deg, #ffffff, #f8fafc)',
          position: 'relative',
          overflow: 'hidden',
        }}
        onClick={handleCardClick}
      >
        {/* Folder Preview */}
        {latestPhoto ? (
          <CardMedia
            component="img"
            height="200"
            image={latestPhoto.image}
            alt={folder.name}
            sx={{
              objectFit: 'cover',
              transition: 'transform 0.3s ease',
              '&:hover': {
                transform: 'scale(1.05)',
              },
            }}
          />
        ) : (
          <Box
            sx={{
              height: 200,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'rgba(255,255,255,0.1)',
                backdropFilter: 'blur(10px)',
              },
            }}
          >
            <Folder sx={{ fontSize: 64, color: 'white', opacity: 0.8, zIndex: 1 }} />
          </Box>
        )}

        {/* Photo Count Badge */}
        <Chip
          label={`${folderPhotos.length} photos`}
          size="small"
          color="primary"
          sx={{
            position: 'absolute',
            top: 8,
            left: 8,
            background: 'rgba(255,255,255,0.9)',
            backdropFilter: 'blur(10px)',
          }}
        />

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
        >
          <MoreVert />
        </IconButton>

        <CardContent sx={{ pb: 1 }}>
          <Typography variant="h6" component="h3" gutterBottom noWrap>
            {folder.name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Created {formatRelativeTime(folder.created_at)}
          </Typography>
        </CardContent>

        <CardActions sx={{ pt: 0, justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <PhotoLibrary sx={{ fontSize: 16, color: 'text.secondary' }} />
            <Typography variant="caption" color="text.secondary">
              {folderPhotos.length === 1 ? '1 photo' : `${folderPhotos.length} photos`}
            </Typography>
          </Box>
          <Typography variant="caption" color="text.secondary">
            {formatRelativeTime(folder.updated_at)}
          </Typography>
        </CardActions>
      </Card>

      {/* Context Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{
          sx: { borderRadius: 2, minWidth: 150 },
        }}
      >
        <MenuItem onClick={handleOpenClick}>
          <OpenInNew sx={{ mr: 1, fontSize: 18 }} />
          Open Folder
        </MenuItem>
        <MenuItem onClick={handleDeleteClick} sx={{ color: 'error.main' }}>
          <Delete sx={{ mr: 1, fontSize: 18 }} />
          Delete Folder
        </MenuItem>
      </Menu>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDelete}
        title="Delete Folder"
        message={`Are you sure you want to delete "${folder.name}"? This will also delete all photos in this folder. This action cannot be undone.`}
        confirmText="Delete"
        loading={loading}
      />
    </>
  );
};

export default FolderCard;