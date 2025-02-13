# Build Stage Start
FROM node:20-alpine as builder

# Install dependencies
RUN apk update && apk add --no-cache curl

# Work directory
WORKDIR '/app'

# Copy dependencies file
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install --loglevel=error

# Copy remaining files
COPY . .

# Build the project
RUN npm run build

# Run Stage Start
FROM nginx:1.25-alpine

# Copy production build files from builder phase to nginx
COPY --from=builder /app/build /usr/share/nginx/html
