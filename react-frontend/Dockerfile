# 🏗️ Build Stage
FROM node:20-alpine AS build

WORKDIR /app

# Copy package files first to leverage Docker cache
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the app source
COPY . .

# Build the React app
RUN npm run build

# 📦 Production Stage
FROM nginx:alpine

# Remove default nginx website
RUN rm -rf /usr/share/nginx/html/*

# Copy built static files from previous stage
COPY --from=build /app/build /usr/share/nginx/html

# Optional: Add custom Nginx config for single-page apps (SPA)
# COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Run Nginx in the foreground
CMD ["nginx", "-g", "daemon off;"]
