import { styled } from '@mui/material/styles';
import { Card, Button, TextField, Box, Paper } from '@mui/material';

// Styled Components for reusable UI elements

export const GradientCard = styled(Card)(({ theme }) => ({
  background: 'linear-gradient(145deg, #ffffff, #f8fafc)',
  borderRadius: theme.spacing(2),
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 8px 30px rgba(0, 0, 0, 0.15)',
  },
}));

export const GradientButton = styled(Button)(({ theme }) => ({
  background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
  color: 'white',
  borderRadius: theme.spacing(1.5),
  fontWeight: 600,
  padding: theme.spacing(1, 3),
  boxShadow: '0 3px 15px rgba(102, 126, 234, 0.3)',
  textTransform: 'none',
  transition: 'all 0.3s ease',
  '&:hover': {
    background: 'linear-gradient(45deg, #5a6fd8 30%, #6a4190 90%)',
    boxShadow: '0 6px 25px rgba(102, 126, 234, 0.4)',
    transform: 'translateY(-2px)',
  },
  '&:active': {
    transform: 'translateY(0)',
  },
  '&:disabled': {
    background: theme.palette.grey[300],
    color: theme.palette.grey[500],
    boxShadow: 'none',
  },
}));

export const GlassTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    background: 'rgba(255, 255, 255, 0.8)',
    backdropFilter: 'blur(10px)',
    borderRadius: theme.spacing(1.5),
    border: '1px solid rgba(255, 255, 255, 0.2)',
    '&:hover': {
      background: 'rgba(255, 255, 255, 0.9)',
    },
    '&.Mui-focused': {
      background: 'rgba(255, 255, 255, 1)',
      boxShadow: '0 0 0 2px rgba(102, 126, 234, 0.2)',
    },
  },
}));

export const FloatingActionButton = styled(Button)(({ theme }) => ({
  position: 'fixed',
  bottom: theme.spacing(4),
  right: theme.spacing(4),
  borderRadius: '50%',
  width: 56,
  height: 56,
  minWidth: 'unset',
  background: 'linear-gradient(45deg, #667eea, #764ba2)',
  color: 'white',
  boxShadow: '0 4px 20px rgba(102, 126, 234, 0.4)',
  zIndex: 1000,
  '&:hover': {
    background: 'linear-gradient(45deg, #5a6fd8, #6a4190)',
    boxShadow: '0 6px 30px rgba(102, 126, 234, 0.5)',
    transform: 'scale(1.1)',
  },
  '&:active': {
    transform: 'scale(0.95)',
  },
}));

export const PhotoContainer = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
  gap: theme.spacing(2),
  padding: theme.spacing(2),
  [theme.breakpoints.down('sm')]: {
    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
    gap: theme.spacing(1.5),
    padding: theme.spacing(1.5),
  },
  [theme.breakpoints.down('xs')]: {
    gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
    gap: theme.spacing(1),
    padding: theme.spacing(1),
  },
}));

export const PhotoCard = styled(Card)(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.spacing(2),
  overflow: 'hidden',
  background: 'linear-gradient(145deg, #ffffff, #f8fafc)',
  boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  cursor: 'pointer',
  '&:hover': {
    transform: 'translateY(-8px) scale(1.02)',
    boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15)',
  },
  '&:active': {
    transform: 'translateY(-4px) scale(1.01)',
  },
}));

export const FolderCard = styled(Card)(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.spacing(2),
  overflow: 'hidden',
  background: 'linear-gradient(145deg, #ffffff, #f8fafc)',
  boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
  transition: 'all 0.3s ease',
  cursor: 'pointer',
  '&:hover': {
    transform: 'translateY(-6px)',
    boxShadow: '0 10px 35px rgba(0, 0, 0, 0.15)',
  },
}));

export const StatsCard = styled(Card)(({ theme }) => ({
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  color: 'white',
  borderRadius: theme.spacing(2),
  padding: theme.spacing(3),
  textAlign: 'center',
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(10px)',
    pointerEvents: 'none',
  },
}));

