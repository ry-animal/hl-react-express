import {
  Box,
  Card,
  CardContent,
  Divider,
  Grid,
  Paper,
  Typography,
  useTheme,
} from '@mui/material';
import { useMemo } from 'react';
import {
  BarChart,
  AreaChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
} from 'recharts';

import useStore from '../store/useStore';

const MetricsView = () => {
  const theme = useTheme();
  const messages = useStore((state) => state.messages);

  const metrics = useMemo(() => {
    // Get all user messages
    const userMsgs = messages.filter((m) => m.sender === 'user').length;

    const allBotMessages = messages.filter((m) => m.sender === 'bot');
    const botMsgs = allBotMessages.length > 0 ? allBotMessages.length - 1 : 0;

    const botMessagesWithResponseTime = allBotMessages
      .slice(1) // Skip the first bot message
      .filter((m) => m.responseTime !== undefined);

    const totalResponseTime = botMessagesWithResponseTime.reduce(
      (sum, msg) => sum + (msg.responseTime || 0),
      0
    );

    const averageResponseTime =
      botMessagesWithResponseTime.length > 0
        ? totalResponseTime / botMessagesWithResponseTime.length
        : 0;

    // Estimate tokens (very rough estimate)
    const tokenEstimate = messages.reduce((sum, msg) => {
      // Rough estimate: 1 token ≈ 4 characters
      return sum + Math.ceil(msg.text.length / 4);
    }, 0);

    return {
      totalMessages: userMsgs + botMsgs,
      userMessages: userMsgs,
      botMessages: botMsgs,
      averageResponseTime,
      totalResponseTime,
      tokenEstimate,
    };
  }, [messages]);

  // Format milliseconds to seconds with 2 decimal places
  const formatTime = (ms: number) => {
    return (ms / 1000).toFixed(2);
  };

  // Format for cost estimate (assuming $0.002 per 1K tokens)
  const formatCost = (tokens: number) => {
    return `$${((tokens / 1000) * 0.002).toFixed(5)}`;
  };

  // Create data for the message count chart
  const messageData = useMemo(
    () => [
      { name: 'User', count: metrics.userMessages },
      { name: 'Bot', count: metrics.botMessages },
    ],
    [metrics.userMessages, metrics.botMessages]
  );

  // Create data for response time chart
  const responseTimeData = useMemo(
    () =>
      messages
        .filter((msg) => msg.sender === 'bot' && msg.responseTime !== undefined)
        .map((msg, index) => ({
          id: index + 1,
          responseTime: msg.responseTime ? msg.responseTime / 1000 : 0, // Convert to seconds
        })),
    [messages]
  );

  return (
    <Box sx={{ width: '100%', maxWidth: 1200, mx: 'auto', p: 2 }}>
      <Paper
        sx={{
          p: 3,
          borderRadius: 2,
          mb: 3,
          boxShadow: theme.shadows[2],
        }}
      >
        <Typography
          variant="h4"
          gutterBottom
          fontWeight="medium"
          color="primary"
        >
          Chat Metrics
        </Typography>
        <Typography variant="body1" paragraph color="text.secondary">
          Real-time analytics for your conversation with Reuben&apos;s Brews
          Chatbot.
        </Typography>

        {/* Summary Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card variant="outlined" sx={{ height: '100%' }}>
              <CardContent>
                <Typography color="text.secondary" gutterBottom>
                  Total Messages
                </Typography>
                <Typography variant="h4" component="div" color="primary.main">
                  {metrics.totalMessages}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card variant="outlined" sx={{ height: '100%' }}>
              <CardContent>
                <Typography color="text.secondary" gutterBottom>
                  Avg. Response Time
                </Typography>
                <Typography variant="h4" component="div" color="primary.main">
                  {formatTime(metrics.averageResponseTime)}s
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card variant="outlined" sx={{ height: '100%' }}>
              <CardContent>
                <Typography color="text.secondary" gutterBottom>
                  Token Estimate
                </Typography>
                <Typography variant="h4" component="div" color="primary.main">
                  {metrics.tokenEstimate}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card variant="outlined" sx={{ height: '100%' }}>
              <CardContent>
                <Typography color="text.secondary" gutterBottom>
                  Est. Cost
                </Typography>
                <Typography variant="h4" component="div" color="primary.main">
                  {formatCost(metrics.tokenEstimate)}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Divider sx={{ my: 4 }} />

        {/* Charts */}
        <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
          Message Distribution
        </Typography>
        <Box sx={{ height: 300, mb: 4 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={messageData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke={`${theme.palette.divider}80`}
              />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip
                contentStyle={{
                  backgroundColor: `${theme.palette.background.paper}CC`,
                  backdropFilter: 'blur(8px)',
                  border: `1px solid ${theme.palette.divider}`,
                  borderRadius: 4,
                }}
              />
              <Legend />
              <Bar
                dataKey="count"
                name="Messages"
                fill={theme.palette.primary.main}
                radius={[4, 4, 0, 0]}
                activeBar={{
                  fill: `${theme.palette.primary.main}CC`,
                  strokeWidth: 1,
                  stroke: theme.palette.primary.main
                }}
              />
            </BarChart>
          </ResponsiveContainer>
        </Box>

        {responseTimeData.length > 1 && (
          <>
            <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
              Response Time Trend
            </Typography>
            <Box sx={{ height: 300, mb: 2 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={responseTimeData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="id"
                    label={{
                      value: 'Message Number',
                      position: 'insideBottomRight',
                      offset: -10,
                    }}
                  />
                  <YAxis
                    label={{
                      value: 'Seconds',
                      angle: -90,
                      position: 'insideLeft',
                    }}
                  />
                  <Tooltip
                    formatter={(value: number) => [
                      `${value} s`,
                      'Response Time',
                    ]}
                    contentStyle={{
                      backgroundColor: theme.palette.background.paper,
                      border: `1px solid ${theme.palette.divider}`,
                      borderRadius: 4,
                    }}
                  />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="responseTime"
                    name="Response Time"
                    fill={theme.palette.secondary.main}
                    stroke={theme.palette.secondary.dark}
                    fillOpacity={0.3}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </Box>
          </>
        )}
      </Paper>
    </Box>
  );
};

export default MetricsView;
