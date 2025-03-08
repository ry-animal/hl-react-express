import express from 'express';
import { 
  recordMetric, 
  fetchMetrics, 
  fetchMetricsSummary,
  recordLog,
  fetchLogs
} from '../controllers/metricsController';

const router = express.Router();

// Record a new metric
router.post('/', recordMetric);

// Get all metrics (with pagination)
router.get('/', fetchMetrics);

// Get metrics summary for dashboard
router.get('/summary', fetchMetricsSummary);

// Record a new log
router.post('/logs', recordLog);

// Get logs (with pagination)
router.get('/logs', fetchLogs);

export default router; 