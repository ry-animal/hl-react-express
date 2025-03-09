#!/bin/bash

# Colors for console output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}=== Development Environment ===${NC}"
echo -e "${BLUE}Starting frontend and backend services...${NC}"
echo -e "${YELLOW}Frontend will be available at: http://localhost:5173${NC}"
echo -e "${YELLOW}Backend API will be available at: http://localhost:8000/api${NC}"
echo -e "${BLUE}Press Ctrl+C to stop all services${NC}"
echo ""

# Run the development script
npm run dev 