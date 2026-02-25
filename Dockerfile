# Stage 1: Build combined apps
FROM node:20-slim AS builder

WORKDIR /app

# Install build dependencies for native modules (node-pty)
RUN apt-get update && apt-get install -y \
    python3 \
    make \
    g++ \
    && rm -rf /var/lib/apt/lists/*

# Install all dependencies
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Build both client and server
RUN npx nx build client --prod
RUN npx nx build server --prod

# Prune dev dependencies to keep only production modules for the runtime stage
RUN npm prune --production

# Stage 2: Runtime
FROM node:20-slim

WORKDIR /app

# Install runtime dependencies for system management
RUN apt-get update && apt-get install -y \
    sudo \
    bash \
    passwd \
    python3 \
    procps \
    && rm -rf /var/lib/apt/lists/*

# Copy production node_modules from builder
COPY --from=builder /app/node_modules ./node_modules

# Copy built bundles from builder
COPY --from=builder /app/dist/apps ./dist/apps

# Expose port
EXPOSE 3000

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3000

# Command to run the server
CMD ["node", "dist/apps/server/main.js"]
