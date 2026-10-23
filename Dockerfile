# Multi-stage production build for KRMU Vault Node.js Cloud Server
FROM node:20-alpine

WORKDIR /app

# Install all dependencies (including devDependencies required for Vite build)
COPY package*.json ./
RUN npm ci

# Copy project files
COPY . .

# Build static production assets into dist/
RUN npm run build

# Configure production environment
ENV NODE_ENV=production
ENV PORT=5000
EXPOSE 5000

# Start high-performance REST API and production server
CMD ["node", "server.cjs"]
