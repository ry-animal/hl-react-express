import { Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import { ReactNode } from 'react';

import Footer from './Footer';
import Header from './Header';

// Create a styled component for visually hidden elements
const ScreenReaderOnly = styled('h1')({
    border: 0,
    clip: 'rect(0 0 0 0)',
    height: '1px',
    margin: '-1px',
    overflow: 'hidden',
    padding: 0,
    position: 'absolute',
    width: '1px',
    whiteSpace: 'nowrap',
    wordWrap: 'normal',
});

interface LayoutProps {
    children: ReactNode;
    title?: string;
    fullWidth?: boolean;
}

const Layout = ({ children, title = "Reuben's Brews Chatbot Application", fullWidth = false }: LayoutProps) => {
    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                minHeight: '100vh',
                width: '100vw',
                maxWidth: '100vw',
                backgroundColor: 'background.default',
                overflow: 'hidden',
            }}
        >
            <ScreenReaderOnly>
                {title}
            </ScreenReaderOnly>

            <Header />

            <Box
                component="main"
                sx={{
                    flex: 1,
                    display: 'flex',
                    width: '100%',
                    p: fullWidth ? 0 : { xs: 1, sm: 2 },
                    justifyContent: 'center',
                    alignItems: 'flex-start',
                    maxWidth: '100vw',
                    mx: 'auto',
                    overflowY: 'auto',
                }}
            >
                {children}
            </Box>

            <Footer />
        </Box>
    );
};

export default Layout; 