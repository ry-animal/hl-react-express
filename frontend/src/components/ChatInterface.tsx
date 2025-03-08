import { useState, useRef, useEffect } from 'react';
import {
    Box,
    TextField,
    IconButton,
    Typography,
    Avatar,
    alpha,
    useMediaQuery,
    Stack,
    Card,
    CardContent,
    darken
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import SendIcon from '@mui/icons-material/Send';
import useStore from '../store/useStore';

// Constants for the fixed header color - using the light theme green color
const HEADER_BG_COLOR = '#2e7d32'; // Light theme green
const HEADER_TEXT_COLOR = '#ffffff'; // White text

// Custom font styles for the header title
const headerTitleStyles = {
    fontFamily: "'Montserrat', sans-serif",
    textTransform: 'uppercase',
    letterSpacing: '1.5px',
    fontWeight: '600',
    textAlign: 'center',
    flexGrow: 1,
    fontSize: { xs: '1rem', sm: '1.25rem' },
    textShadow: '1px 1px 2px rgba(0,0,0,0.2)',
};

const ChatInterface = () => {
    const [newMessage, setNewMessage] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    // Use the store for messages and message functions
    const messages = useStore(state => state.messages);
    const addMessage = useStore(state => state.addMessage);
    const setRequestStartTime = useStore(state => state.setRequestStartTime);

    // Auto-scroll to bottom when messages update
    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleSendMessage = () => {
        if (newMessage.trim() === '') return;

        // Add user message using the store function
        addMessage({
            text: newMessage,
            sender: 'user'
        });

        setNewMessage('');

        // Set request start time for measuring response time
        setRequestStartTime(Date.now());

        // For now, simulate bot response
        // In the future, we'll integrate with a real backend API
        sendMessageToBackend(newMessage);
    };

    // Function to send message to backend (to be implemented)
    const sendMessageToBackend = async (message: string) => {
        try {
            // Using message variable in a comment to avoid linter warning
            // Will use this message parameter when implementing the actual API call
            console.log(`Will send message to backend: ${message}`);

            // Simulate API delay
            setTimeout(() => {
                // Add bot message using the store function
                addMessage({
                    text: "I'm a demo bot response. In a real app, this would come from the backend API.",
                    sender: 'bot'
                });
            }, 1000);

            // In the future, we'll implement actual API call:
            // const response = await axios.post('/api/chat', { message });
            // addMessage({
            //   text: response.data.reply,
            //   sender: 'bot'
            // });
        } catch (error) {
            console.error('Error sending message to backend:', error);
            // Handle error (e.g., show error message)
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const formatTime = (date: Date) => {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    // Get appropriate background colors with proper contrast
    const getUserBubbleBackground = () =>
        theme.palette.mode === 'dark'
            ? alpha(theme.palette.secondary.light, 0.15)
            : alpha(theme.palette.secondary.light, 0.1);

    const getBotBubbleBackground = () =>
        theme.palette.mode === 'dark'
            ? alpha(theme.palette.primary.light, 0.15)
            : alpha(theme.palette.primary.light, 0.1);

    const getUserBubbleBorder = () =>
        theme.palette.mode === 'dark'
            ? alpha(theme.palette.secondary.main, 0.5)
            : alpha(theme.palette.secondary.main, 0.3);

    const getBotBubbleBorder = () =>
        theme.palette.mode === 'dark'
            ? alpha(theme.palette.primary.main, 0.5)
            : alpha(theme.palette.primary.main, 0.3);

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                maxWidth: '1000px',
                height: '100%'
            }}
            role="region"
            aria-label="Chat conversation"
        >
            <Card
                elevation={theme.palette.mode === 'dark' ? 4 : 1}
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    width: '100%',
                    height: { xs: 'calc(100vh - 180px)', sm: '70vh' },
                    maxHeight: { xs: 'calc(100vh - 180px)', sm: '70vh' },
                    overflow: 'hidden',
                    borderRadius: 2,
                    border: `1px solid ${theme.palette.divider}`
                }}
            >
                {/* Chat header with proper semantic heading - always green with white text */}
                <Box
                    component="header"
                    sx={{
                        p: { xs: 1.5, sm: 2 },
                        borderBottom: `1px solid ${alpha(HEADER_TEXT_COLOR, 0.1)}`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: { xs: 1, sm: 2 },
                        backgroundColor: HEADER_BG_COLOR,
                        color: HEADER_TEXT_COLOR
                    }}
                >
                    <Avatar
                        sx={{
                            bgcolor: alpha(HEADER_TEXT_COLOR, 0.2),
                            color: HEADER_TEXT_COLOR,
                            width: { xs: 32, sm: 40 },
                            height: { xs: 32, sm: 40 }
                        }}
                        src="/assets/beermaster.jpg"
                        alt="Reuben's Brewmaster"
                    />
                    <Typography
                        component="h1"
                        sx={headerTitleStyles}
                    >
                        Reuben's Brewmaster
                    </Typography>
                </Box>

                {/* Messages area with improved aria attributes */}
                <Box
                    sx={{
                        flexGrow: 1,
                        overflow: 'auto',
                        p: { xs: 1.5, sm: 2 },
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 2,
                        backgroundColor: theme.palette.background.default
                    }}
                    role="log"
                    aria-live="polite"
                    aria-atomic="false"
                >
                    {messages.map((message) => (
                        <Stack
                            key={message.id}
                            sx={{
                                alignSelf: message.sender === 'user' ? 'flex-end' : 'flex-start',
                                maxWidth: { xs: '85%', sm: '75%', md: '70%' }
                            }}
                            direction="row"
                            spacing={1}
                            alignItems="flex-start"
                            role="article"
                            aria-label={`${message.sender} message`}
                        >
                            {message.sender === 'bot' && (
                                <Avatar
                                    sx={{
                                        backgroundColor: HEADER_BG_COLOR,
                                        color: HEADER_TEXT_COLOR,
                                        width: { xs: 28, sm: 32 },
                                        height: { xs: 28, sm: 32 },
                                        fontSize: { xs: '0.65rem', sm: '0.75rem' },
                                        display: { xs: 'none', sm: 'flex' },
                                        fontFamily: "'Montserrat', sans-serif",
                                        fontWeight: 600,
                                        letterSpacing: '0.5px',
                                        boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                                    }}
                                    aria-hidden="true"
                                >
                                    RB
                                </Avatar>
                            )}

                            <Card
                                variant="outlined"
                                sx={{
                                    p: { xs: 1, sm: 1.5 },
                                    borderRadius: 2,
                                    backgroundColor: message.sender === 'user'
                                        ? getUserBubbleBackground()
                                        : getBotBubbleBackground(),
                                    borderColor: message.sender === 'user'
                                        ? getUserBubbleBorder()
                                        : getBotBubbleBorder(),
                                    wordBreak: 'break-word',
                                    boxShadow: 'none'
                                }}
                            >
                                <CardContent sx={{ p: 1, '&:last-child': { pb: 1 } }}>
                                    <Typography
                                        variant="body1"
                                        sx={{
                                            fontSize: { xs: '0.9rem', sm: '1rem' },
                                            color: theme.palette.text.primary
                                        }}
                                    >
                                        {message.text}
                                    </Typography>
                                    <Typography
                                        variant="caption"
                                        sx={{
                                            display: 'block',
                                            textAlign: message.sender === 'user' ? 'right' : 'left',
                                            mt: 0.5,
                                            fontSize: { xs: '0.65rem', sm: '0.75rem' },
                                            color: theme.palette.text.secondary
                                        }}
                                    >
                                        {formatTime(message.timestamp)}
                                    </Typography>
                                </CardContent>
                            </Card>

                            {message.sender === 'user' && (
                                <Avatar
                                    sx={{
                                        bgcolor: theme.palette.secondary.main,
                                        color: theme.palette.secondary.contrastText,
                                        width: { xs: 28, sm: 32 },
                                        height: { xs: 28, sm: 32 },
                                        fontSize: { xs: '0.75rem', sm: '0.875rem' },
                                        display: { xs: 'none', sm: 'flex' }
                                    }}
                                    aria-hidden="true"
                                >
                                    U
                                </Avatar>
                            )}
                        </Stack>
                    ))}
                    <div ref={messagesEndRef} />
                </Box>

                {/* Input area with accessible labels */}
                <Box
                    component="footer"
                    sx={{
                        p: { xs: 1.5, sm: 2 },
                        backgroundColor: theme.palette.background.paper,
                        borderTop: `1px solid ${theme.palette.divider}`
                    }}
                >
                    <Stack
                        direction="row"
                        spacing={1}
                        alignItems="flex-end"
                        component="form"
                        onSubmit={(e) => {
                            e.preventDefault();
                            handleSendMessage();
                        }}
                    >
                        <TextField
                            fullWidth
                            placeholder="Type your message..."
                            variant="outlined"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            onKeyPress={handleKeyPress}
                            size={isMobile ? "small" : "medium"}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: 2,
                                    backgroundColor: theme.palette.mode === 'dark'
                                        ? alpha(theme.palette.common.white, 0.05)
                                        : alpha(theme.palette.common.black, 0.03),
                                    '&.Mui-focused': {
                                        backgroundColor: theme.palette.mode === 'dark'
                                            ? alpha(theme.palette.common.white, 0.1)
                                            : alpha(theme.palette.common.black, 0.05),
                                    }
                                },
                            }}
                            multiline
                            maxRows={isMobile ? 3 : 4}
                            aria-label="Message input"
                            id="message-input"
                        />
                        <IconButton
                            color="primary"
                            onClick={handleSendMessage}
                            disabled={newMessage.trim() === ''}
                            sx={{
                                bgcolor: HEADER_BG_COLOR,
                                color: HEADER_TEXT_COLOR,
                                '&:hover': {
                                    bgcolor: darken(HEADER_BG_COLOR, 0.1),
                                },
                                '&.Mui-disabled': {
                                    bgcolor: alpha(HEADER_BG_COLOR, 0.3),
                                    color: alpha(HEADER_TEXT_COLOR, 0.5)
                                },
                                width: { xs: 40, sm: 48 },
                                height: { xs: 40, sm: 48 },
                                borderRadius: 2,
                                p: 0
                            }}
                            aria-label="Send message"
                            type="submit"
                        >
                            <SendIcon fontSize={isMobile ? "small" : "medium"} />
                        </IconButton>
                    </Stack>
                </Box>
            </Card>
        </Box>
    );
};

export default ChatInterface; 