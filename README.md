# Reuben's Brews Chatbot

- A full-stack application built with React, Express, and SQLite.
- [Reuben's Brews](https://reubensbrews.com/)

## Tech Stack

### Frontend

- React with TypeScript
- Vite as build tool
- Material UI for components
- TanStack Query for data fetching
- Axios for API requests

### Backend

- Node.js with Express
- TypeScript
- SQLite database
- Drizzle ORM for database operations

## Project Structure

The project follows a standard structure with separate frontend and backend directories:

```
project-root/
  ├── backend/         # Express.js backend
  │   ├── src/         # Source code
  │   │   ├── controllers/
  │   │   ├── routes/
  │   │   ├── db/      # Database related files
  │   │   ├── app.ts   # Express app setup
  │   │   ├── server.ts
  │   │   └── index.ts # Entry point
  │   └── ...
  │
  ├── frontend/        # React frontend
  │   ├── src/
  │   │   ├── components/
  │   │   ├── App.tsx
  │   │   └── ...
  │   └── ...
  │
  └── README.md
```

## Setup Instructions

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:

   ```
   cd backend
   ```

2. Install dependencies:

   ```
   npm install
   ```

3. Create a `.env` file with the following content:

   ```
   PORT=3000
   NODE_ENV=development
   ```

4. Initialize the database:

   ```
   npm run push:sqlite
   ```

5. Start the development server:
   ```
   npm run dev
   ```

### Frontend Setup

1. Navigate to the frontend directory:

   ```
   cd frontend
   ```

2. Install dependencies:

   ```
   npm install
   ```

3. Start the development server:

   ```
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

## API Endpoints

- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get a specific user by ID
- `POST /api/users` - Create a new user

## Development

### Backend

- Run `npm run dev` to start the development server with hot-reload
- Run `npm run build` to build for production
- Run `npm start` to start the production server

### Frontend

- Run `npm run dev` to start the development server
- Run `npm run build` to build for production
- Run `npm run preview` to preview the production build locally
# hl-react-express
