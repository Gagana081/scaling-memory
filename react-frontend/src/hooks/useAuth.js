import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';

export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};

// Additional custom hooks for auth-related functionality
export const useAuthStatus = () => {
  const { user, loading } = useAuth();
  
  return {
    isAuthenticated: !!user,
    isLoading: loading,
    user,
  };
};

export const useRequireAuth = () => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return { loading: true, authenticated: false };
  }
  
  if (!user) {
    return { loading: false, authenticated: false };
  }
  
  return { loading: false, authenticated: true, user };
};

// Hook for checking if user has specific permissions (future enhancement)
export const usePermissions = () => {
  const { user } = useAuth();
  
  const hasPermission = (permission) => {
    if (!user) return false;
    // Add your permission logic here
    return user.is_superuser || user.permissions?.includes(permission);
  };
  
  const isAdmin = () => {
    return user?.is_superuser || user?.is_staff;
  };
  
  return {
    hasPermission,
    isAdmin,
  };
};