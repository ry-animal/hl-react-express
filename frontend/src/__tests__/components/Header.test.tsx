import { render, screen, fireEvent } from '@testing-library/react';
import { describe, test, expect, vi, beforeEach, type Mock } from 'vitest';
import Header from '../../components/Header';
import { BrowserRouter } from 'react-router-dom';
import useStore from '../../store/useStore';
import { ThemeProvider } from '@mui/material/styles';
import { createTheme } from '@mui/material/styles';
import { useMediaQuery } from '@mui/material';

// Define store state type
type StoreState = {
    activeView: string;
    setActiveView: (view: string) => void;
};

// Mock the store
vi.mock('../../store/useStore', () => ({
    default: vi.fn(),
}));

// Mock useMediaQuery
vi.mock('@mui/material', async () => {
    const actual = await vi.importActual('@mui/material');
    return {
        ...actual as object,
        useMediaQuery: vi.fn(),
    };
});

// Mock the router hooks
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual as object,
        useNavigate: () => vi.fn(),
        useLocation: () => ({ pathname: '/' }),
    };
});

// Mock ThemeToggle component
vi.mock('../../components/ThemeToggle', () => ({
    default: () => <div data-testid="theme-toggle">Theme Toggle</div>,
}));

const theme = createTheme();

describe('Header', () => {
    const setActiveViewMock = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();

        // Setup default store mock
        (useStore as unknown as Mock).mockImplementation((selector: (state: StoreState) => unknown) => {
            const state: StoreState = {
                activeView: 'chat',
                setActiveView: setActiveViewMock,
            };
            return selector(state);
        });

        // Default to desktop view
        vi.mocked(useMediaQuery).mockReturnValue(false);
    });

    test('renders header with navigation buttons', () => {
        render(
            <BrowserRouter>
                <ThemeProvider theme={theme}>
                    <Header />
                </ThemeProvider>
            </BrowserRouter>
        );

        // Check for logo
        expect(screen.getByAltText(/reuben's brews logo/i)).toBeInTheDocument();

        // Check for navigation buttons
        expect(screen.getByRole('button', { name: /chat/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /session metrics/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /system metrics/i })).toBeInTheDocument();

        // Check for theme toggle
        expect(screen.getByTestId('theme-toggle')).toBeInTheDocument();
    });

    test('handles chat button click', () => {
        render(
            <BrowserRouter>
                <ThemeProvider theme={theme}>
                    <Header />
                </ThemeProvider>
            </BrowserRouter>
        );

        const chatButton = screen.getByRole('button', { name: /chat/i });
        fireEvent.click(chatButton);

        expect(setActiveViewMock).toHaveBeenCalledWith('chat');
    });

    test('handles session metrics button click', () => {
        render(
            <BrowserRouter>
                <ThemeProvider theme={theme}>
                    <Header />
                </ThemeProvider>
            </BrowserRouter>
        );

        const metricsButton = screen.getByRole('button', { name: /session metrics/i });
        fireEvent.click(metricsButton);

        expect(setActiveViewMock).toHaveBeenCalledWith('metrics');
    });

    test('renders in mobile view', () => {
        // Mock mobile view
        vi.mocked(useMediaQuery).mockReturnValue(true);

        render(
            <BrowserRouter>
                <ThemeProvider theme={theme}>
                    <Header />
                </ThemeProvider>
            </BrowserRouter>
        );

        // Check for logo in mobile view
        expect(screen.getByAltText(/reuben's brews logo/i)).toBeInTheDocument();

        // Buttons should still be present but might be styled differently
        expect(screen.getByRole('button', { name: /chat/i })).toBeInTheDocument();
    });
}); 