export const SearchContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  maxWidth: 500,
  margin: '0 auto',
  '& .MuiTextField-root': {
    '& .MuiOutlinedInput-root': {
      borderRadius: theme.spacing(3),
      background: 'rgba(255, 255, 255, 0.9)',
      backdropFilter: 'blur(20px)',
      border: '1px solid rgba(255, 255, 255, 0.3)',
      '&:hover': {
        background: 'rgba(255, 255, 255, 1)',
        border: '1px solid rgba(102, 126, 234, 0.3)',
      },
      '&.Mui-focused': {
        background: 'rgba(255, 255, 255, 1)',
        border: '2px solid #667eea',
      },
    },
  },
}));

export const LoadingOverlay = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: 'rgba(255, 255, 255, 0.8)',
  backdropFilter: 'blur(5px)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 1000,
  borderRadius: 'inherit',
}));

export const ErrorContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  textAlign: 'center',
  background: 'linear-gradient(145deg, #ffebee, #ffcdd2)',
  border: '1px solid #ef5350',
  borderRadius: theme.spacing(2),
  color: '#c62828',
}));

export const SuccessContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  textAlign: 'center',
  background: 'linear-gradient(145deg, #e8f5e8, #c8e6c9)',
  border: '1px solid #4caf50',
  borderRadius: theme.spacing(2),
  color: '#2e7d32',
}));

export const Modal = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  background: 'white',
  borderRadius: theme.spacing(3),
  boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
  padding: theme.spacing(4),
  maxWidth: '90vw',
  maxHeight: '90vh',
  overflow: 'auto',
  outline: 'none',
}));

export const BackgroundOverlay = styled(Box)(() => ({
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: 'rgba(0, 0, 0, 0.5)',
  backdropFilter: 'blur(5px)',
  zIndex: 1300,
}));

// Animation keyframes
export const animations = {
  fadeIn: `
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
  `,
  slideUp: `
    @keyframes slideUp {
      from { 
        transform: translateY(30px); 
        opacity: 0; 
      }
      to { 
        transform: translateY(0); 
        opacity: 1; 
      }
    }
  `,
  scaleIn: `
    @keyframes scaleIn {
      from { 
        transform: scale(0.8); 
        opacity: 0; 
      }
      to { 
        transform: scale(1); 
        opacity: 1; 
      }
    }
  `,
  bounce: `
    @keyframes bounce {
      0%, 20%, 53%, 80%, 100% {
        transform: translate3d(0,0,0);
      }
      40%, 43% {
        transform: translate3d(0, -30px, 0);
      }
      70% {
        transform: translate3d(0, -15px, 0);
      }
      90% {
        transform: translate3d(0, -4px, 0);
      }
    }
  `,
  pulse: `
    @keyframes pulse {
      0% {
        transform: scale(1);
      }
      50% {
        transform: scale(1.05);
      }
      100% {
        transform: scale(1);
      }
    }
  `,
  shimmer: `
    @keyframes shimmer {
      0% {
        background-position: -200% 0;
      }
      100% {
        background-position: 200% 0;
      }
    }
  `,
};

// Responsive breakpoints helper
export const breakpoints = {
  xs: '@media (max-width: 599px)',
  sm: '@media (max-width: 959px)',
  md: '@media (max-width: 1279px)',
  lg: '@media (max-width: 1919px)',
  xl: '@media (min-width: 1920px)',
};

// Color palette
export const colors = {
  primary: {
    main: '#667eea',
    light: '#9fa8f5',
    dark: '#3b5998',
  },
  secondary: {
    main: '#764ba2',
    light: '#a875d1',
    dark: '#4a2c75',
  },
  gradients: {
    primary: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
    secondary: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
    glass: 'rgba(255, 255, 255, 0.1)',
  },
};

export default {
  GradientCard,
  GradientButton,
  GlassTextField,
  FloatingActionButton,
  PhotoContainer,
  PhotoCard,
  FolderCard,
  StatsCard,
  SearchContainer,
  LoadingOverlay,
  ErrorContainer,
  SuccessContainer,
  Modal,
  BackgroundOverlay,
  animations,
  breakpoints,
  colors,
};