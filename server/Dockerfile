FROM node:18-alpine AS build

# Set the working directory
WORKDIR /usr/src/app

# Install dependencies required for bcrypt
RUN apk add --no-cache python3 make g++ bash

# Copy package.json and install dependencies
COPY package.json package-lock.json ./
RUN npm install --prod

# Copy the rest of the application files
COPY . .

# Expose the port the app runs on
EXPOSE 3000

# Start the application
CMD ["node", "app.js"]



# FROM node:18-alpine AS build


# WORKDIR /usr/src/app


# COPY package.json ./


# RUN npm install --frozen-lockfile --prod


# COPY . .


# EXPOSE 3000


# CMD ["node", "app.js"]