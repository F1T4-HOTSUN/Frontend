# Build Stage Start
FROM node:19-alpine as builder

# Update curl & libcurl
RUN apk update && apk add --no-cache curl libcurl

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
FROM nginx:1.23.2-alpine

# Install latest curl in nginx stage too
RUN apk update && apk add --no-cache curl libcurl

# Copy production build files from builder phase to nginx
COPY --from=builder /app/build /usr/share/nginx/html
