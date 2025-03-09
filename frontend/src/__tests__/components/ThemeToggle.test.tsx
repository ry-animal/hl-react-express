import { render, screen, fireEvent } from '@testing-library/react';
import { describe, test, expect, vi } from 'vitest';
import ThemeToggle from '../../components/ThemeToggle';
import * as ThemeContext from '../../theme/ThemeContext';

describe('ThemeToggle', () => {
    test('renders with light mode', () => {
        // Setup mock for light mode
        const toggleColorModeMock = vi.fn();
        vi.spyOn(ThemeContext, 'useThemeContext').mockReturnValue({
            mode: 'light',
            toggleColorMode: toggleColorModeMock,
        });

        render(<ThemeToggle />);

        // In light mode, we should see the dark mode icon (Brightness4Icon)
        const button = screen.getByRole('button', { name: /toggle light\/dark theme/i });
        expect(button).toBeInTheDocument();

        // Check for dark mode icon
        expect(screen.getByTestId('Brightness4Icon')).toBeInTheDocument();

        // Click the button and check if the toggle function was called
        fireEvent.click(button);
        expect(toggleColorModeMock).toHaveBeenCalledTimes(1);
    });

    test('renders with dark mode', () => {
        // Setup mock for dark mode
        const toggleColorModeMock = vi.fn();
        vi.spyOn(ThemeContext, 'useThemeContext').mockReturnValue({
            mode: 'dark',
            toggleColorMode: toggleColorModeMock,
        });

        render(<ThemeToggle />);

        // In dark mode, we should see the light mode icon (Brightness7Icon)
        const button = screen.getByRole('button', { name: /toggle light\/dark theme/i });
        expect(button).toBeInTheDocument();

        // Check for light mode icon
        expect(screen.getByTestId('Brightness7Icon')).toBeInTheDocument();

        // Click the button and check if the toggle function was called
        fireEvent.click(button);
        expect(toggleColorModeMock).toHaveBeenCalledTimes(1);
    });
}); 