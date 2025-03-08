import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';

// Metrics table for tracking usage
export const metrics = sqliteTable('metrics', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  eventType: text('event_type').notNull(), // 'chat_completion', 'error', etc.
  messageLength: integer('message_length'),
  responseLength: integer('response_length'),
  responseTime: integer('response_time'), // in milliseconds
  model: text('model'), // e.g., 'gpt-3.5-turbo'
  tokenCount: integer('token_count'), // estimated token usage
  estimatedCost: real('estimated_cost'), // if applicable
  timestamp: text('timestamp').notNull().$defaultFn(() => new Date().toISOString()),
  extraData: text('extra_data'), // JSON stringified additional data
});

// Logs table for detailed request/response tracking
export const logs = sqliteTable('logs', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  requestType: text('request_type').notNull(), // 'chat', 'stream', etc.
  userMessage: text('user_message'), // question asked (can be anonymized)
  aiResponse: text('ai_response'), // response given (can be anonymized)
  error: text('error'), // error message if any
  timestamp: text('timestamp').notNull().$defaultFn(() => new Date().toISOString()),
});

// Dashboard stats table for caching aggregated metrics
export const dashboardStats = sqliteTable('dashboard_stats', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  statName: text('stat_name').notNull().unique(), // e.g., 'total_requests', 'avg_response_time'
  statValue: text('stat_value').notNull(),
  lastUpdated: text('last_updated').notNull().$defaultFn(() => new Date().toISOString()),
});
