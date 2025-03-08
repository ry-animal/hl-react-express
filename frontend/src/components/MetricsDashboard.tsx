import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
    Box, Typography, Card, CardContent, Grid, CircularProgress,
    Paper, Pagination, Tabs, Tab, TableContainer, Table, TableHead, TableRow, TableCell, TableBody,
    IconButton
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
import Header from './Header';
import Footer from './Footer';

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

    // Setup table columns for metrics
    const columnHelper = createColumnHelper<Metric>();
    const columns = [
        columnHelper.accessor('id', {
            header: 'ID',
            cell: info => info.getValue(),
        }),
        columnHelper.accessor('event_type', {
            header: 'Event Type',
            cell: info => info.getValue(),
        }),
        columnHelper.accessor('message_length', {
            header: 'Message Length',
            cell: info => info.getValue() !== null ? info.getValue() : '-',
        }),
        columnHelper.accessor('response_length', {
            header: 'Response Length',
            cell: info => info.getValue() !== null ? info.getValue() : '-',
        }),
        columnHelper.accessor('response_time', {
            header: 'Response Time (ms)',
            cell: info => info.getValue() !== null ? info.getValue() : '-',
        }),
        columnHelper.accessor('token_count', {
            header: 'Tokens',
            cell: info => info.getValue() !== null ? info.getValue() : '-',
        }),
        columnHelper.accessor('estimated_cost', {
            header: 'Cost ($)',
            cell: info => info.getValue() !== null ? `$${info.getValue()?.toFixed(5)}` : '-',
        }),
        columnHelper.accessor('model', {
            header: 'Model',
            cell: info => info.getValue() || '-',
        }),
        columnHelper.accessor('timestamp', {
            header: 'Timestamp',
            cell: info => new Date(info.getValue()).toLocaleString(),
        }),
    ];

    const table = useReactTable({
        data: metricsData?.metrics || [],
        columns,
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
        <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            minHeight: '100vh',
            width: '100vw',
            maxWidth: '100vw',
            backgroundColor: 'background.default',
            overflow: 'hidden'
        }}>
            <Header />

            <Box component="main" sx={{ flex: 1, display: 'flex', flexDirection: 'column', width: '100%', p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Typography variant="h4" sx={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 600 }} gutterBottom>
                        System Metrics Dashboard
                    </Typography>
                    <IconButton onClick={refreshData} title="Refresh data">
                        <RefreshIcon />
                    </IconButton>
                </Box>

                <Tabs value={currentTab} onChange={handleTabChange} sx={{ mb: 3 }}>
                    <Tab label="Summary" />
                    <Tab label="Detailed Metrics" />
                    <Tab label="Logs" />
                </Tabs>

                {currentTab === 0 && summaryData && (
                    <>
                        <Grid container spacing={3} sx={{ mb: 4 }}>
                            <Grid item xs={12} sm={6} md={3}>
                                <Card sx={{ height: '100%' }}>
                                    <CardContent>
                                        <Typography variant="h6" gutterBottom>
                                            Avg Response Time
                                        </Typography>
                                        <Typography variant="h3">
                                            {Math.round(summaryData.avgResponseTime)}
                                            <Typography variant="caption" display="inline" sx={{ ml: 1 }}>
                                                ms
                                            </Typography>
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>

                            <Grid item xs={12} sm={6} md={3}>
                                <Card sx={{ height: '100%' }}>
                                    <CardContent>
                                        <Typography variant="h6" gutterBottom>
                                            Total Requests
                                        </Typography>
                                        <Typography variant="h3">
                                            {summaryData.eventCounts.reduce((acc, curr) => acc + curr.count, 0)}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>

                            <Grid item xs={12} sm={6} md={3}>
                                <Card sx={{ height: '100%' }}>
                                    <CardContent>
                                        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                                            <TokenIcon sx={{ mr: 1 }} /> Total Tokens
                                        </Typography>
                                        <Typography variant="h3">
                                            {summaryData.tokenUsage.totalTokens.toLocaleString()}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>

                            <Grid item xs={12} sm={6} md={3}>
                                <Card sx={{ height: '100%' }}>
                                    <CardContent>
                                        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                                            <AttachMoneyIcon sx={{ mr: 1 }} /> Total Cost
                                        </Typography>
                                        <Typography variant="h3">
                                            ${summaryData.tokenUsage.totalCost.toFixed(4)}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        </Grid>

                        <Grid container spacing={3}>
                            <Grid item xs={12} md={6}>
                                <Card>
                                    <CardContent>
                                        <Typography variant="h6" gutterBottom>
                                            Event Types
                                        </Typography>
                                        <ResponsiveContainer width="100%" height={300}>
                                            <PieChart>
                                                <Pie
                                                    data={summaryData.eventCounts}
                                                    dataKey="count"
                                                    nameKey="event_type"
                                                    cx="50%"
                                                    cy="50%"
                                                    outerRadius={100}
                                                    fill="#8884d8"
                                                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                                >
                                                    {summaryData.eventCounts.map((_, index) => (
                                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                    ))}
                                                </Pie>
                                                <Tooltip formatter={(value) => [`${value} requests`, 'Count']} />
                                                <Legend />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    </CardContent>
                                </Card>
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <Card>
                                    <CardContent>
                                        <Typography variant="h6" gutterBottom>
                                            Messages Per Day
                                        </Typography>
                                        <ResponsiveContainer width="100%" height={300}>
                                            <LineChart
                                                data={summaryData.messagesPerDay}
                                                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                                            >
                                                <CartesianGrid strokeDasharray="3 3" />
                                                <XAxis dataKey="date" />
                                                <YAxis />
                                                <Tooltip />
                                                <Legend />
                                                <Line type="monotone" dataKey="count" stroke="#8884d8" activeDot={{ r: 8 }} />
                                            </LineChart>
                                        </ResponsiveContainer>
                                    </CardContent>
                                </Card>
                            </Grid>
                        </Grid>
                    </>
                )}

                {/* Detailed Metrics Tab */}
                {currentTab === 1 && (
                    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                        {isMetricsLoading ? (
                            <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                                <CircularProgress />
                            </Box>
                        ) : (
                            <>
                                <TableContainer sx={{ maxHeight: 500 }}>
                                    <Table stickyHeader>
                                        <TableHead>
                                            {table.getHeaderGroups().map(headerGroup => (
                                                <TableRow key={headerGroup.id}>
                                                    {headerGroup.headers.map(header => (
                                                        <TableCell key={header.id} sx={{ fontWeight: 'bold' }}>
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
                                                        <TableCell key={cell.id}>
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
                                <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
                                    <Pagination
                                        count={Math.ceil((metricsData?.total || 0) / pageSize)}
                                        page={metricsPage + 1}
                                        onChange={(event, value) => handleMetricsPageChange(event, value)}
                                        color="primary"
                                    />
                                </Box>
                            </>
                        )}
                    </Paper>
                )}

                {/* Logs Tab */}
                {currentTab === 2 && (
                    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                        {isLogsLoading ? (
                            <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                                <CircularProgress />
                            </Box>
                        ) : (
                            <>
                                <TableContainer sx={{ maxHeight: 500 }}>
                                    <Table stickyHeader>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell sx={{ fontWeight: 'bold' }}>ID</TableCell>
                                                <TableCell sx={{ fontWeight: 'bold' }}>Type</TableCell>
                                                <TableCell sx={{ fontWeight: 'bold' }}>User Message</TableCell>
                                                <TableCell sx={{ fontWeight: 'bold' }}>AI Response</TableCell>
                                                <TableCell sx={{ fontWeight: 'bold' }}>Error</TableCell>
                                                <TableCell sx={{ fontWeight: 'bold' }}>Timestamp</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {logsData?.logs.map((log: LogEntry) => (
                                                <TableRow key={log.id} hover>
                                                    <TableCell>{log.id}</TableCell>
                                                    <TableCell>{log.request_type}</TableCell>
                                                    <TableCell>
                                                        {log.user_message && log.user_message.length > 100
                                                            ? `${log.user_message.substring(0, 100)}...`
                                                            : log.user_message || '-'}
                                                    </TableCell>
                                                    <TableCell>
                                                        {log.ai_response && log.ai_response.length > 100
                                                            ? `${log.ai_response.substring(0, 100)}...`
                                                            : log.ai_response || '-'}
                                                    </TableCell>
                                                    <TableCell>{log.error || '-'}</TableCell>
                                                    <TableCell>{new Date(log.timestamp).toLocaleString()}</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                                <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
                                    <Pagination
                                        count={Math.ceil((logsData?.total || 0) / pageSize)}
                                        page={logsPage + 1}
                                        onChange={(event, value) => handleLogsPageChange(event, value)}
                                        color="primary"
                                    />
                                </Box>
                            </>
                        )}
                    </Paper>
                )}
            </Box>

            <Footer />
        </Box>
    );
};

export default MetricsDashboard; 