# Development stage
FROM node:18-alpine as development

WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Expose port 5173 for Vite dev server
EXPOSE 5173

# # Command to run development server
# CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]

# # Build stage
# FROM node:18-alpine as build

# WORKDIR /app

# # Copy package.json and package-lock.json
# COPY package*.json ./

# # Install dependencies
# RUN npm install

# # Copy the rest of the application
# COPY . .

# # Build the application
# RUN npm run build

# # Production stage
# FROM nginx:alpine

# # Copy built assets from the build stage
# COPY --from=build /app/dist /usr/share/nginx/html

# # Add custom nginx configuration for SPA routing
# RUN echo 'server { \
#     listen 80; \
#     location / { \
#     root /usr/share/nginx/html; \
#     index index.html; \
#     try_files $uri $uri/ /index.html; \
#     } \
#     }' > /etc/nginx/conf.d/default.conf

# # Expose port 80
# EXPOSE 80

# # Start nginx
# CMD ["nginx", "-g", "daemon off;"]