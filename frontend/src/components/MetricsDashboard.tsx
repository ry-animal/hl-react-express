import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
    Box, Typography, Card, CardContent, Grid, CircularProgress,
    Paper, Pagination, Tabs, Tab, TableContainer, Table, TableHead, TableRow, TableCell, TableBody,
    IconButton, Divider, useTheme, useMediaQuery
} from '@mui/material';
import {
    CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis
} from 'recharts';
import {
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    getSortedRowModel,
    getPaginationRowModel,
    SortingState,
    useReactTable
} from '@tanstack/react-table';
import { fetchMetricsSummary, fetchMetrics, fetchLogs } from '../services/metricsService';
import RefreshIcon from '@mui/icons-material/Refresh';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import TokenIcon from '@mui/icons-material/Token';

interface Metric {
    id: number;
    event_type: string;
    message_length: number | null;
    response_length: number | null;
    response_time: number | null;
    timestamp: string;
    model: string | null;
    token_count: number | null;
    estimated_cost: number | null;
    extra_data?: Record<string, unknown>;
}

interface LogEntry {
    id: number;
    request_type: string;
    user_message: string | null;
    ai_response: string | null;
    error: string | null;
    timestamp: string;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const MetricsDashboard = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const isTablet = useMediaQuery(theme.breakpoints.down('md'));
    const [currentTab, setCurrentTab] = useState(0);
    const [metricsPage, setMetricsPage] = useState(0);
    const [logsPage, setLogsPage] = useState(0);
    const [sorting, setSorting] = useState<SortingState>([]);
    const pageSize = 10;

    // Fetch metrics summary data
    const { data: summaryData, isLoading: isSummaryLoading, refetch: refetchSummary } = useQuery({
        queryKey: ['metricsSummary'],
        queryFn: fetchMetricsSummary
    });

    // Fetch detailed metrics data
    const { data: metricsData, isLoading: isMetricsLoading, refetch: refetchMetrics } = useQuery({
        queryKey: ['metrics', metricsPage],
        queryFn: () => fetchMetrics(metricsPage, pageSize)
    });

    // Fetch logs data
    const { data: logsData, isLoading: isLogsLoading, refetch: refetchLogs } = useQuery({
        queryKey: ['logs', logsPage],
        queryFn: () => fetchLogs(logsPage, pageSize)
    });

    // Setup table columns for metrics with responsive visibility
    const columnHelper = createColumnHelper<Metric>();
    const columns = [
        columnHelper.accessor('id', {
            header: 'ID',
            cell: info => info.getValue(),
            // Always show ID column as it's important for identification
        }),
        columnHelper.accessor('event_type', {
            header: 'Event Type',
            cell: info => info.getValue(),
            // Always show event type as it's a primary identifier
        }),
        columnHelper.accessor('message_length', {
            header: 'Message Length',
            cell: info => info.getValue() !== null ? info.getValue() : '-',
            // Hide on mobile as it's less important
            enableHiding: true,
        }),
        columnHelper.accessor('response_length', {
            header: 'Response Length',
            cell: info => info.getValue() !== null ? info.getValue() : '-',
            // Hide on mobile as it's less important
            enableHiding: true,
        }),
        columnHelper.accessor('response_time', {
            header: 'Response Time',
            cell: info => info.getValue() !== null ? `${info.getValue()} ms` : '-',
            // Keep visible as it's important performance data
        }),
        columnHelper.accessor('token_count', {
            header: 'Tokens',
            cell: info => info.getValue() !== null ? info.getValue() : '-',
            // Keep on tablet, hide on mobile
        }),
        columnHelper.accessor('estimated_cost', {
            header: 'Cost',
            cell: info => info.getValue() !== null ? `$${info.getValue()?.toFixed(5)}` : '-',
            // Important business metric, keep visible
        }),
        columnHelper.accessor('model', {
            header: 'Model',
            cell: info => info.getValue() || '-',
            // Hide on mobile as it's often the same
            enableHiding: true,
        }),
        columnHelper.accessor('timestamp', {
            header: 'Time',
            cell: info => {
                const date = new Date(info.getValue());
                // On mobile, show more compact date
                return isMobile
                    ? date.toLocaleTimeString()
                    : date.toLocaleString();
            },
            // Keep visible as timing data is important
        }),
    ];

