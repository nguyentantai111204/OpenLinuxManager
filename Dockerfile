# Stage 1: Build combined apps
FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies first (better caching)
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Build both client and server
RUN npx nx build client --prod
RUN npx nx build server --prod

# Stage 2: Runtime
FROM node:20-alpine

WORKDIR /app

# Copy built bundles from builder
COPY --from=builder /app/dist/apps ./dist/apps

# We need the generated package.json for the server to install only production deps
# In Nx, the build output for server usually includes a package.json if generatedPackageJson is true
COPY --from=builder /app/dist/apps/server/package*.json ./

# Install production dependencies for the server
RUN npm install --production

# Expose port
EXPOSE 3000

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3000

# Command to run the server
CMD ["node", "dist/apps/server/main.js"]
