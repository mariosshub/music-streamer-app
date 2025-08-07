# Step 1: Build the React app
FROM node:18-alpine AS build

WORKDIR /app

# Install dependencies
COPY package*.json ./
COPY tsconfig*.json ./

RUN npm install

# Copy the source code
COPY . .

# Build the app
RUN npm run build

# Step 2: Serve the React app using a static server
FROM nginx:stable-alpine AS production

# copy the config settings file from the docker host, to the docker container
# this is for dealing with route handling issues
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy build files to NGINX HTML folder
COPY --from=build /app/dist /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Command to run NGINX
CMD ["nginx", "-g", "daemon off;"]