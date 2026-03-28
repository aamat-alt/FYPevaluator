# Docker configuration for Frontend
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy application
COPY . .

# Build the app
RUN npm run build

# Install serve to run the app
RUN npm install -g serve

# Expose port
EXPOSE 3000

# Run the application
CMD ["serve", "-s", "build", "-l", "3000"]
