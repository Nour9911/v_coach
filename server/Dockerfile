# Use the official Node.js 14 image as a base image
FROM node:14

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

RUN npm install bcrypt

# Copy the rest of the application code to the working directory
COPY . .

# Expose the port that your app runs on
EXPOSE 3000

# Run knex migrations and start the Node.js server
CMD ["npm", "run", "migrate:latest", "&&", "node", "server.js"]