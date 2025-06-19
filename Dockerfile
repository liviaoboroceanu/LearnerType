# Stage 1: Build the application
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install only production dependencies
RUN npm ci --production --ignore-scripts

# Copy application source code
COPY . .

# Stage 2: Create a lean production image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy only necessary files from builder stage
COPY --from=builder /app ./

# Expose the port the app runs on
EXPOSE 3000

# Define the command to run the app
CMD ["npm", "start"]