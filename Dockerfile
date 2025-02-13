# Build Stage Start
FROM node:20-alpine as builder

# Update packages and install dependencies including curl and libcurl
RUN apk update && apk add --no-cache curl libcurl

# Set the working directory
WORKDIR '/app'

# Copy dependencies files
COPY package.json package-lock.json ./

# Install dependencies with verbose output to help diagnose errors
RUN npm install --loglevel=verbose

# Copy remaining files
COPY . .

# Build the project
RUN npm run build

# Run Stage Start
FROM nginx:1.25-alpine

# Copy production build files from builder phase to nginx
COPY --from=builder /app/build /usr/share/nginx/html
