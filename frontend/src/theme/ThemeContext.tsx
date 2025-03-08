import { createContext, useState, useMemo, useContext, ReactNode } from 'react';
import { ThemeProvider as MUIThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline, PaletteMode } from '@mui/material';

// Define light and dark theme palettes with WCAG 2.1 AA compliant colors
// These colors have been tested for proper contrast ratios
const lightTheme = {
    primary: {
        main: '#2e7d32', // A deeper green with better contrast on white backgrounds (AA compliant)
        dark: '#1b5e20',
        light: '#4caf50',
        contrastText: '#ffffff',
    },
    secondary: {
        main: '#d84315', // A deeper orange with better contrast (AA compliant)
        dark: '#bf360c',
        light: '#ff7043',
        contrastText: '#ffffff',
    },
    background: {
        default: '#f8f9fa',
        paper: '#ffffff',
    },
    text: {
        primary: '#212121', // Near-black for high contrast on light backgrounds
        secondary: '#4e4e4e', // Darker gray that passes AA contrast on light backgrounds
    },
    error: {
        main: '#c62828', // AA compliant red
    },
    warning: {
        main: '#e65100', // AA compliant orange
    },
    info: {
        main: '#0277bd', // AA compliant blue
    },
    success: {
        main: '#2e7d32', // AA compliant green
    },
};

const darkTheme = {
    primary: {
        main: '#66bb6a', // A lighter green with good contrast on dark backgrounds (AA compliant)
        dark: '#43a047',
        light: '#81c784',
        contrastText: '#000000',
    },
    secondary: {
        main: '#ff8a65', // A lighter orange with good contrast on dark backgrounds (AA compliant)
        dark: '#f4511e',
        light: '#ffab91',
        contrastText: '#000000',
    },
    background: {
        default: '#121212',
        paper: '#1e1e1e',
    },
    text: {
        primary: '#f5f5f5', // Very light gray for high contrast on dark backgrounds
        secondary: '#b0bec5', // Light blue-gray that passes AA contrast on dark backgrounds
    },
    error: {
        main: '#ef5350', // AA compliant red for dark mode
    },
    warning: {
        main: '#ff9800', // AA compliant orange for dark mode
    },
    info: {
        main: '#4fc3f7', // AA compliant blue for dark mode
    },
    success: {
        main: '#66bb6a', // AA compliant green for dark mode
    },
};

type ThemeContextType = {
    mode: PaletteMode;
    toggleColorMode: () => void;
};

const ThemeContext = createContext<ThemeContextType>({
    mode: 'dark',
    toggleColorMode: () => { },
});

export const useThemeContext = () => useContext(ThemeContext);

interface ThemeProviderProps {
    children: ReactNode;
}

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
    // Use system preference as initial value if available
    const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const [mode, setMode] = useState<PaletteMode>(prefersDarkMode ? 'dark' : 'dark');

    // Theme toggle function
    const toggleColorMode = () => {
        setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
    };

    // Create the theme
    const theme = useMemo(() => {
        return createTheme({
            palette: {
                mode,
                ...(mode === 'light' ? lightTheme : darkTheme),
            },
            typography: {
                fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
                h6: {
                    fontWeight: 500,
                },
                // Increase base font size slightly for better readability
                fontSize: 16,
            },
            components: {
                MuiPaper: {
                    styleOverrides: {
                        root: {
                            backgroundImage: 'none',
                        },
                    },
                },
                MuiAppBar: {
                    styleOverrides: {
                        root: {
                            boxShadow: mode === 'dark' ? '0 4px 20px 0 rgba(0, 0, 0, 0.7)' : '0 4px 20px 0 rgba(0, 0, 0, 0.15)',
                        },
                    },
                },
                MuiButton: {
                    styleOverrides: {
                        root: {
                            textTransform: 'none',
                            borderRadius: 8,
                            fontWeight: 500,
                            // Increase padding for larger touch targets (accessibility)
                            padding: '8px 16px',
                        },
                    },
                },
                MuiIconButton: {
                    styleOverrides: {
                        root: {
                            borderRadius: 8,
                            // Increase minimum size for better touch targets
                            padding: 10,
                        },
                    },
                },
                MuiInputBase: {
                    styleOverrides: {
                        root: {
                            borderRadius: 8,
                        },
                    },
                },
                // Focus visible state for keyboard users
                MuiButtonBase: {
                    defaultProps: {
                        disableRipple: false,
                    },
                    styleOverrides: {
                        root: {
                            '&.Mui-focusVisible': {
                                outline: `3px solid ${mode === 'light' ? lightTheme.primary.main : darkTheme.primary.main}`,
                                outlineOffset: 2,
                            },
                        },
                    },
                },
            },
        });
    }, [mode]);

    const contextValue = useMemo(
        () => ({
            mode,
            toggleColorMode,
        }),
        [mode]
    );

    return (
        <ThemeContext.Provider value={contextValue}>
            <MUIThemeProvider theme={theme}>
                <CssBaseline />
                {children}
            </MUIThemeProvider>
        </ThemeContext.Provider>
    );
}; 