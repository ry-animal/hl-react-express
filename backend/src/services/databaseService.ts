import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

// Determine database path based on environment
const DB_PATH = process.env.NODE_ENV === 'production'
  ? path.join('/app/data', 'db.sqlite')
  : path.join(__dirname, '../../db.sqlite');

// Ensure the directory exists
const dbDir = path.dirname(DB_PATH);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const db = new Database(DB_PATH);

// Initialize the database schema
const initializeDatabase = () => {
  // Create metrics table
  db.exec(`
    CREATE TABLE IF NOT EXISTS metrics (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      event_type TEXT NOT NULL,
      message_length INTEGER,
      response_length INTEGER,
      response_time INTEGER,
      model TEXT,
      token_count INTEGER,
      estimated_cost REAL,
      timestamp TEXT NOT NULL,
      extra_data TEXT
    )
  `);

  // Create logs table
  db.exec(`
    CREATE TABLE IF NOT EXISTS logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      request_type TEXT NOT NULL,
      user_message TEXT,
      ai_response TEXT,
      error TEXT,
      timestamp TEXT NOT NULL
    )
  `);

  // Create dashboard_stats table
  db.exec(`
    CREATE TABLE IF NOT EXISTS dashboard_stats (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      stat_name TEXT NOT NULL UNIQUE,
      stat_value TEXT NOT NULL,
      last_updated TEXT NOT NULL
    )
  `);
  
  console.log(`Database initialized at ${DB_PATH}`);
};

// Initialize on startup
initializeDatabase();

export default db; 