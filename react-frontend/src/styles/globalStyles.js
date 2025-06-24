import { createGlobalStyle } from '@emotion/react';

export const GlobalStyles = createGlobalStyle`
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  html {
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    scroll-behavior: smooth;
  }

  body {
    font-family: 'Roboto', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Oxygen',
      'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
      sans-serif;
    line-height: 1.6;
    color: #333;
    background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
    min-height: 100vh;
  }

  #root {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }

  /* Scrollbar Styling */
  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  ::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.1);
    border-radius: 4px;
  }

  ::-webkit-scrollbar-thumb {
    background: linear-gradient(45deg, #667eea, #764ba2);
    border-radius: 4px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: linear-gradient(45deg, #5a6fd8, #6a4190);
  }

  /* Selection Styling */
  ::selection {
    background: rgba(102, 126, 234, 0.3);
    color: inherit;
  }

  ::-moz-selection {
    background: rgba(102, 126, 234, 0.3);
    color: inherit;
  }

  /* Focus Styling */
  button:focus,
  input:focus,
  textarea:focus,
  select:focus {
    outline: 2px solid #667eea;
    outline-offset: 2px;
  }

  /* Link Styling */
  a {
    color: #667eea;
    text-decoration: none;
    transition: color 0.2s ease;
  }

  a:hover {
    color: #764ba2;
    text-decoration: underline;
  }

  /* Animation Classes */
  .fade-in {
    animation: fadeIn 0.3s ease-in-out;
  }

  .slide-up {
    animation: slideUp 0.3s ease-out;
  }

  .scale-in {
    animation: scaleIn 0.2s ease-out;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  @keyframes slideUp {
    from {
      transform: translateY(20px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }

  @keyframes scaleIn {
    from {
      transform: scale(0.9);
      opacity: 0;
    }
    to {
      transform: scale(1);
      opacity: 1;
    }
  }

  /* Utility Classes */
  .glass-effect {
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.2);
  }

  .gradient-text {
    background: linear-gradient(45deg, #667eea, #764ba2);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .shadow-soft {
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  }

  .shadow-medium {
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
  }

  .shadow-hard {
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
  }

  /* Loading States */
  .loading-shimmer {
    background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
    background-size: 200% 100%;
    animation: shimmer 1.5s infinite;
  }

  @keyframes shimmer {
    0% {
      background-position: -200% 0;
    }
    100% {
      background-position: 200% 0;
    }
  }

  /* Responsive Design Helpers */
  @media (max-width: 768px) {
    .hide-mobile {
      display: none !important;
    }
  }

  @media (min-width: 769px) {
    .hide-desktop {
      display: none !important;
    }
  }

  /* Print Styles */
  @media print {
    body {
      background: white !important;
    }
    
    .no-print {
      display: none !important;
    }
  }
`;

export default GlobalStyles;