import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { fetchMetricsSummary, fetchMetrics, fetchLogs } from '../services/metricsService';
import { Message } from '../store/useStore';

interface UseAppMetricsOptions {
  initialMetricsPage?: number;
  initialLogsPage?: number;
  pageSize?: number;
  autoRefreshInterval?: number | false;
}

/**
 * Custom hook for metrics data management
 * Combines react-query with dashboard metrics functionality
 */
export const useAppMetrics = (options: UseAppMetricsOptions = {}) => {
  const {
    initialMetricsPage = 0,
    initialLogsPage = 0,
    pageSize = 10,
    autoRefreshInterval = false
  } = options;

  const [metricsPage, setMetricsPage] = useState(initialMetricsPage);
  const [logsPage, setLogsPage] = useState(initialLogsPage);

  // Fetch metrics summary data
  const summaryQuery = useQuery({
    queryKey: ['metricsSummary'],
    queryFn: fetchMetricsSummary,
    refetchInterval: autoRefreshInterval
  });

  // Fetch detailed metrics data
  const metricsQuery = useQuery({
    queryKey: ['metrics', metricsPage],
    queryFn: () => fetchMetrics(metricsPage, pageSize),
    refetchInterval: autoRefreshInterval
  });

  // Fetch logs data
  const logsQuery = useQuery({
    queryKey: ['logs', logsPage],
    queryFn: () => fetchLogs(logsPage, pageSize),
    refetchInterval: autoRefreshInterval
  });

  const handleMetricsPageChange = (page: number) => {
    setMetricsPage(page);
  };

  const handleLogsPageChange = (page: number) => {
    setLogsPage(page);
  };

  const refreshAll = () => {
    summaryQuery.refetch();
    metricsQuery.refetch();
    logsQuery.refetch();
  };

  // Calculate session metrics from store messages
  const calculateSessionMetrics = (messages: Message[]) => {
    const userMessages = messages.filter(msg => msg.sender === 'user');
    const botMessages = messages.filter(msg => msg.sender === 'bot');
    
    const botMessagesWithResponseTime = botMessages.filter(msg => msg.responseTime !== undefined);
    const totalResponseTime = botMessagesWithResponseTime.reduce(
      (total, msg) => total + (msg.responseTime || 0), 
      0
    );
    
    const avgResponseTime = botMessagesWithResponseTime.length > 0 
      ? totalResponseTime / botMessagesWithResponseTime.length 
      : 0;
    
    // Rough token estimation based on character count
    const allText = messages.map(msg => msg.text || '').join(' ');
    const tokenEstimate = Math.ceil(allText.length / 4);
    
    return {
      totalMessages: messages.length,
      userMessages: userMessages.length,
      botMessages: botMessages.length,
      averageResponseTime: avgResponseTime,
      totalResponseTime: totalResponseTime,
      tokenEstimate
    };
  };

  return {
    // Queries
    summaryQuery,
    metricsQuery,
    logsQuery,
    
    // Data
    summaryData: summaryQuery.data,
    metricsData: metricsQuery.data,
    logsData: logsQuery.data,
    
    // Loading states
    isSummaryLoading: summaryQuery.isLoading,
    isMetricsLoading: metricsQuery.isLoading,
    isLogsLoading: logsQuery.isLoading,
    
    // Errors
    summaryError: summaryQuery.error,
    metricsError: metricsQuery.error,
    logsError: logsQuery.error,
    
    // Pagination
    metricsPage,
    logsPage,
    pageSize,
    
    // Functions
    handleMetricsPageChange,
    handleLogsPageChange,
    refreshAll,
    calculateSessionMetrics
  };
}; 