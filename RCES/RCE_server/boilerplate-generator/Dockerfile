FROM node:18-alpine

WORKDIR /RCE_system/RCES/RCE_server/boilerplate-generator

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install --only=production

# Copy source code
COPY . .

# Build the application (if you have a build step)
# RUN npm run build   # Uncomment if you actually have a build.js

# Create contest directory for generated files
RUN mkdir -p /RCE_system/RCES/RCE_server/boilerplate-generator/Contests

# Expose port if needed (e.g., 3000)
EXPOSE 3000

# Start the application
CMD ["npm", "start"]