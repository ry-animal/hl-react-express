import db from './databaseService';

interface MetricData {
  eventType: string;
  messageLength?: number;
  responseLength?: number;
  responseTime?: number;
  timestamp: string;
  model?: string;
  tokenCount?: number;
  estimatedCost?: number;
  extraData?: any;
}

interface LogData {
  requestType: string;
  userMessage?: string;
  aiResponse?: string;
  error?: string;
  timestamp: string;
}

/**
 * Save a metric record to the database
 */
export const saveMetric = (data: MetricData): number => {
  const stmt = db.prepare(`
    INSERT INTO metrics (
      event_type, 
      message_length, 
      response_length,
      response_time, 
      model,
      token_count,
      estimated_cost,
      timestamp, 
      extra_data
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  
  const info = stmt.run(
    data.eventType,
    data.messageLength || null,
    data.responseLength || null,
    data.responseTime || null,
    data.model || null,
    data.tokenCount || null,
    data.estimatedCost || null,
    data.timestamp,
    data.extraData ? JSON.stringify(data.extraData) : null
  );
  
  return info.lastInsertRowid as number;
};

/**
 * Save a log entry to the database
 */
export const saveLog = (data: LogData): number => {
  const stmt = db.prepare(`
    INSERT INTO logs (
      request_type,
      user_message,
      ai_response,
      error,
      timestamp
    ) VALUES (?, ?, ?, ?, ?)
  `);
  
  const info = stmt.run(
    data.requestType,
    data.userMessage || null,
    data.aiResponse || null,
    data.error || null,
    data.timestamp
  );
  
  return info.lastInsertRowid as number;
};

/**
 * Get metrics with pagination
 */
export const getMetrics = (limit = 100, offset = 0) => {
  const stmt = db.prepare(`
    SELECT * FROM metrics
    ORDER BY timestamp DESC
    LIMIT ? OFFSET ?
  `);
  
  return stmt.all(limit, offset);
};

/**
 * Get logs with pagination
 */
export const getLogs = (limit = 100, offset = 0) => {
  const stmt = db.prepare(`
    SELECT * FROM logs
    ORDER BY timestamp DESC
    LIMIT ? OFFSET ?
  `);
  
  return stmt.all(limit, offset);
};

/**
 * Get aggregated metrics summary for dashboard
 */
export const getMetricsSummary = () => {
  // Average response times
  const avgResponseTime = db.prepare(`
    SELECT AVG(response_time) as avg_response_time 
    FROM metrics 
    WHERE response_time IS NOT NULL
  `).get() as { avg_response_time: number | null };
  
  // Count by event type
  const eventCounts = db.prepare(`
    SELECT event_type, COUNT(*) as count 
    FROM metrics 
    GROUP BY event_type
  `).all();
  
  // Messages per day over time
  const messagesPerDay = db.prepare(`
    SELECT 
      SUBSTR(timestamp, 1, 10) as date, 
      COUNT(*) as count 
    FROM metrics 
    WHERE event_type IN ('chat_completion', 'stream_completion') 
    GROUP BY SUBSTR(timestamp, 1, 10)
    ORDER BY date
  `).all();
  
  // Token usage statistics
  const tokenStats = db.prepare(`
    SELECT 
      SUM(token_count) as total_tokens,
      AVG(token_count) as avg_tokens,
      MAX(token_count) as max_tokens,
      MIN(token_count) as min_tokens,
      COUNT(*) as count,
      SUM(estimated_cost) as total_cost
    FROM metrics
    WHERE token_count IS NOT NULL
  `).get() as { 
    total_tokens: number | null; 
    avg_tokens: number | null;
    max_tokens: number | null;
    min_tokens: number | null;
    count: number;
    total_cost: number | null;
  };
  
  return {
    avgResponseTime: avgResponseTime.avg_response_time || 0,
    eventCounts,
    messagesPerDay,
    tokenUsage: {
      totalTokens: tokenStats.total_tokens || 0,
      avgTokensPerRequest: tokenStats.avg_tokens || 0,
      totalCost: tokenStats.total_cost || 0
    }
  };
};