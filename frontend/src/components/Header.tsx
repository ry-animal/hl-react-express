import {
    AppBar,
    Box,
    Button,
    Container,
    Divider,
    Stack,
    Toolbar,
    useMediaQuery
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import ThemeToggle from './ThemeToggle';
import useStore from '../store/useStore';

const Header = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    // Get values from store
    const activeView = useStore(state => state.activeView);
    const setActiveView = useStore(state => state.setActiveView);

    return (
        <AppBar
            position="static"
            color="primary"
            elevation={0}
            sx={{
                borderBottom: `1px solid ${theme.palette.divider}`,
                width: '100%',
                left: 0,
                right: 0
            }}
        >
            <Container maxWidth={false} disableGutters>
                <Toolbar sx={{
                    flexDirection: isMobile ? 'column' : 'row',
                    py: isMobile ? 1 : 0,
                    width: '100%',
                    px: { xs: 2, md: 3 },
                    justifyContent: isMobile ? 'center' : 'space-between'
                }}>
                    <Box sx={{
                        display: 'flex',
                        alignItems: 'center',
                        width: isMobile ? '100%' : 'auto',
                        mb: isMobile ? 1 : 0,
                        justifyContent: isMobile ? 'center' : 'flex-start'
                    }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
                            <img src="/assets/logo.svg" alt="Reuben's Brews Logo" height="40" />
                        </Box>
                    </Box>

                    <Stack
                        direction="row"
                        spacing={1}
                        alignItems="center"
                        component="nav"
                        aria-label="Main Navigation"
                        sx={{
                            width: isMobile ? '100%' : 'auto',
                            justifyContent: isMobile ? 'center' : 'flex-end'
                        }}
                    >
                        <Button
                            color="inherit"
                            onClick={() => setActiveView('chat')}
                            sx={{
                                borderRadius: 2,
                                ...(activeView === 'chat' && {
                                    bgcolor: 'rgba(255,255,255,0.15)',
                                }),
                                minWidth: { xs: 64, sm: 80 },
                                py: 1,
                                fontWeight: activeView === 'chat' ? 600 : 400
                            }}
                            size={isMobile ? "small" : "medium"}
                            aria-pressed={activeView === 'chat'}
                        >
                            Chat
                        </Button>
                        <Button
                            color="inherit"
                            onClick={() => setActiveView('metrics')}
                            sx={{
                                borderRadius: 2,
                                ...(activeView === 'metrics' && {
                                    bgcolor: 'rgba(255,255,255,0.15)',
                                }),
                                minWidth: { xs: 64, sm: 80 },
                                py: 1,
                                fontWeight: activeView === 'metrics' ? 600 : 400
                            }}
                            size={isMobile ? "small" : "medium"}
                            aria-pressed={activeView === 'metrics'}
                        >
                            Metrics
                        </Button>
                        <Divider orientation="vertical" flexItem sx={{ mx: 1, display: { xs: 'none', sm: 'block' } }} />

                        <ThemeToggle />
                    </Stack>
                </Toolbar>
            </Container>
        </AppBar>
    );
};

export default Header; 