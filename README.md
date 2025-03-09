# Reuben's Brews Chatbot

- A full-stack application built with React, Express, and SQLite.
- Features an AI-powered chatbot with OpenAI integration and metrics dashboard geared towards serving Reuben's Brews.
- [Reuben's Brews](https://reubensbrews.com/)

## Tech Stack

### Frontend

- React with TypeScript
- Vite as build tool
- Material UI for components
- TanStack Query for data fetching
- TanStack Table for interactive data tables
- Recharts for data visualization
- Zod for runtime type validation

### Backend

- Node.js with Express
- TypeScript
- SQLite database for metrics storage
- OpenAI API integration for chat capabilities
- Server-Sent Events (SSE) for streaming responses

## Project Structure

The project follows a standard structure with separate frontend and backend directories:

```
project-root/
  ├── backend/         # Express.js backend
  │   ├── src/         # Source code
  │   │   ├── controllers/
  │   │   ├── routes/
  │   │   ├── services/  # Business logic and database services
  │   │   ├── utils/     # Helper functions including OpenAI service
  │   │   ├── app.ts     # Express app setup
  │   │   └── index.ts   # Entry point
  │   └── ...
  │
  ├── frontend/        # React frontend
  │   ├── src/
  │   │   ├── components/
  │   │   ├── services/  # API services
  │   │   ├── store/     # State management
  │   │   ├── App.tsx
  │   │   └── ...
  │   └── ...
  │
  └── README.md
```

## Features

- AI-Powered Chatbot: Contextual conversations using OpenAI's GPT models
- Real-time Streaming: See responses as they're generated
- Metrics Dashboard: Track usage and performance with interactive charts
- Database Storage: Persistent SQLite storage for metrics data
- Zod Validation: Runtime type safety across frontend and backend
- Docker Support: Containerized deployment with persistent storage

## Setup Instructions

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- OpenAI API key

## EZ App Dev

- ./setup.sh
- ./run-tests.sh
- ./dev.sh

### Backend Setup

- Navigate to the backend directory:

  `cd backend`

- Create a .env file with the following content:

  ```
  PORT=3000
  NODE_ENV=development
  OPENAI_API_KEY=your_openai_api_key_here
  ```

- Install dependencies:

  `npm install`

- Run DB migrations

  `npm run push:sqlite`

- Start the development server:

  `npm run dev`

### Frontend Setup

- Navigate to the frontend directory:

  `cd frontend`

- Install dependencies:

  `npm install`

- Start the development server:

  `npm run dev`

- Open your browser and navigate to http://localhost:5173

## API Endpoints

### Chat Endpoints

- POST /api/chat - Send a message to the chatbot
- POST /api/chat/stream - Stream a response from the chatbot

### Metrics Endpoints

- GET /api/metrics/summary - Get metrics summary for dashboard
- GET /api/metrics - Get detailed metrics with pagination

## Development

### Backend

- Run `npm run dev` to start the development server with hot-reload
- Run `npm run build` to build for production
- Run `npm start` to start the production server

### Frontend

- Run `npm run dev` to start the development server
- Run `npm run build` to build for production
- Run `npm run preview` to preview the production build locally

## Docker Deployment

- Build and start containers, make sure to create a .env from the .env.sample in /backend

  ```bash
  docker-compose up -d --build
  ```

- View logs

  ```bash
  npm run docker:logs
  ```

- Stop containers

  ```bash
  npm run docker:down
  ```

## Running Tests

The project includes tests for both frontend and backend. You can run them separately or together using the following npm scripts:

### Run All Tests

```bash
# Run tests for both frontend and backend in parallel
npm test

# Run tests with a nicely formatted summary
npm run test:summary
```

### Run Tests for a Specific Part

```bash
# Run only frontend tests
npm run test:frontend

# Run only backend tests
npm run test:backend
```

### Watch Mode

To run tests in watch mode (tests rerun when files change):

```bash
# Watch mode for both frontend and backend
npm run test:watch

# Watch mode for frontend only
npm run test:watch:frontend

# Watch mode for backend only
npm run test:watch:backend
```

### Coverage Reports

To generate test coverage reports:

```bash
# Generate coverage reports for both frontend and backend
npm run test:coverage

# Generate coverage report for frontend only
npm run test:coverage:frontend

# Generate coverage report for backend only
npm run test:coverage:backend
```
