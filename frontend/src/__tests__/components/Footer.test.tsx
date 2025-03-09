import { render, screen } from '@testing-library/react';
import { describe, test, expect, vi } from 'vitest';
import Footer from '../../components/Footer';
import { ThemeProvider } from '@mui/material/styles';
import { createTheme } from '@mui/material/styles';
import { useMediaQuery } from '@mui/material';

// Mock useMediaQuery hook
vi.mock('@mui/material', async () => {
    const actual = await vi.importActual('@mui/material');
    return {
        ...actual as object,
        useMediaQuery: vi.fn(),
    };
});

// Create themes for testing
const lightTheme = createTheme({
    palette: {
        mode: 'light',
        primary: {
            main: '#2e7d32',
            contrastText: '#ffffff',
        },
        text: {
            secondary: '#4e4e4e',
        },
    },
});

const darkTheme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: '#66bb6a',
            contrastText: '#000000',
        },
        background: {
            paper: '#121212',
        },
        text: {
            secondary: '#aaaaaa',
        },
    },
});

describe('Footer', () => {
    test('renders Footer in light mode on desktop', () => {
        // Mock desktop view
        vi.mocked(useMediaQuery).mockReturnValue(false);

        render(
            <ThemeProvider theme={lightTheme}>
                <Footer />
            </ThemeProvider>
        );

        // Check that footer exists
        const footer = screen.getByRole('contentinfo', { name: /footer/i });
        expect(footer).toBeInTheDocument();

        // Check for the logo
        const logo = screen.getByAltText('Fremont logo');
        expect(logo).toBeInTheDocument();

        // Check for copyright text and current year
        const currentYear = new Date().getFullYear().toString();
        expect(screen.getByText(new RegExp(currentYear))).toBeInTheDocument();

        // Check for company name link
        const companyLink = screen.getByRole('link', { name: /reuben's brews website/i });
        expect(companyLink).toBeInTheDocument();
    });

    test('renders Footer in dark mode on mobile', () => {
        // Mock mobile view
        vi.mocked(useMediaQuery).mockReturnValue(true);

        render(
            <ThemeProvider theme={darkTheme}>
                <Footer />
            </ThemeProvider>
        );

        // Check that footer exists
        const footer = screen.getByRole('contentinfo', { name: /footer/i });
        expect(footer).toBeInTheDocument();

        // Check for the logo
        const logo = screen.getByAltText('Fremont logo');
        expect(logo).toBeInTheDocument();
        expect(logo).toHaveAttribute('height', '30'); // Mobile size

        // Check for copyright text
        const currentYear = new Date().getFullYear().toString();
        expect(screen.getByText(new RegExp(currentYear))).toBeInTheDocument();
    });
}); 