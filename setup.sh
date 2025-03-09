#!/bin/bash

# Colors for console output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}=== Setting up Development Environment ===${NC}"

# Install root dependencies
echo -e "${BLUE}Installing root dependencies...${NC}"
npm install

# Install frontend dependencies
echo -e "${BLUE}Installing frontend dependencies...${NC}"
cd frontend && npm install --legacy-peer-deps && \
cd ..

# Install backend dependencies
echo -e "${BLUE}Installing backend dependencies...${NC}"
cd backend && npm install
cd ..

# Initialize database if needed
echo -e "${BLUE}Setting up database...${NC}"
cd backend
if [ -f "push:sqlite" ]; then
  npm run push:sqlite
fi
cd ..

echo -e "${GREEN}=== Setup Complete! ===${NC}"
echo -e "${YELLOW}Run ./dev.sh to start the development environment${NC}"
echo -e "${YELLOW}Or run npm run dev ${NC}" 