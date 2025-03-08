import fs from 'fs';
import path from 'path';

import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';

import * as schema from './schema';

// Determine database path - use data directory for Docker environment
const DB_PATH =
  process.env.NODE_ENV === 'production'
    ? path.join('/app/data', 'db.sqlite')
    : path.join(__dirname, '../../db.sqlite');

// Ensure data directory exists
const dbDir = path.dirname(DB_PATH);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

// Initialize database connection
export const initDb = async () => {
  try {
    const sqlite = new Database(DB_PATH);

    const db = drizzle(sqlite, { schema });
    console.log(`Database connection established at ${DB_PATH}`);
    return db;
  } catch (error) {
    console.error('Failed to connect to the database:', error);
    throw error;
  }
};

// Export a promise that resolves to the database connection
export const dbPromise = initDb();

// Helper function to get the database connection
export const getDb = async () => {
  return await dbPromise;
};
