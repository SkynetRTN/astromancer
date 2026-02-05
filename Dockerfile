# Use a specific node version for stability
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /skynet/astromancer

# Install Angular CLI globally inside the container
# This allows us to run 'ng' commands directly
RUN npm install -g @angular/cli

# Install Python, and build tools (make, g++) for node-gyp
RUN apk add --no-cache python3 py3-pip make g++ bash

# Copy only package files first to leverage Docker cache
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the code (though volumes will override this in dev)
COPY . .

# Expose the default Angular port
EXPOSE 4201

# Start the app with specific flags for Docker compatibility:
# --host 0.0.0.0: Allows access from outside the container (e.g., your browser)
# --poll 2000: Checks for file changes every 2000ms (essential for hot reload in Docker)
# --disable-host-check: Prevents "Invalid Host Header" errors
CMD ["ng", "serve", "--host", "0.0.0.0", "--poll", "2000"]
