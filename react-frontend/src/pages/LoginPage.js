import React, { useEffect } from 'react';
import { useLocation, Navigate } from 'react-router-dom';
import { Alert, Box } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import Login from '../components/Auth/Login';
import LoadingSpinner from '../components/Common/LoadingSpinner';

const LoginPage = () => {
  const { user, loading } = useAuth();
  const location = useLocation();
  
  // Get any message from registration redirect
  const message = location.state?.message;

  if (loading) {
    return <LoadingSpinner message="Checking authentication..." />;
  }

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
      {message && (
        <Box sx={{ pt: 2, px: 2 }}>
          <Alert severity="success" sx={{ maxWidth: 'sm', mx: 'auto', borderRadius: 2 }}>
            {message}
          </Alert>
        </Box>
      )}
      <Login />
    </Box>
  );
};

export default LoginPage;