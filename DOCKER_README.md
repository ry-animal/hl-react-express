# Docker Setup for LLM React/Express Application

This document explains how to run the application using Docker and Docker Compose.

## Prerequisites

- Docker
- Docker Compose

## Running the Application

### Using Docker Compose (Recommended)

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd hl-react-express
   ```

2. Build and run the application:

   ```bash
   docker-compose up -d
   ```

3. Access the application:

   - Frontend: http://localhost:3000

4. Stop the application:
   ```bash
   docker-compose down
   ```

### Using Docker Directly

1. Build the Docker image:

   ```bash
   docker build -t llm-chatbot .
   ```

2. Run the container:
   ```bash
   docker run -p 3000:3000 -v llm-data:/app/data -d llm-chatbot
   ```

## Development Workflow

For development, it's recommended to run the application directly on your machine:

1. Install dependencies:

   ```bash
   npm install
   ```

2. Run both frontend and backend in development mode:
   ```bash
   npm run dev
   ```

## Docker Volumes

The application uses a Docker volume to persist SQLite database data:

- `sqlite-data`: Stores the SQLite database file

## Environment Variables

You can customize the application by setting the following environment variables:

- `NODE_ENV`: Set to 'production' by default
- `PORT`: The port on which the application runs (default: 3000)

Add these to the `environment` section in `docker-compose.yml` or pass them when running Docker directly:

```bash
docker run -p 3000:3000 -e PORT=4000 -v llm-data:/app/data -d llm-chatbot
```