    const visibleColumns = columns.filter(column => {
        // Type guard to ensure column.id is a string
        const columnId = column.id as string;

        if (isMobile) {
            // Keep only the most important columns on mobile
            return !column.enableHiding || ['id', 'event_type', 'response_time', 'estimated_cost', 'timestamp'].includes(columnId);
        }
        if (isTablet) {
            // Show more columns on tablet but still hide some
            return !column.enableHiding || !['message_length', 'response_length', 'model'].includes(columnId);
        }
        return true; // Show all columns on desktop
    });

    const table = useReactTable({
        data: metricsData?.metrics || [],
        columns: visibleColumns,
        state: {
            sorting,
        },
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
    });

    const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
        setCurrentTab(newValue);
    };

    const handleMetricsPageChange = (event: React.ChangeEvent<unknown>, value: number) => {
        event.preventDefault();
        setMetricsPage(value - 1);
    };

    const handleLogsPageChange = (event: React.ChangeEvent<unknown>, value: number) => {
        event.preventDefault();
        setLogsPage(value - 1);
    };

    const refreshData = () => {
        refetchSummary();
        refetchMetrics();
        refetchLogs();
    };

    // Loading state
    if (isSummaryLoading && currentTab === 0) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '70vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={{ width: '100%', maxWidth: 1200, mx: 'auto', p: { xs: 1, sm: 2 } }}>
            <Paper
                sx={{
                    p: { xs: 2, sm: 3 },
                    borderRadius: 2,
                    mb: 3,
                    boxShadow: theme.shadows[2],
                }}
            >
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    mb: 3,
                    gap: { xs: 0, sm: 1 }
                }}>
                    <Typography
                        variant="h4"
                        gutterBottom
                        fontWeight="medium"
                        color="primary"
                    >
                        System Metrics Dashboard
                    </Typography>
                    <IconButton onClick={refreshData} title="Refresh data" sx={{
                        mb: { xs: 8, sm: 2 }
                    }}>
                        <RefreshIcon />
                    </IconButton>
                </Box>

                <Typography variant="body1" paragraph color="text.secondary">
                    Comprehensive analytics for system performance and usage metrics.
                </Typography>

                <Tabs
                    value={currentTab}
                    onChange={handleTabChange}
                    sx={{
                        mb: 3,
                        '& .MuiTabs-flexContainer': {
                            flexWrap: { xs: 'wrap', sm: 'nowrap' }
                        }
                    }}
                    variant={isMobile ? "fullWidth" : "standard"}
                >
                    <Tab label="Summary" />
                    <Tab label="Detailed Metrics" />
                    <Tab label="Logs" />
                </Tabs>

                {currentTab === 0 && summaryData && (
                    <>
                        <Grid container spacing={2} sx={{ mb: 2 }}>
                            <Grid item xs={12} sm={6} md={3}>
                                <Card variant="outlined" sx={{ height: '100%' }}>
                                    <CardContent>
                                        <Typography color="text.secondary" gutterBottom>
                                            Avg Response Time
                                        </Typography>
                                        <Typography variant="h4" component="div" color="primary.main">
                                            {Math.round(summaryData.avgResponseTime)}
                                            <Typography variant="caption" display="inline" sx={{ ml: 1 }}>
                                                ms
                                            </Typography>
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>

                            <Grid item xs={12} sm={6} md={3}>
                                <Card variant="outlined" sx={{ height: '100%' }}>
                                    <CardContent>
                                        <Typography color="text.secondary" gutterBottom>
                                            Total Requests
                                        </Typography>
                                        <Typography variant="h4" component="div" color="primary.main">
                                            {summaryData.eventCounts.reduce((acc, curr) => acc + curr.count, 0)}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>

                            <Grid item xs={12} sm={6} md={3}>
                                <Card variant="outlined" sx={{ height: '100%' }}>
                                    <CardContent>
                                        <Typography color="text.secondary" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                                            <TokenIcon sx={{ mr: 1, fontSize: '1rem' }} /> Total Tokens
                                        </Typography>
                                        <Typography variant="h4" component="div" color="primary.main">
                                            {summaryData.tokenUsage.totalTokens.toLocaleString()}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>

                            <Grid item xs={12} sm={6} md={3}>
                                <Card variant="outlined" sx={{ height: '100%' }}>
                                    <CardContent>
                                        <Typography color="text.secondary" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                                            <AttachMoneyIcon sx={{ mr: 1, fontSize: '1rem' }} /> Total Cost
                                        </Typography>
                                        <Typography variant="h4" component="div" color="primary.main">
                                            ${summaryData.tokenUsage.totalCost.toFixed(4)}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        </Grid>

                        <Divider sx={{ my: 2 }} />

                        <Typography variant="h5" gutterBottom sx={{ mb: 2 }}>
                            Usage Analytics
                        </Typography>

                        <Grid container spacing={3}>
                            <Grid item xs={12} md={6}>
                                <Card variant="outlined">
                                    <CardContent>
                                        <Typography variant="h6" gutterBottom color="text.secondary">
                                            Event Types
                                        </Typography>
                                        <Box sx={{ width: '100%', height: 300, position: 'relative' }}>
                                            <ResponsiveContainer>
                                                <PieChart>
                                                    <Pie
                                                        data={summaryData.eventCounts}
                                                        dataKey="count"
                                                        nameKey="event_type"
                                                        cx="50%"
                                                        cy="50%"
                                                        outerRadius={isMobile ? 70 : 100}
                                                        fill={theme.palette.primary.main}
                                                        label={false}
                                                        isAnimationActive={true}
                                                        animationDuration={800}
                                                        animationBegin={300}
                                                    >
                                                        {summaryData.eventCounts.map((_, index) => (
                                                            <Cell
                                                                key={`cell-${index}`}
                                                                fill={COLORS[index % COLORS.length]}
                                                                stroke={theme.palette.background.paper}
                                                                strokeWidth={1}
                                                            />
                                                        ))}
                                                    </Pie>
                                                    <Tooltip
                                                        formatter={(value) => [`${value} requests`, 'Count']}
                                                        contentStyle={{
                                                            backgroundColor: theme.palette.background.paper,
                                                            color: theme.palette.text.primary,
                                                            border: `1px solid ${theme.palette.divider}`,
                                                            borderRadius: 4,
                                                            boxShadow: theme.shadows[3],
                                                            padding: '8px 12px',
                                                        }}
                                                        itemStyle={{
                                                            color: theme.palette.text.primary,
                                                        }}
                                                        labelStyle={{
                                                            color: theme.palette.text.secondary,
                                                            fontWeight: 'bold',
                                                            marginBottom: 4,
                                                        }}
                                                    />
                                                    <Legend
                                                        layout="horizontal"
                                                        verticalAlign="bottom"
                                                        align="center"
                                                        iconSize={10}
                                                        iconType="circle"
                                                        formatter={(value, _, index) => {
                                                            const total = summaryData.eventCounts.reduce((sum, item) => sum + item.count, 0);
                                                            const item = summaryData.eventCounts[index];
                                                            const percent = ((item.count / total) * 100).toFixed(0);

                                                            const displayValue = isMobile && value.length > 12
                                                                ? `${value.substring(0, 12)}...`
                                                                : value;

                                                            return (
                                                                <span style={{ color: theme.palette.text.primary }}>
                                                                    {displayValue} ({percent}%)
                                                                </span>
                                                            );
                                                        }}
                                                    />
                                                </PieChart>
                                            </ResponsiveContainer>
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <Card variant="outlined">
                                    <CardContent>
                                        <Typography variant="h6" gutterBottom color="text.secondary">
                                            Messages Per Day
                                        </Typography>
                                        <ResponsiveContainer width="100%" height={300}>
                                            <LineChart
                                                data={summaryData.messagesPerDay}
                                                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                                            >
                                                <CartesianGrid strokeDasharray="3 3" stroke={`${theme.palette.divider}80`} />
                                                <XAxis dataKey="date" />
                                                <YAxis />
                                                <Tooltip
                                                    formatter={(value) => [`${value}`, 'Messages']}
                                                    contentStyle={{
                                                        backgroundColor: theme.palette.background.paper,
                                                        color: theme.palette.text.primary,
                                                        border: `1px solid ${theme.palette.divider}`,
                                                        borderRadius: 4,
                                                        boxShadow: theme.shadows[3],
                                                        padding: '8px 12px',
                                                    }}
                                                    itemStyle={{
                                                        color: theme.palette.text.primary,
                                                    }}
                                                    labelStyle={{
                                                        color: theme.palette.text.secondary,
                                                        fontWeight: 'bold',
                                                        marginBottom: 4,
                                                    }}
                                                />
                                                <Legend />
                                                <Line
                                                    type="monotone"
                                                    dataKey="count"
                                                    stroke={theme.palette.primary.main}
                                                    activeDot={{ r: 8 }}
                                                />
                                            </LineChart>
                                        </ResponsiveContainer>
                                    </CardContent>
                                </Card>
                            </Grid>
                        </Grid>
                    </>
                )}

                {currentTab === 1 && (
                    <Card variant="outlined" sx={{ width: '100%', overflow: 'hidden' }}>
                        <CardContent sx={{ p: { xs: 1, sm: 2 } }}>
                            <Typography variant="h6" gutterBottom color="text.secondary">
                                Detailed Metrics
                            </Typography>
                            {isMetricsLoading ? (
                                <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                                    <CircularProgress />
                                </Box>
                            ) : (
                                <>
                                    {isMobile && (
                                        <Typography variant="caption" sx={{ display: 'block', mb: 1, color: 'text.secondary' }}>
                                            Swipe horizontally to see more data →
                                        </Typography>
                                    )}
                                    <Box sx={{
                                        overflowX: 'auto',
                                        '&::-webkit-scrollbar': {
                                            height: '8px',
                                        },
                                        '&::-webkit-scrollbar-thumb': {
                                            backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)',
                                            borderRadius: '4px',
                                        },
                                        '&::-webkit-scrollbar-track': {
                                            backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
                                        },
                                    }}>
                                        <TableContainer sx={{ maxHeight: { xs: 400, sm: 500 } }}>
                                            <Table stickyHeader size={isMobile ? "small" : "medium"}>
                                                <TableHead>
                                                    {table.getHeaderGroups().map(headerGroup => (
                                                        <TableRow key={headerGroup.id}>
                                                            {headerGroup.headers.map(header => (
                                                                <TableCell
                                                                    key={header.id}
                                                                    sx={{
                                                                        fontWeight: 'bold',
                                                                        whiteSpace: 'nowrap',
                                                                        px: { xs: 1, sm: 2 },
                                                                        py: { xs: 1, sm: 1.5 },
                                                                    }}
                                                                >
                                                                    {header.isPlaceholder ? null : (
                                                                        <Box
                                                                            sx={{
                                                                                display: 'flex',
                                                                                alignItems: 'center',
                                                                                cursor: header.column.getCanSort() ? 'pointer' : 'default',
                                                                            }}
                                                                            onClick={header.column.getToggleSortingHandler()}
                                                                        >
                                                                            {flexRender(
                                                                                header.column.columnDef.header,
                                                                                header.getContext()
                                                                            )}
                                                                            {{
                                                                                asc: <ArrowUpwardIcon fontSize="small" sx={{ ml: 0.5 }} />,
                                                                                desc: <ArrowDownwardIcon fontSize="small" sx={{ ml: 0.5 }} />,
                                                                            }[header.column.getIsSorted() as string] ?? null}
                                                                        </Box>
                                                                    )}
                                                                </TableCell>
                                                            ))}
                                                        </TableRow>
                                                    ))}
                                                </TableHead>
                                                <TableBody>
                                                    {table.getRowModel().rows.map(row => (
                                                        <TableRow key={row.id} hover>
                                                            {row.getVisibleCells().map(cell => (
                                                                <TableCell
                                                                    key={cell.id}
                                                                    sx={{
                                                                        px: { xs: 1, sm: 2 },
                                                                        py: { xs: 1, sm: 1.5 },
                                                                        whiteSpace: 'nowrap'
                                                                    }}
                                                                >
                                                                    {flexRender(
                                                                        cell.column.columnDef.cell,
                                                                        cell.getContext()
                                                                    )}
                                                                </TableCell>
                                                            ))}
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        </TableContainer>
                                    </Box>
                                    <Box sx={{ display: 'flex', justifyContent: 'center', px: 2, py: 1 }}>
                                        <Pagination
                                            count={Math.ceil((metricsData?.total || 0) / pageSize)}
                                            page={metricsPage + 1}
                                            onChange={handleMetricsPageChange}
                                            color="primary"
                                            size={isMobile ? "small" : "medium"}
                                            siblingCount={isMobile ? 0 : 1}
                                        />
                                    </Box>
                                </>
                            )}
                        </CardContent>
                    </Card>
                )}

                {currentTab === 2 && (
                    <Card variant="outlined" sx={{ width: '100%', overflow: 'hidden' }}>
                        <CardContent sx={{ p: { xs: 1, sm: 2 } }}>
                            <Typography variant="h6" gutterBottom color="text.secondary">
                                System Logs
                            </Typography>
                            {isLogsLoading ? (
                                <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                                    <CircularProgress />
                                </Box>
                            ) : (
                                <>
                                    {isMobile && (
                                        <Typography variant="caption" sx={{ display: 'block', mb: 1, color: 'text.secondary' }}>
                                            Swipe horizontally to see more data →
                                        </Typography>
                                    )}
                                    <Box
                                        sx={{
                                            width: '100%',
                                            overflowX: 'auto',
                                            WebkitOverflowScrolling: 'touch', // Enable momentum scrolling on iOS
                                            msOverflowStyle: '-ms-autohiding-scrollbar', // Better experience on Edge
                                            scrollbarWidth: 'thin',
                                            '&::-webkit-scrollbar': {
                                                height: '8px',
                                            },
                                            '&::-webkit-scrollbar-thumb': {
                                                backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)',
                                                borderRadius: '4px',
                                            },
                                            '&::-webkit-scrollbar-track': {
                                                backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
                                            },
                                        }}
                                    >
                                        <Table
                                            stickyHeader
                                            size={isMobile ? "small" : "medium"}
                                            sx={{
                                                minWidth: isMobile ? 600 : 800, // Force minimum width to ensure scrolling
                                            }}
                                        >
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell sx={{ fontWeight: 'bold', px: { xs: 1, sm: 2 }, py: { xs: 1, sm: 1.5 } }}>ID</TableCell>
                                                    <TableCell sx={{ fontWeight: 'bold', px: { xs: 1, sm: 2 }, py: { xs: 1, sm: 1.5 } }}>Type</TableCell>
                                                    <TableCell sx={{ fontWeight: 'bold', px: { xs: 1, sm: 2 }, py: { xs: 1, sm: 1.5 }, minWidth: 150 }}>User Message</TableCell>
                                                    <TableCell sx={{ fontWeight: 'bold', px: { xs: 1, sm: 2 }, py: { xs: 1, sm: 1.5 }, minWidth: 150 }}>AI Response</TableCell>
                                                    <TableCell sx={{ fontWeight: 'bold', px: { xs: 1, sm: 2 }, py: { xs: 1, sm: 1.5 } }}>Error</TableCell>
                                                    <TableCell sx={{ fontWeight: 'bold', px: { xs: 1, sm: 2 }, py: { xs: 1, sm: 1.5 } }}>Timestamp</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {logsData?.logs.map((log: LogEntry) => (
                                                    <TableRow key={log.id} hover>
                                                        <TableCell sx={{ px: { xs: 1, sm: 2 }, py: { xs: 1, sm: 1.5 } }}>{log.id}</TableCell>
                                                        <TableCell sx={{ px: { xs: 1, sm: 2 }, py: { xs: 1, sm: 1.5 } }}>{log.request_type}</TableCell>
                                                        <TableCell sx={{ px: { xs: 1, sm: 2 }, py: { xs: 1, sm: 1.5 }, maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                            {log.user_message && log.user_message.length > 100
                                                                ? `${log.user_message.substring(0, 100)}...`
                                                                : log.user_message || '-'}
                                                        </TableCell>
                                                        <TableCell sx={{ px: { xs: 1, sm: 2 }, py: { xs: 1, sm: 1.5 }, maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                            {log.ai_response && log.ai_response.length > 100
                                                                ? `${log.ai_response.substring(0, 100)}...`
                                                                : log.ai_response || '-'}
                                                        </TableCell>
                                                        <TableCell sx={{ px: { xs: 1, sm: 2 }, py: { xs: 1, sm: 1.5 } }}>{log.error || '-'}</TableCell>
                                                        <TableCell sx={{ px: { xs: 1, sm: 2 }, py: { xs: 1, sm: 1.5 }, whiteSpace: 'nowrap' }}>
                                                            {isMobile
                                                                ? new Date(log.timestamp).toLocaleTimeString()
                                                                : new Date(log.timestamp).toLocaleString()
                                                            }
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </Box>
                                    <Box sx={{ display: 'flex', justifyContent: 'center', px: 2, py: 1, mt: 1 }}>
                                        <Pagination
                                            count={Math.ceil((logsData?.total || 0) / pageSize)}
                                            page={logsPage + 1}
                                            onChange={handleLogsPageChange}
                                            color="primary"
                                            size={isMobile ? "small" : "medium"}
                                            siblingCount={isMobile ? 0 : 1}
                                        />
                                    </Box>
                                </>
                            )}
                        </CardContent>
                    </Card>
                )}
            </Paper>
        </Box>
    );
};

export default MetricsDashboard; 