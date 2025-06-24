import React, { useState, useEffect } from 'react';
import {
  TextField,
  InputAdornment,
  IconButton,
  Box,
} from '@mui/material';
import { Search, Clear } from '@mui/icons-material';
import { debounce } from '../../utils/helpers';

const SearchBar = ({ onSearch, placeholder = "Search photos...", autoFocus = false }) => {
  const [query, setQuery] = useState('');

  // Debounced search function
  const debouncedSearch = debounce((searchQuery) => {
    onSearch(searchQuery);
  }, 300);

  useEffect(() => {
    debouncedSearch(query);
  }, [query, debouncedSearch]);

  const handleClear = () => {
    setQuery('');
  };

  return (
    <Box sx={{ width: '100%' }}>
      <TextField
        fullWidth
        variant="outlined"
        placeholder={placeholder}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        autoFocus={autoFocus}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Search color="action" />
            </InputAdornment>
          ),
          endAdornment: query && (
            <InputAdornment position="end">
              <IconButton onClick={handleClear} size="small">
                <Clear />
              </IconButton>
            </InputAdornment>
          ),
        }}
        sx={{
          '& .MuiOutlinedInput-root': {
            borderRadius: 3,
            background: 'rgba(255,255,255,0.8)',
            backdropFilter: 'blur(10px)',
          },
        }}
      />
    </Box>
  );
};

export default SearchBar;