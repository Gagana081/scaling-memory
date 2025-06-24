import React, { useState } from 'react';
import { Box } from '@mui/material';
import Header from './Header';
import Footer from './Footer';
import CreateFolderDialog from '../Dashboard/CreateFolderDialog';
import { usePhotos } from '../../contexts/PhotoContext';
import { useNavigate } from 'react-router-dom';

const Layout = ({ children, showFooter = true }) => {
  const [createFolderOpen, setCreateFolderOpen] = useState(false);
  const { createFolder } = usePhotos();
  const navigate = useNavigate();

  const handleCreateFolder = () => {
    setCreateFolderOpen(true);
  };

  const handleFolderCreated = async (folderData) => {
    const result = await createFolder(folderData);
    if (result.success) {
      setCreateFolderOpen(false);
    }
    return result;
  };

  const handleFolderClick = (folder) => {
    navigate(`/folder/${folder.id}`);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header onCreateFolder={handleCreateFolder} />
      
      <Box component="main" sx={{ flexGrow: 1 }}>
        {children}
      </Box>
      
      {showFooter && <Footer onFolderClick={handleFolderClick} />}
      
      <CreateFolderDialog
        open={createFolderOpen}
        onClose={() => setCreateFolderOpen(false)}
        onCreateFolder={handleFolderCreated}
      />
    </Box>
  );
};

export default Layout;