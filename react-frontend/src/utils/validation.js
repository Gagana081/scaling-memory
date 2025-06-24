export const validateLoginForm = (data) => {
  const errors = {};

  if (!data.username) {
    errors.username = 'Username is required';
  } else if (data.username.length < 3) {
    errors.username = 'Username must be at least 3 characters';
  }

  if (!data.password) {
    errors.password = 'Password is required';
  } else if (data.password.length < 8) {
    errors.password = 'Password must be at least 8 characters';
  }

  return {
    errors,
    isValid: Object.keys(errors).length === 0,
  };
};

export const validateRegisterForm = (data) => {
  const errors = {};

  if (!data.username) {
    errors.username = 'Username is required';
  } else if (data.username.length < 3) {
    errors.username = 'Username must be at least 3 characters';
  } else if (!/^[a-zA-Z0-9_]+$/.test(data.username)) {
    errors.username = 'Username can only contain letters, numbers, and underscores';
  }

  if (!data.email) {
    errors.email = 'Email is required';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.email = 'Please enter a valid email address';
  }

  if (!data.password) {
    errors.password = 'Password is required';
  } else if (data.password.length < 8) {
    errors.password = 'Password must be at least 8 characters';
  } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(data.password)) {
    errors.password = 'Password must contain at least one uppercase letter, one lowercase letter, and one number';
  }

  if (!data.password_confirm) {
    errors.password_confirm = 'Please confirm your password';
  } else if (data.password !== data.password_confirm) {
    errors.password_confirm = 'Passwords do not match';
  }

  return {
    errors,
    isValid: Object.keys(errors).length === 0,
  };
};

export const validateFolderForm = (data) => {
  const errors = {};

  if (!data.name) {
    errors.name = 'Folder name is required';
  } else if (data.name.length < 1) {
    errors.name = 'Folder name cannot be empty';
  } else if (data.name.length > 100) {
    errors.name = 'Folder name cannot exceed 100 characters';
  } else if (!/^[a-zA-Z0-9\s_-]+$/.test(data.name)) {
    errors.name = 'Folder name can only contain letters, numbers, spaces, hyphens, and underscores';
  }

  return {
    errors,
    isValid: Object.keys(errors).length === 0,
  };
};

export const validatePhotoUpload = (files) => {
  const errors = [];
  const maxSize = 10 * 1024 * 1024; // 10MB
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

  files.forEach((file, index) => {
    if (!allowedTypes.includes(file.type)) {
      errors.push(`File ${index + 1}: Only JPEG, PNG, GIF, and WebP images are allowed`);
    }

    if (file.size > maxSize) {
      errors.push(`File ${index + 1}: File size must be less than 10MB`);
    }

    if (!file.name || file.name.trim() === '') {
      errors.push(`File ${index + 1}: File must have a name`);
    }
  });

  return {
    errors,
    isValid: errors.length === 0,
  };
};