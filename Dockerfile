#Build Stage Start
#Specify a base image
FROM node:19-alpine AS builder

#Environment variable
ARG REACT_APP_NAVER_SECRET
ENV REACT_APP_NAVER_SECRET=${REACT_APP_NAVER_SECRET}

#Specify a working directory
WORKDIR '/app'

#Copy the dependencies file
COPY package.json .

#Install dependencies
RUN npm install --loglevel=error

#Copy remaining files
COPY . .

#Build the project for production
RUN npm run build

#Run Stage Start
FROM nginx:1.23.2-alpine

# RUN rm /etc/nginx/conf.d/default.conf
# COPY ./default.conf /etc/nginx/conf.d/default.conf

#Copy production build files from builder phase to nginx
COPY --from=builder /app/build /usr/share/nginx/html
