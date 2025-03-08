# Use Node.js as the base image
FROM node:20-alpine as build

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY frontend/package*.json ./frontend/
COPY backend/package*.json ./backend/

# Install dependencies
RUN npm install && \
    cd frontend && npm install && \
    cd ../backend && npm install

# Copy source code
COPY . .

# Build frontend
WORKDIR /app/frontend
RUN npm run build

# Build backend
WORKDIR /app/backend
RUN npm run build

# Production stage
FROM node:20-alpine

WORKDIR /app

# Copy built files and dependencies
COPY --from=build /app/backend/dist ./dist
COPY --from=build /app/backend/package*.json ./
COPY --from=build /app/frontend/dist ./public

# Install production dependencies only
RUN npm install --omit=dev

# Create volume for SQLite database
VOLUME /app/data

# Set environment variables
ENV NODE_ENV production
ENV PORT 3000

# Expose port
EXPOSE 3000

# Start command
CMD ["node", "dist/index.js"] 