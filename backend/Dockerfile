# Use official Node.js LTS image
FROM node:18

# Set working directory inside the container
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of your backend code
COPY . .

# Expose backend port
EXPOSE 3000

# Start the app
CMD ["node", "server.js"]
