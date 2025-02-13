# Build Stage Start
FROM node:20-bullseye as builder  # Debian 기반 Node.js 사용

# Update curl & libcurl
RUN apt update && apt install -y curl libcurl4

# Specify a working directory
WORKDIR '/app'

# Copy the dependencies file
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install --loglevel=error

# Copy remaining files
COPY . .

# Build the project for production
RUN npm run build

# Run Stage Start
FROM nginx:1.25  # Debian 기반 Nginx 사용

# Update curl & libcurl in nginx stage too
RUN apt update && apt install -y curl libcurl4

# Copy production build files from builder phase to nginx
COPY --from=builder /app/build /usr/share/nginx/html
