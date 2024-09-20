# Use Node.js base image
FROM node:18-alpine

# Set the timezone to GMT+3
ENV TZ=Etc/GMT-3

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of your application code
COPY . .

# Expose port 3000 to the outside world
EXPOSE 3000

# Command to run your NestJS app
CMD ["npm", "run", "start:dev"]
