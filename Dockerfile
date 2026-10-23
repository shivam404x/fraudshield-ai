# FraudShield AI — Production Multi-Stage Container
# Bundles React 19 Frontend + FastAPI Machine Learning Backend

# Stage 1: Build React 19 Static Frontend
FROM node:20-slim AS frontend-builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: Runtime with Python 3.10 & Node.js
FROM python:3.10-slim AS runner
WORKDIR /app

# Install Node.js for the unified proxy server
RUN apt-get update && apt-get install -y --no-install-recommends \
    nodejs \
    npm \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Install Python ML dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application assets
COPY backend/ ./backend/
COPY scripts/ ./scripts/
COPY public/ ./public/
COPY server.cjs ./
COPY package.json ./
COPY README.md ./
COPY --from=frontend-builder /app/dist ./dist

# Environment variables
ENV NODE_ENV=production
ENV PORT=5000
ENV BACKEND_PORT=8000
ENV PYTHON_BIN=python

EXPOSE 5000

# Start unified gateway (Serves React + Spawns FastAPI)
CMD ["node", "server.cjs"]
