# Use Node.js as the base image
FROM node:18

# Create a working directory for the app
WORKDIR /app

# Copy the package.json and package-lock.json files into the container
COPY package*.json ./

# Install app dependencies
RUN npm install

# Copy the rest of the app code into the container
COPY . .

# Expose port 3000 (the port that the app listens on)
EXPOSE 3000

# Specify the command to run when the container starts
CMD [ "npm", "run", "start:dev" ]