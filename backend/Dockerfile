# Stage 1: Build the application
FROM node:18 AS build

WORKDIR /app

# Install dependencies
COPY package*.json ./
COPY tsconfig*.json ./

# Install dependencies
RUN npm install

# Bundle app source
COPY . .

# Build the app
RUN npm run build

# Expose the port
EXPOSE 3000

# Command to run the app
CMD ["node", "dist/main"]