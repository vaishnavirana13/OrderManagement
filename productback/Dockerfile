# Use the official Node.js image
FROM node:18

# Set working directory
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy the rest of the app files
COPY . .

# Expose backend port
EXPOSE 4000

# Start the Node.js backend
CMD ["npm", "run", "dev"]
