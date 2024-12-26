# Use the official Node.js image
FROM node:18

# Set working directory
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy the rest of the app files
COPY . .

# Expose frontend port
EXPOSE 5173

# Start the React app
CMD ["npm", "run", "dev"]
