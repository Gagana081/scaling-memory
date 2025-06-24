import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Alert,
  Typography,
} from '@mui/material';
import { CreateNewFolder } from '@mui/icons-material';
import { validateFolderForm } from '../../utils/validation';

const CreateFolderDialog = ({ open, onClose, onCreateFolder }) => {
  const [formData, setFormData] = useState({ name: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear errors when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validation = validateFolderForm(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setLoading(true);
    setError('');

    try {
      const result = await onCreateFolder(formData);
      if (result.success) {
        setFormData({ name: '' });
        setErrors({});
        onClose();
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('Failed to create folder. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setFormData({ name: '' });
      setErrors({});
      setError('');
      onClose();
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          p: 1,
        },
      }}
    >
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <CreateNewFolder color="primary" />
          <Typography variant="h6" component="span">
            Create New Folder
          </Typography>
        </Box>
      </DialogTitle>

      <Box component="form" onSubmit={handleSubmit}>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" paragraph>
            Create a new folder to organize your photos
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
              {error}
            </Alert>
          )}

          <TextField
            autoFocus
            margin="dense"
            name="name"
            label="Folder Name"
            type="text"
            fullWidth
            variant="outlined"
            value={formData.name}
            onChange={handleChange}
            error={!!errors.name}
            helperText={errors.name}
            disabled={loading}
            placeholder="Enter folder name..."
            sx={{ mt: 2 }}
          />
        </DialogContent>

        <DialogActions sx={{ p: 3, gap: 1 }}>
          <Button
            onClick={handleClose}
            variant="outlined"
            disabled={loading}
            sx={{ borderRadius: 2 }}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={loading || !formData.name.trim()}
            sx={{
              borderRadius: 2,
              background: 'linear-gradient(45deg, #667eea, #764ba2)',
            }}
          >
            {loading ? 'Creating...' : 'Create Folder'}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
};

export default CreateFolderDialog;