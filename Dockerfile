#Build Stage Start
#Specify a base image
FROM node:20-alpine as builder

#Environment variable
ARG REACT_APP_NAVER_SECRET
ENV REACT_APP_NAVER_SECRET=${REACT_APP_NAVER_SECRET}

#Specify a working directory
WORKDIR '/app'

#Install dependencies
RUN apt update && apt install -y curl
RUN npm install --loglevel=error

#Copy the dependencies file
COPY package.json package-lock.json ./

#Copy remaining files
COPY . .

# Verify node and npm versions
RUN node -v && npm -v

#Build the project for production
RUN npm run build

#Run Stage Start
FROM nginx:1.25-alpine

# RUN rm /etc/nginx/conf.d/default.conf
# COPY ./default.conf /etc/nginx/conf.d/default.conf

#Copy production build files from builder phase to nginx
COPY --from=builder /app/build /usr/share/nginx/html
