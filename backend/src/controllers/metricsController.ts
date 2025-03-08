import { Request, Response } from 'express';
import { saveMetric, getMetrics, getMetricsSummary, getLogs, saveLog } from '../services/metricsService';
import db from '../services/databaseService';

export const recordMetric = (req: Request, res: Response): void => {
  try {
    const metricData = req.body;
    
    if (!metricData.eventType || !metricData.timestamp) {
      res.status(400).json({ error: 'Missing required fields' });
      return;
    }
    
    const id = saveMetric({
      eventType: metricData.eventType,
      messageLength: metricData.messageLength,
      responseLength: metricData.responseLength,
      responseTime: metricData.responseTime,
      timestamp: metricData.timestamp,
      model: metricData.model,
      tokenCount: metricData.tokenCount,
      estimatedCost: metricData.estimatedCost,
      extraData: metricData.extraData
    });
    
    res.status(201).json({ id });
  } catch (error) {
    console.error('Error recording metric:', error);
    res.status(500).json({ error: 'Failed to record metric' });
  }
};

export const recordLog = (req: Request, res: Response): void => {
  try {
    const logData = req.body;
    
    if (!logData.requestType || !logData.timestamp) {
      res.status(400).json({ error: 'Missing required fields' });
      return;
    }
    
    const id = saveLog({
      requestType: logData.requestType,
      userMessage: logData.userMessage,
      aiResponse: logData.aiResponse,
      error: logData.error,
      timestamp: logData.timestamp
    });
    
    res.status(201).json({ id });
  } catch (error) {
    console.error('Error recording log:', error);
    res.status(500).json({ error: 'Failed to record log' });
  }
};

export const fetchMetrics = (req: Request, res: Response): void => {
  try {
    const limit = parseInt(req.query.limit as string) || 100;
    const offset = parseInt(req.query.offset as string) || 0;
    
    const metrics = getMetrics(limit, offset);
    // Get total count for pagination
    const totalResult = db.prepare('SELECT COUNT(*) as count FROM metrics').get() as { count: number };
    
    res.json({ metrics, total: totalResult.count });
  } catch (error) {
    console.error('Error fetching metrics:', error);
    res.status(500).json({ error: 'Failed to fetch metrics' });
  }
};

export const fetchLogs = (req: Request, res: Response): void => {
  try {
    const limit = parseInt(req.query.limit as string) || 100;
    const offset = parseInt(req.query.offset as string) || 0;
    
    const logs = getLogs(limit, offset);
    // Get total count for pagination
    const totalResult = db.prepare('SELECT COUNT(*) as count FROM logs').get() as { count: number };
    
    res.json({ logs, total: totalResult.count });
  } catch (error) {
    console.error('Error fetching logs:', error);
    res.status(500).json({ error: 'Failed to fetch logs' });
  }
};

export const fetchMetricsSummary = (req: Request, res: Response): void => {
  try {
    const summary = getMetricsSummary();
    res.json(summary);
  } catch (error) {
    console.error('Error fetching metrics summary:', error);
    res.status(500).json({ error: 'Failed to fetch metrics summary' });
  }
}; 