// Re-export all styles for easy importing
export { default as theme } from './theme';
export { default as GlobalStyles } from './globalStyles';
export { default as components } from './components';
export * from './components';

// Theme variants
export const lightTheme = theme;

// You can add dark theme here in the future
export const darkTheme = {
  ...theme,
  palette: {
    ...theme.palette,
    mode: 'dark',
    background: {
      default: '#121212',
      paper: '#1e1e1e',
    },
    text: {
      primary: '#ffffff',
      secondary: '#b3b3b3',
    },
  },
};

// Export commonly used style utilities
export const styleUtils = {
  // Spacing helpers
  spacing: (factor) => `${factor * 8}px`,
  
  // Shadow utilities
  shadows: {
    soft: '0 4px 20px rgba(0, 0, 0, 0.1)',
    medium: '0 8px 30px rgba(0, 0, 0, 0.12)',
    hard: '0 12px 40px rgba(0, 0, 0, 0.15)',
  },
  
  // Border radius utilities
  borderRadius: {
    small: '8px',
    medium: '12px',
    large: '16px',
    xlarge: '24px',
    round: '50%',
  },
  
  // Z-index scale
  zIndex: {
    modal: 1300,
    overlay: 1200,
    dropdown: 1100,
    sticky: 1000,
    fixed: 999,
    fab: 950,
  },
  
  // Transition utilities
  transitions: {
    fast: '0.15s ease',
    normal: '0.3s ease',
    slow: '0.5s ease',
    bounce: '0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  },
};

// CSS-in-JS helper functions
export const cssHelpers = {
  // Flexbox helpers
  flexCenter: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  flexBetween: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  
  flexColumn: {
    display: 'flex',
    flexDirection: 'column',
  },
  
  // Grid helpers
  gridCenter: {
    display: 'grid',
    placeItems: 'center',
  },
  
  // Text helpers
  textEllipsis: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  
  // Glass morphism effect
  glassMorphism: {
    background: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
  },
  
  // Gradient text
  gradientText: {
    background: 'linear-gradient(45deg, #667eea, #764ba2)',
    backgroundClip: 'text',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
};

// Media query helpers
export const mediaQueries = {
  mobile: '@media (max-width: 768px)',
  tablet: '@media (max-width: 1024px)',
  desktop: '@media (min-width: 1025px)',
  retina: '@media (-webkit-min-device-pixel-ratio: 2)',
};

export default {
  theme,
  lightTheme,
  darkTheme,
  GlobalStyles,
  components,
  styleUtils,
  cssHelpers,
  mediaQueries,
};