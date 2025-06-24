# Build stage
FROM node:20-alpine AS build
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Ensure binaries are executable (fix for some environments)
RUN chmod -R 755 node_modules/.bin

# Build the app
RUN npm run build

# Production stage
FROM nginx:alpine
# Copy built static files to Nginx's default public directory
COPY --from=build /app/build /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start Nginx server
CMD ["nginx", "-g", "daemon off;"]
