# Development Scripts

This README explains the available scripts for development and their usage.

## Quick Start

To get up and running quickly:

1. Run the setup script to install all dependencies:

   ```bash
   ./setup.sh
   ```

2. Start the development environment:
   ```bash
   ./dev.sh
   ```

## npm Scripts

The following npm scripts are available at the root level:

### Development

- `npm run dev` - Run both frontend and backend in development mode
- `npm run dev:frontend` - Run only the frontend in development mode
- `npm run dev:backend` - Run only the backend in development mode

### Installation

- `npm run setup` - Install all dependencies (root, frontend, and backend)
- `npm run install:frontend` - Install frontend dependencies
- `npm run install:backend` - Install backend dependencies

### Build

- `npm run build` - Build both frontend and backend for production
- `npm run build:frontend` - Build only the frontend for production
- `npm run build:backend` - Build only the backend for production

### Production

- `npm run start` - Start the production server (after building)

### Docker

- `npm run docker:up` - Start the Docker container
- `npm run docker:down` - Stop the Docker container
- `npm run docker:build` - Rebuild and start the Docker container
- `npm run docker:logs` - Show logs from the Docker container

## Shell Scripts

For ease of use, the following shell scripts are provided:

- `./setup.sh` - Set up the development environment
- `./dev.sh` - Run the development environment

## Access Points

- Frontend: http://localhost:5173
- Backend API: http://localhost:3000/api
- Docker container: http://localhost:3000
