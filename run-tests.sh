#!/bin/bash

# Set colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}=======================================================${NC}"
echo -e "${BLUE}         Running Tests for Frontend and Backend        ${NC}"
echo -e "${BLUE}=======================================================${NC}"

# Run frontend tests
echo -e "\n${YELLOW}Running Frontend Tests...${NC}"
cd frontend
npm test
FRONTEND_EXIT=$?

# Run backend tests
echo -e "\n${YELLOW}Running Backend Tests...${NC}"
cd ../backend
npm test
BACKEND_EXIT=$?

# Print summary
echo -e "\n${BLUE}=======================================================${NC}"
echo -e "${BLUE}                     Test Summary                      ${NC}"
echo -e "${BLUE}=======================================================${NC}"

# Frontend summary
if [ $FRONTEND_EXIT -eq 0 ]; then
  echo -e "${GREEN}✓ Frontend Tests: Passed${NC}"
else
  echo -e "${RED}✗ Frontend Tests: Failed${NC}"
fi

# Backend summary
if [ $BACKEND_EXIT -eq 0 ]; then
  echo -e "${GREEN}✓ Backend Tests: Passed${NC}"
else
  echo -e "${RED}✗ Backend Tests: Failed${NC}"
fi

# Overall result
if [ $FRONTEND_EXIT -eq 0 ] && [ $BACKEND_EXIT -eq 0 ]; then
  echo -e "\n${GREEN}All tests have passed successfully!${NC}"
  exit 0
else
  echo -e "\n${RED}Some tests have failed. Please check the output above for details.${NC}"
  exit 1
fi 