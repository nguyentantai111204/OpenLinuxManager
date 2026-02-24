# Stage 1: Build combined apps
FROM node:20-slim AS builder

WORKDIR /app

# Install build dependencies
RUN apt-get update && apt-get install -y \
    python3 \
    make \
    g++ \
    && rm -rf /var/lib/apt/lists/*

# Install dependencies first (better caching)
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Build both client and server
RUN npx nx build client --prod
RUN npx nx build server --prod

# Stage 2: Runtime
FROM node:20-slim

WORKDIR /app

# Install runtime dependencies for system management
RUN apt-get update && apt-get install -y \
    sudo \
    bash \
    shadow-utils \
    procps \
    && rm -rf /var/lib/apt/lists/* || true
# Note: shadow-utils is 'shadow' in debian-based, and we need it for useradd/userdel
# In debian, it's usually pre-installed or part of passwd/base-passwd, but ensuring it's there.
RUN apt-get update && apt-get install -y passwd || true

# Copy built bundles from builder
COPY --from=builder /app/dist/apps ./dist/apps

# Copy package files to install production deps
COPY --from=builder /app/dist/apps/server/package*.json ./

# Install production dependencies for the server (specifically for the built package)
# node-pty needs to be rebuilt for the runtime environment
RUN npm install --production

# Expose port
EXPOSE 3000

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3000

# Command to run the server
CMD ["node", "dist/apps/server/main.js"]
