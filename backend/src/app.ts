import path from 'path';

import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';

import chatRoutes from './routes/chatRoutes';
import metricsRoutes from './routes/metricsRoutes';
import breweryRoutes from './routes/breweryRoutes';

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Determine the static files path
const staticPath =
  process.env.NODE_ENV === 'production'
    ? path.join(process.cwd(), 'public') // In Docker: /app/public
    : path.join(__dirname, '../public'); // In development: ../public

// Serve static files from the determined path
app.use(express.static(staticPath));

// API routes
app.use('/api/chat', chatRoutes);
app.use('/api/metrics', metricsRoutes);
app.use('/api/breweries', breweryRoutes);

// Default route for API
app.get('/api', (req, res) => {
  res.json({ message: 'API is running' });
});

// Serve React app in production
if (process.env.NODE_ENV === 'production') {
  app.get('*', (req, res) => {
    res.sendFile(path.join(staticPath, 'index.html'));
  });
}

export default app;
